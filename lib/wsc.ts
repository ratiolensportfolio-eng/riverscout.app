// Environment Canada — Water Survey of Canada (WSC) hydrometric
// adapter. Mirrors lib/usgs.ts shape so the rest of the app doesn't
// care about the upstream agency.
//
// API base: https://api.weather.gc.ca/collections/hydrometric-realtime
// Discharge is reported in m³/s and converted to CFS (× 35.315).

import type { FlowData, FlowCondition } from '@/types'
import { fetchExternalJson } from './noaa-fetch'
import { getFlowCondition } from '@/data/rivers'

const REALTIME_BASE = 'https://api.weather.gc.ca/collections/hydrometric-realtime/items'
export const WSC_REVALIDATE_SECONDS = 900 // 15 min, same as USGS

const M3S_TO_CFS = 35.3146667

interface WscFeature {
  type: 'Feature'
  properties: {
    STATION_NUMBER: string
    STATION_NAME: string
    DATETIME: string
    LEVEL: number | null
    DISCHARGE: number | null
  }
}

function emptyFlow(): FlowData {
  return {
    cfs: null,
    gaugeHeightFt: null,
    condition: 'loading',
    trend: null,
    changePerHour: null,
    changeIn3Hours: null,
    rateLabel: 'Rate unknown',
    percentile: null,
    tempC: null,
    readings: [],
    fetchedAt: new Date(),
  }
}

// Same rate-of-change shape as lib/usgs — kept private here so the
// adapters stay independent. If we add more agencies we can lift it
// to a shared util.
function calcRate(readings: Array<{ t: string; v: number }>) {
  if (readings.length < 2) {
    return { trend: null as 'up' | 'down' | 'flat' | null, changePerHour: null, changeIn3Hours: null, rateLabel: 'Rate unknown' }
  }
  const lastT = new Date(readings[readings.length - 1].t).getTime()
  const target1h = lastT - 60 * 60 * 1000
  const target3h = lastT - 3 * 60 * 60 * 1000
  let near1: typeof readings[0] | null = null
  let near3: typeof readings[0] | null = null
  let bestD1 = Infinity, bestD3 = Infinity
  for (const r of readings) {
    const t = new Date(r.t).getTime()
    const d1 = Math.abs(t - target1h)
    const d3 = Math.abs(t - target3h)
    if (d1 < bestD1 && d1 < 20 * 60 * 1000) { bestD1 = d1; near1 = r }
    if (d3 < bestD3 && d3 < 30 * 60 * 1000) { bestD3 = d3; near3 = r }
  }
  const last = readings[readings.length - 1].v
  const change3h = near3 ? last - near3.v : null
  let cph: number | null = null
  if (near1) cph = last - near1.v
  else if (change3h !== null) cph = change3h / 3
  const trend: 'up' | 'down' | 'flat' = cph === null ? 'flat' : cph > 25 ? 'up' : cph < -25 ? 'down' : 'flat'
  const sign = cph !== null && cph >= 0 ? '+' : ''
  const rateLabel = cph === null ? 'Rate unknown'
    : Math.abs(cph) < 25 ? 'Stable'
    : `${trend === 'up' ? 'Rising' : 'Falling'} ${Math.abs(cph) > 200 ? 'fast' : 'slowly'} (${sign}${Math.round(cph)} cfs/hr)`
  return { trend, changePerHour: cph, changeIn3Hours: change3h, rateLabel }
}

export async function fetchWscGaugeData(stationNumber: string, optRange: string): Promise<FlowData> {
  // Pull the last 7 days of readings for this station, sorted by time.
  // The collection holds one feature per station per timestamp.
  const since = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString()
  const url = `${REALTIME_BASE}?STATION_NUMBER=${encodeURIComponent(stationNumber)}&datetime=${encodeURIComponent(since + '/..')}&limit=2000&sortby=DATETIME&f=json`

  const json = await fetchExternalJson<{ features?: WscFeature[] }>(url, {
    timeoutMs: 10000,
    retries: 1,
    nextRevalidate: WSC_REVALIDATE_SECONDS,
  })
  if (!json) return emptyFlow()

  try {
    const feats = json.features ?? []
    if (!feats.length) return emptyFlow()

    // Sort ascending by time — WSC may return newest-first or oldest-first
    // depending on sortby support; normalize.
    feats.sort((a, b) => new Date(a.properties.DATETIME).getTime() - new Date(b.properties.DATETIME).getTime())

    const readings: Array<{ t: string; v: number }> = []
    let cfs: number | null = null
    let gaugeHeightFt: number | null = null

    for (const f of feats) {
      const p = f.properties
      if (p.DISCHARGE != null && isFinite(p.DISCHARGE)) {
        const v = p.DISCHARGE * M3S_TO_CFS
        readings.push({ t: p.DATETIME, v })
        cfs = v
      }
      if (p.LEVEL != null && isFinite(p.LEVEL)) {
        // m → ft
        gaugeHeightFt = Math.round(p.LEVEL * 3.28084 * 100) / 100
      }
    }

    const rate = calcRate(readings)
    const condition: FlowCondition = cfs !== null ? getFlowCondition(cfs, optRange) : 'loading'

    return {
      cfs: cfs !== null ? Math.round(cfs) : null,
      gaugeHeightFt,
      condition,
      trend: rate.trend,
      changePerHour: rate.changePerHour,
      changeIn3Hours: rate.changeIn3Hours,
      rateLabel: rate.rateLabel,
      percentile: null,
      tempC: null,  // WSC realtime doesn't include temp
      readings,
      fetchedAt: new Date(),
    }
  } catch {
    return emptyFlow()
  }
}

// Detect whether a gauge ID is a WSC station number rather than a USGS
// site number. WSC uses uppercase-letter prefixes (e.g. "05BH004",
// "07AA007"); USGS sites are all-numeric. This is the routing rule
// that lib/usgs.ts uses to dispatch.
export function isWscStation(id: string): boolean {
  return /[A-Z]/.test(id)
}
