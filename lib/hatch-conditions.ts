// Hatch condition evaluation logic
// Used by the cron job to determine when to fire hatch alerts

export interface HatchCondition {
  riverId: string
  hatchName: string
  species: string
  tempTriggerF: number | null
  tempTriggerMaxF: number | null
  peakStartMonth: number
  peakEndMonth: number
  peakStartDay: number
  peakEndDay: number
  conditionsDescription: string
}

export type HatchStatus = 'approaching' | 'imminent' | 'active' | 'peak' | 'fading' | 'off_season'

export interface HatchEvaluation {
  status: HatchStatus
  triggerMet: boolean
  daysUntilPeak: number | null
  daysIntoHatch: number | null
  message: string
  alertShouldFire: boolean
}

function getDayOfYear(date: Date): number {
  const start = new Date(date.getFullYear(), 0, 0)
  return Math.floor((date.getTime() - start.getTime()) / 86400000)
}

function monthDayToDay(month: number, day: number): number {
  const d = new Date(2024, month - 1, day) // 2024 is a leap year
  return getDayOfYear(d)
}

function getDaysUntil(targetMonth: number, targetDay: number, from: Date): number {
  const thisYear = from.getFullYear()
  let target = new Date(thisYear, targetMonth - 1, targetDay)
  if (target < from) {
    target = new Date(thisYear + 1, targetMonth - 1, targetDay)
  }
  return Math.round((target.getTime() - from.getTime()) / 86400000)
}

function getDaysSince(targetMonth: number, targetDay: number, from: Date): number {
  const thisYear = from.getFullYear()
  let target = new Date(thisYear, targetMonth - 1, targetDay)
  if (target > from) {
    target = new Date(thisYear - 1, targetMonth - 1, targetDay)
  }
  return Math.round((from.getTime() - target.getTime()) / 86400000)
}

function isInDateRange(
  currentMonth: number, currentDay: number,
  startMonth: number, startDay: number,
  endMonth: number, endDay: number,
): boolean {
  const current = monthDayToDay(currentMonth, currentDay)
  const start = monthDayToDay(startMonth, startDay)
  const end = monthDayToDay(endMonth, endDay)

  if (start <= end) {
    return current >= start && current <= end
  }
  // Wraps around year boundary (e.g., Nov–Feb)
  return current >= start || current <= end
}

export function evaluateHatchConditions(
  hatch: HatchCondition,
  currentWaterTempF: number | null,
  currentDate: Date,
): HatchEvaluation {
  const currentMonth = currentDate.getMonth() + 1
  const currentDay = currentDate.getDate()

  // Check temperature trigger
  const hasTempData = currentWaterTempF !== null
  const tempTriggerMet = hatch.tempTriggerF && hasTempData
    ? currentWaterTempF >= hatch.tempTriggerF
    : !hatch.tempTriggerF // If no temp trigger defined, consider it met

  // Check if temp is in the ideal range
  const tempInIdealRange = hatch.tempTriggerF && hatch.tempTriggerMaxF && hasTempData
    ? currentWaterTempF >= hatch.tempTriggerF && currentWaterTempF <= hatch.tempTriggerMaxF
    : false

  // Check calendar window
  const inPeakWindow = isInDateRange(
    currentMonth, currentDay,
    hatch.peakStartMonth, hatch.peakStartDay,
    hatch.peakEndMonth, hatch.peakEndDay,
  )

  // Days until peak start
  const daysUntilPeak = getDaysUntil(hatch.peakStartMonth, hatch.peakStartDay, currentDate)
  // If we're already past the start this year, daysUntilPeak wraps to next year — cap it
  const effectiveDaysUntil = inPeakWindow ? 0 : (daysUntilPeak > 180 ? null : daysUntilPeak)

  const daysIntoHatch = inPeakWindow
    ? getDaysSince(hatch.peakStartMonth, hatch.peakStartDay, currentDate)
    : null

  // Peak conditions: in window + temp in ideal range
  if (inPeakWindow && tempInIdealRange) {
    return {
      status: 'peak',
      triggerMet: true,
      daysUntilPeak: 0,
      daysIntoHatch,
      message: `${hatch.hatchName} at peak conditions — water temp ${currentWaterTempF}°F`,
      alertShouldFire: true,
    }
  }

  // Active: in window + temp trigger met (but maybe not ideal range)
  if (inPeakWindow && tempTriggerMet) {
    return {
      status: 'active',
      triggerMet: true,
      daysUntilPeak: 0,
      daysIntoHatch,
      message: `${hatch.hatchName} is active — water temp ${hasTempData ? currentWaterTempF + '°F' : 'unknown'}`,
      alertShouldFire: true,
    }
  }

  // Imminent: temp trigger met, peak within 7 days
  if (tempTriggerMet && effectiveDaysUntil !== null && effectiveDaysUntil <= 7) {
    return {
      status: 'imminent',
      triggerMet: true,
      daysUntilPeak: effectiveDaysUntil,
      daysIntoHatch: null,
      message: `${hatch.hatchName} imminent — ${hasTempData ? 'temp trigger met, ' : ''}peak in ${effectiveDaysUntil} days`,
      alertShouldFire: true,
    }
  }

  // Approaching: within 14 days but temp not yet met
  if (effectiveDaysUntil !== null && effectiveDaysUntil <= 14) {
    return {
      status: 'approaching',
      triggerMet: false,
      daysUntilPeak: effectiveDaysUntil,
      daysIntoHatch: null,
      message: hatch.tempTriggerF && hasTempData
        ? `${hatch.hatchName} approaching — need ${hatch.tempTriggerF}°F, currently ${currentWaterTempF}°F`
        : `${hatch.hatchName} approaching — peak in ${effectiveDaysUntil} days`,
      alertShouldFire: false,
    }
  }

  // Fading: past the peak window end within last 14 days
  const daysSinceEnd = getDaysSince(hatch.peakEndMonth, hatch.peakEndDay, currentDate)
  if (daysSinceEnd <= 14 && daysSinceEnd > 0 && !inPeakWindow) {
    return {
      status: 'fading',
      triggerMet: false,
      daysUntilPeak: null,
      daysIntoHatch: null,
      message: `${hatch.hatchName} fading — peak window ended ${daysSinceEnd} days ago`,
      alertShouldFire: false,
    }
  }

  return {
    status: 'off_season',
    triggerMet: false,
    daysUntilPeak: effectiveDaysUntil,
    daysIntoHatch: null,
    message: `${hatch.hatchName} — off season`,
    alertShouldFire: false,
  }
}

// Parse timing string like "Late June – Early July" into month/day ranges
export function parseTimingString(timing: string): { startMonth: number; startDay: number; endMonth: number; endDay: number } | null {
  const MONTHS: Record<string, number> = {
    january: 1, february: 2, march: 3, april: 4, may: 5, june: 6,
    july: 7, august: 8, september: 9, october: 10, november: 11, december: 12,
    jan: 1, feb: 2, mar: 3, apr: 4, jun: 6, jul: 7, aug: 8, sep: 9, oct: 10, nov: 11, dec: 12,
  }

  // Handle "Year-round"
  if (timing.toLowerCase().includes('year-round')) {
    return { startMonth: 1, startDay: 1, endMonth: 12, endDay: 31 }
  }

  // Handle multi-season like "March–May, September–October" — use the first range
  const firstRange = timing.split(',')[0].trim()

  // Parse "Late June – Early July", "May–June", "Late April – Mid May", etc.
  const parts = firstRange.split(/\s*[–—-]\s*/)
  if (parts.length < 2) {
    // Single month like "June"
    const m = Object.entries(MONTHS).find(([k]) => firstRange.toLowerCase().includes(k))
    if (m) return { startMonth: m[1], startDay: 1, endMonth: m[1], endDay: 28 }
    return null
  }

  function parseMonthPart(s: string): { month: number; day: number } | null {
    const lower = s.toLowerCase().trim()
    const monthEntry = Object.entries(MONTHS).find(([k]) => lower.includes(k))
    if (!monthEntry) return null
    const month = monthEntry[1]

    if (lower.includes('early') || lower.includes('mid')) {
      return { month, day: lower.includes('early') ? 5 : 15 }
    }
    if (lower.includes('late')) {
      return { month, day: 22 }
    }
    return { month, day: 1 }
  }

  const start = parseMonthPart(parts[0])
  const end = parseMonthPart(parts[parts.length - 1])

  if (!start || !end) return null

  // If end has no explicit qualifier, assume end of month
  const endDay = parts[parts.length - 1].toLowerCase().includes('early') ? 10
    : parts[parts.length - 1].toLowerCase().includes('mid') ? 20
    : 28

  return {
    startMonth: start.month,
    startDay: start.day,
    endMonth: end.month,
    endDay: endDay,
  }
}
