import type { FlowData, FlowCondition, TrendDirection } from '@/types'
import { getFlowCondition } from '@/data/rivers'

const IV_BASE = 'https://waterservices.usgs.gov/nwis/iv/'
const STAT_BASE = 'https://waterservices.usgs.gov/nwis/stat/'

interface USGSValue {
  value: string
  dateTime: string
  qualifiers: string[]
}

interface USGSTimeSeries {
  variable: { variableCode: Array<{ value: string }> }
  values: Array<{ value: USGSValue[] }>
}

// Fetch current flow + 7-day history for a gauge
export async function fetchGaugeData(gaugeId: string, optRange: string): Promise<FlowData> {
  const url = `${IV_BASE}?format=json&sites=${gaugeId}&parameterCd=00060,00010&siteStatus=active&period=P7D`

  try {
    const res = await fetch(url, { next: { revalidate: 900 } }) // 15 min cache
    if (!res.ok) throw new Error(`USGS responded ${res.status}`)

    const json = await res.json()
    const series: USGSTimeSeries[] = json?.value?.timeSeries ?? []

    let cfs: number | null = null
    let tempC: number | null = null
    const readings: Array<{ t: string; v: number }> = []

    for (const ts of series) {
      const code = ts.variable.variableCode[0]?.value
      const vals = ts.values[0]?.value ?? []

      if (code === '00060') {
        // Discharge (CFS)
        const valid = vals.filter(v => v.value !== '-999999' && !isNaN(Number(v.value)))
        for (const v of valid) {
          readings.push({ t: v.dateTime, v: Number(v.value) })
        }
        if (valid.length > 0) {
          cfs = Number(valid[valid.length - 1].value)
        }
      }

      if (code === '00010') {
        // Temperature (°C)
        const valid = vals.filter(v => v.value !== '-999999' && !isNaN(Number(v.value)))
        if (valid.length > 0) {
          tempC = Number(valid[valid.length - 1].value)
        }
      }
    }

    // Compute 6-hour trend
    let trend: TrendDirection | null = null
    let trendDelta: number | null = null
    let trendDeltaPct: number | null = null

    if (readings.length >= 2 && cfs !== null) {
      const sixHoursAgo = new Date(Date.now() - 6 * 60 * 60 * 1000)
      const old = readings.find(r => new Date(r.t) <= sixHoursAgo)
      if (old) {
        trendDelta = Math.round(cfs - old.v)
        trendDeltaPct = Math.round((trendDelta / old.v) * 100)
        if (Math.abs(trendDelta) < old.v * 0.03) trend = 'flat'
        else trend = trendDelta > 0 ? 'up' : 'down'
      }
    }

    const condition: FlowCondition = cfs !== null
      ? getFlowCondition(cfs, optRange)
      : 'loading'

    return { cfs, condition, trend, trendDelta, trendDeltaPct, percentile: null, tempC, readings, fetchedAt: new Date() }
  } catch {
    return { cfs: null, condition: 'loading', trend: null, trendDelta: null, trendDeltaPct: null, percentile: null, tempC: null, readings: [], fetchedAt: new Date() }
  }
}

// Fetch historical percentile for today's date
export async function fetchPercentile(gaugeId: string): Promise<number | null> {
  const now = new Date()
  const month = String(now.getMonth() + 1).padStart(2, '0')
  const day = String(now.getDate()).padStart(2, '0')
  const url = `${STAT_BASE}?format=json&sites=${gaugeId}&statReportType=daily&statType=mean&parameterCd=00060`

  try {
    const res = await fetch(url, { next: { revalidate: 86400 } }) // 24 hr cache
    if (!res.ok) return null

    const json = await res.json()
    const series = json?.value?.timeSeries?.[0]
    const values: Array<{ dateTime: string; value: string; statisticType: string }> =
      series?.values?.[0]?.value ?? []

    // Find today's date entry
    const todayEntry = values.find(v => {
      const [, m, d] = v.dateTime.split('-')
      return m === month && d?.startsWith(day)
    })

    if (!todayEntry) return null
    return Math.round(Number(todayEntry.value))
  } catch {
    return null
  }
}

// Format CFS with commas
export function formatCfs(cfs: number | null): string {
  if (cfs === null) return '—'
  return cfs.toLocaleString()
}

// Trend arrow character
export function trendArrow(trend: TrendDirection | null): string {
  if (trend === 'up') return '↑'
  if (trend === 'down') return '↓'
  return '→'
}

// Water temperature in Fahrenheit
export function celsiusToFahrenheit(c: number): number {
  return Math.round(c * 9 / 5 + 32)
}

export function isHypothermiaRisk(tempC: number | null): boolean {
  if (tempC === null) return false
  return celsiusToFahrenheit(tempC) < 55
}
