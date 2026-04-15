import type { FlowData, FlowCondition, TrendDirection } from '@/types'
import { getFlowCondition } from '@/data/rivers'
import { fetchExternalJson } from '@/lib/noaa-fetch'

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

// Cache window for live USGS gauge data — matches USGS instantaneous-value
// update cadence (~15 min). Used by both fetchGaugeData and the route segment
// revalidate on every page/route that surfaces this data.
export const USGS_REVALIDATE_SECONDS = 900 // 15 minutes

// Empty / failure response. Centralized so the field shape only has to be
// maintained in one place when FlowData changes.
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

// Find the reading whose timestamp is closest to `targetMs` and within
// `toleranceMs`. Returns null if no reading is within tolerance.
function findReadingNear(
  readings: Array<{ t: string; v: number }>,
  targetMs: number,
  toleranceMs: number,
): { t: string; v: number } | null {
  let best: { t: string; v: number } | null = null
  let bestDist = Infinity
  for (const r of readings) {
    const dist = Math.abs(new Date(r.t).getTime() - targetMs)
    if (dist < bestDist && dist <= toleranceMs) {
      bestDist = dist
      best = r
    }
  }
  return best
}

interface RateOfChange {
  changePerHour: number | null
  changeIn3Hours: number | null
  rateLabel: string
  trend: TrendDirection | null
}

// Compute rate of change from the readings array. The readings are
// returned by USGS in chronological order at ~15 min intervals over the
// past 7 days, so we have plenty of data points to find ones close to
// 1h and 3h ago. Tolerance ±20 min absorbs the case where USGS misses
// a reading or the gauge updates on an offset cadence.
//
// Thresholds for the rate label match the user's spec:
//   |rate| < 25       → Stable
//   25-100            → Rising/falling slowly
//   100-300           → Rising/falling
//   > 300             → Rising/falling fast (often a flood signal)
function calculateRateOfChange(
  readings: Array<{ t: string; v: number }>,
): RateOfChange {
  if (readings.length < 2) {
    return { changePerHour: null, changeIn3Hours: null, rateLabel: 'Rate unknown', trend: null }
  }

  const latest = readings[readings.length - 1]
  const latestMs = new Date(latest.t).getTime()
  const TOLERANCE_MS = 20 * 60 * 1000 // ±20 min

  const oneHourAgo = findReadingNear(readings, latestMs - 60 * 60 * 1000, TOLERANCE_MS)
  const threeHoursAgo = findReadingNear(readings, latestMs - 3 * 60 * 60 * 1000, TOLERANCE_MS)

  // Prefer the direct 1h delta. Fall back to 3h delta divided by 3 if a
  // 1h reading isn't available (e.g. gauge that reports hourly instead of
  // every 15 min). Returns null only when neither window has data.
  let changePerHour: number | null = null
  if (oneHourAgo) {
    changePerHour = Math.round(latest.v - oneHourAgo.v)
  } else if (threeHoursAgo) {
    changePerHour = Math.round((latest.v - threeHoursAgo.v) / 3)
  }

  const changeIn3Hours = threeHoursAgo
    ? Math.round(latest.v - threeHoursAgo.v)
    : null

  if (changePerHour === null) {
    return { changePerHour, changeIn3Hours, rateLabel: 'Rate unknown', trend: null }
  }

  const rate = changePerHour
  const fmt = (n: number) => (n > 0 ? '+' : '') + n.toLocaleString()

  if (Math.abs(rate) < 25) {
    return { changePerHour, changeIn3Hours, rateLabel: 'Stable', trend: 'flat' }
  }

  if (rate > 0) {
    let label: string
    if (rate > 300) label = `Rising fast (${fmt(rate)} cfs/hr)`
    else if (rate > 100) label = `Rising (${fmt(rate)} cfs/hr)`
    else label = `Rising slowly (${fmt(rate)} cfs/hr)`
    return { changePerHour, changeIn3Hours, rateLabel: label, trend: 'up' }
  }

  // rate < -25: falling
  const absRate = Math.abs(rate)
  let label: string
  if (absRate > 300) label = `Falling fast (${fmt(rate)} cfs/hr)`
  else if (absRate > 100) label = `Falling (${fmt(rate)} cfs/hr)`
  else label = `Falling slowly (${fmt(rate)} cfs/hr)`
  return { changePerHour, changeIn3Hours, rateLabel: label, trend: 'down' }
}

// Fetch current flow + 7-day history for a gauge.
// We pull three USGS parameters in one call:
//   00060 — discharge (cfs)
//   00065 — gauge height (feet)
//   00010 — water temperature (celsius)
// Each `period=P7D` request returns ~672 readings per parameter (every
// 15 min). The cfs readings drive the rate-of-change calculation.
export async function fetchGaugeData(gaugeId: string, optRange: string): Promise<FlowData> {
  // Route Canadian gauges to the WSC adapter. WSC station numbers
  // always include uppercase letters (e.g. "05BH004"); USGS site
  // numbers are all-digit. Lazy-import to keep the existing USGS
  // bundle tree-shakeable for callers that never see Canadian rivers.
  if (/[A-Z]/.test(gaugeId)) {
    const { fetchWscGaugeData } = await import('./wsc')
    return fetchWscGaugeData(gaugeId, optRange)
  }
  const url = `${IV_BASE}?format=json&sites=${gaugeId}&parameterCd=00060,00065,00010&siteStatus=active&period=P7D`

  const json = await fetchExternalJson<{ value?: { timeSeries?: USGSTimeSeries[] } }>(url, {
    timeoutMs: 10000,
    retries: 1,
    nextRevalidate: USGS_REVALIDATE_SECONDS,
  })

  if (!json) return emptyFlow()

  try {
    const series: USGSTimeSeries[] = json?.value?.timeSeries ?? []

    let cfs: number | null = null
    let gaugeHeightFt: number | null = null
    let tempC: number | null = null
    const readings: Array<{ t: string; v: number }> = []

    for (const ts of series) {
      const code = ts.variable.variableCode[0]?.value
      const vals = ts.values[0]?.value ?? []
      const valid = vals.filter(v => v.value !== '-999999' && !isNaN(Number(v.value)))

      if (code === '00060') {
        // Discharge (CFS) — keep the full 7-day series for rate calc
        for (const v of valid) {
          readings.push({ t: v.dateTime, v: Number(v.value) })
        }
        if (valid.length > 0) {
          cfs = Number(valid[valid.length - 1].value)
        }
      } else if (code === '00065') {
        // Gauge height (feet) — only the latest value matters for the UI.
        // Stage is reported to two decimal places in the USGS feed.
        if (valid.length > 0) {
          gaugeHeightFt = Math.round(Number(valid[valid.length - 1].value) * 100) / 100
        }
      } else if (code === '00010') {
        // Temperature (°C)
        if (valid.length > 0) {
          tempC = Number(valid[valid.length - 1].value)
        }
      }
    }

    const rate = calculateRateOfChange(readings)

    const condition: FlowCondition = cfs !== null
      ? getFlowCondition(cfs, optRange)
      : 'loading'

    return {
      cfs,
      gaugeHeightFt,
      condition,
      trend: rate.trend,
      changePerHour: rate.changePerHour,
      changeIn3Hours: rate.changeIn3Hours,
      rateLabel: rate.rateLabel,
      percentile: null,
      tempC,
      readings,
      fetchedAt: new Date(),
    }
  } catch {
    return emptyFlow()
  }
}

// Fetch historical percentile for today's date
export async function fetchPercentile(gaugeId: string): Promise<number | null> {
  const now = new Date()
  const month = String(now.getMonth() + 1).padStart(2, '0')
  const day = String(now.getDate()).padStart(2, '0')
  const url = `${STAT_BASE}?format=json&sites=${gaugeId}&statReportType=daily&statType=mean&parameterCd=00060`

  // Daily statistics — refresh once per day, not every 15 min.
  const json = await fetchExternalJson<{ value?: { timeSeries?: Array<{ values?: Array<{ value?: Array<{ dateTime: string; value: string; statisticType: string }> }> }> } }>(url, {
    timeoutMs: 10000,
    retries: 1,
    nextRevalidate: 86400,
  })
  if (!json) return null

  try {
    const series = json?.value?.timeSeries?.[0]
    const values = series?.values?.[0]?.value ?? []

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

// Water temperature in Fahrenheit
export function celsiusToFahrenheit(c: number): number {
  return Math.round(c * 9 / 5 + 32)
}

export function isHypothermiaRisk(tempC: number | null): boolean {
  if (tempC === null) return false
  return celsiusToFahrenheit(tempC) < 55
}
