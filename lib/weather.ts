// NOAA Weather API integration for river conditions
// Uses api.weather.gov (free, no API key required)
// GPS coordinates from data/river-coordinates.ts

import SunCalc from 'suncalc'

export interface HourlyForecast {
  time: string
  tempF: number
  windSpeedMph: number
  windDirection: string
  shortForecast: string
  precipChance: number
  humidity: number
  dewpointF: number
  isDaytime: boolean
  hasThunderstorm: boolean
  hasRain: boolean
}

export interface DailyForecast {
  name: string          // "Tuesday", "Tuesday Night"
  tempF: number
  isDaytime: boolean
  shortForecast: string
  detailedForecast: string
  windSpeed: string
  precipChance: number
  hasThunderstorm: boolean
  hasRain: boolean
  rainWindow: string | null      // "2pm–6pm" or null if no rain
  estimatedInches: number | null // estimated accumulation
}

export interface RiverWeather {
  current: HourlyForecast | null
  hourly: HourlyForecast[]
  daily: DailyForecast[]
  todayHigh: number | null
  todayLow: number | null
  tomorrowHigh: number | null
  tomorrowLow: number | null
  sunrise: string | null
  sunset: string | null
  thunderstormRisk: boolean
  rainNext24h: boolean
  fetchedAt: string
}

// Cache grid lookups — NOAA requires a two-step process:
// 1. /points/{lat},{lng} → gridId, gridX, gridY
// 2. /gridpoints/{gridId}/{gridX},{gridY}/forecast/hourly
const gridCache = new Map<string, { gridId: string; gridX: number; gridY: number }>()

function parseWindSpeed(windStr: string): number {
  // "14 mph" or "5 to 10 mph" → take the higher number
  const nums = windStr.match(/\d+/g)
  if (!nums) return 0
  return Math.max(...nums.map(Number))
}

function celsiusToF(c: number): number {
  return Math.round(c * 9 / 5 + 32)
}

function detectThunderstorm(forecast: string): boolean {
  const lower = forecast.toLowerCase()
  return lower.includes('thunder') || lower.includes('tstm') || lower.includes('t-storm')
}

function detectRain(forecast: string): boolean {
  const lower = forecast.toLowerCase()
  return lower.includes('rain') || lower.includes('shower') || lower.includes('drizzle')
}

async function getGrid(lat: number, lng: number): Promise<{ gridId: string; gridX: number; gridY: number } | null> {
  const key = `${lat},${lng}`
  if (gridCache.has(key)) return gridCache.get(key)!

  try {
    const res = await fetch(`https://api.weather.gov/points/${lat},${lng}`, {
      headers: { 'User-Agent': 'RiverScout (riverscout.app, outfitters@riverscout.app)' },
      cache: 'force-cache',
    })
    if (!res.ok) return null

    const json = await res.json()
    const props = json.properties
    if (!props?.gridId) return null

    const grid = { gridId: props.gridId, gridX: props.gridX, gridY: props.gridY }
    gridCache.set(key, grid)
    return grid
  } catch {
    return null
  }
}

export async function fetchRiverWeather(lat: number, lng: number): Promise<RiverWeather | null> {
  const grid = await getGrid(lat, lng)
  if (!grid) return null

  try {
    const url = `https://api.weather.gov/gridpoints/${grid.gridId}/${grid.gridX},${grid.gridY}/forecast/hourly`
    const res = await fetch(url, {
      headers: { 'User-Agent': 'RiverScout (riverscout.app, outfitters@riverscout.app)' },
      cache: 'no-store', // always fresh weather data
    })
    if (!res.ok) return null

    const json = await res.json()
    const periods: Array<{
      startTime: string
      temperature: number
      temperatureUnit: string
      windSpeed: string
      windDirection: string
      shortForecast: string
      probabilityOfPrecipitation: { value: number | null }
      relativeHumidity: { value: number | null }
      dewpoint: { unitCode: string; value: number | null }
      isDaytime: boolean
    }> = json.properties?.periods ?? []

    if (periods.length === 0) return null

    const hourly: HourlyForecast[] = periods.slice(0, 72).map(p => ({
      time: p.startTime,
      tempF: p.temperatureUnit === 'F' ? p.temperature : celsiusToF(p.temperature),
      windSpeedMph: parseWindSpeed(p.windSpeed),
      windDirection: p.windDirection,
      shortForecast: p.shortForecast,
      precipChance: p.probabilityOfPrecipitation?.value ?? 0,
      humidity: p.relativeHumidity?.value ?? 0,
      dewpointF: p.dewpoint?.value != null ? celsiusToF(p.dewpoint.value) : 0,
      isDaytime: p.isDaytime,
      hasThunderstorm: detectThunderstorm(p.shortForecast),
      hasRain: detectRain(p.shortForecast),
    }))

    // Compute today/tomorrow highs and lows
    const now = new Date()
    const todayStr = now.toISOString().split('T')[0]
    const tomorrow = new Date(now.getTime() + 86400000)
    const tomorrowStr = tomorrow.toISOString().split('T')[0]

    const todayTemps = hourly.filter(h => h.time.startsWith(todayStr)).map(h => h.tempF)
    const tomorrowTemps = hourly.filter(h => h.time.startsWith(tomorrowStr)).map(h => h.tempF)

    // Sunrise/sunset via suncalc
    const sun = SunCalc.getTimes(now, lat, lng)
    const sunriseStr = sun.sunrise ? sun.sunrise.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' }) : null
    const sunsetStr = sun.sunset ? sun.sunset.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' }) : null

    // Fetch 7-day daily forecast
    const dailyUrl = `https://api.weather.gov/gridpoints/${grid.gridId}/${grid.gridX},${grid.gridY}/forecast`
    let daily: DailyForecast[] = []
    try {
      const dailyRes = await fetch(dailyUrl, {
        headers: { 'User-Agent': 'RiverScout (riverscout.app, outfitters@riverscout.app)' },
        cache: 'no-store',
      })
      if (dailyRes.ok) {
        const dailyJson = await dailyRes.json()
        const dailyPeriods: Array<{
          name: string
          temperature: number
          temperatureUnit: string
          isDaytime: boolean
          shortForecast: string
          detailedForecast: string
          windSpeed: string
          probabilityOfPrecipitation: { value: number | null }
        }> = dailyJson.properties?.periods ?? []

        daily = dailyPeriods.slice(0, 14).map(p => {
          const hasRain = detectRain(p.shortForecast) || detectRain(p.detailedForecast)
          const hasThunderstorm = detectThunderstorm(p.shortForecast) || detectThunderstorm(p.detailedForecast)
          const precipChance = p.probabilityOfPrecipitation?.value ?? 0

          // Compute rain window from hourly data
          let rainWindow: string | null = null
          let estimatedInches: number | null = null

          if (hasRain || precipChance >= 30) {
            // Find hourly entries that match this day period
            const dayName = p.name.replace(/ Night$/, '')
            const dayMap: Record<string, number> = {
              'Sunday': 0, 'Monday': 1, 'Tuesday': 2, 'Wednesday': 3,
              'Thursday': 4, 'Friday': 5, 'Saturday': 6,
              'Today': now.getDay(), 'Tonight': now.getDay(),
              'This Afternoon': now.getDay(),
            }
            const targetDay = dayMap[dayName] ?? dayMap[p.name] ?? -1

            const matchingHours = hourly.filter(h => {
              const d = new Date(h.time)
              if (d.getDay() !== targetDay) return false
              if (p.isDaytime) return d.getHours() >= 6 && d.getHours() < 18
              return d.getHours() >= 18 || d.getHours() < 6
            })

            const rainyHours = matchingHours.filter(h => h.precipChance >= 30 || h.hasRain)
            if (rainyHours.length > 0) {
              const firstRain = new Date(rainyHours[0].time)
              const lastRain = new Date(rainyHours[rainyHours.length - 1].time)
              const fmtHour = (d: Date) => {
                const h = d.getHours()
                if (h === 0) return '12am'
                if (h === 12) return '12pm'
                return h > 12 ? `${h - 12}pm` : `${h}am`
              }
              rainWindow = `${fmtHour(firstRain)}–${fmtHour(new Date(lastRain.getTime() + 3600000))}`

              // Estimate accumulation: ~0.02-0.05 inches per hour of rain at typical chance
              const avgChance = rainyHours.reduce((s, h) => s + h.precipChance, 0) / rainyHours.length
              const ratePerHour = hasThunderstorm ? 0.15 : (avgChance > 70 ? 0.08 : 0.04)
              estimatedInches = Math.round(rainyHours.length * ratePerHour * 10) / 10
            }
          }

          return {
            name: p.name,
            tempF: p.temperatureUnit === 'F' ? p.temperature : celsiusToF(p.temperature),
            isDaytime: p.isDaytime,
            shortForecast: p.shortForecast,
            detailedForecast: p.detailedForecast,
            windSpeed: p.windSpeed,
            precipChance,
            hasThunderstorm,
            hasRain,
            rainWindow,
            estimatedInches,
          }
        })
      }
    } catch { /* daily forecast optional */ }

    // Thunderstorm risk in next 24h
    const next24 = hourly.slice(0, 24)
    const thunderstormRisk = next24.some(h => h.hasThunderstorm)
    const rainNext24h = next24.some(h => h.hasRain || h.precipChance >= 30)

    return {
      current: hourly[0] || null,
      hourly,
      daily,
      todayHigh: todayTemps.length > 0 ? Math.max(...todayTemps) : null,
      todayLow: todayTemps.length > 0 ? Math.min(...todayTemps) : null,
      tomorrowHigh: tomorrowTemps.length > 0 ? Math.max(...tomorrowTemps) : null,
      tomorrowLow: tomorrowTemps.length > 0 ? Math.min(...tomorrowTemps) : null,
      sunrise: sunriseStr,
      sunset: sunsetStr,
      thunderstormRisk,
      rainNext24h,
      fetchedAt: new Date().toISOString(),
    }
  } catch {
    return null
  }
}

// Quick current conditions summary
export function formatWeatherSummary(w: RiverWeather): string {
  if (!w.current) return 'Weather unavailable'
  const parts = [`${w.current.tempF}°F`, w.current.shortForecast]
  if (w.current.windSpeedMph > 10) parts.push(`Wind ${w.current.windSpeedMph} mph ${w.current.windDirection}`)
  if (w.thunderstormRisk) parts.push('⚠ Thunderstorm risk')
  return parts.join(' · ')
}

// Check if conditions are good for evening hatch fishing
export function isGoodHatchEvening(w: RiverWeather): {
  good: boolean
  reasons: string[]
} {
  const reasons: string[] = []
  const evening = w.hourly.filter(h => {
    const hour = new Date(h.time).getHours()
    return hour >= 18 && hour <= 23
  }).slice(0, 5)

  if (evening.length === 0) return { good: false, reasons: ['No evening forecast data'] }

  const avgTemp = evening.reduce((s, h) => s + h.tempF, 0) / evening.length
  const maxWind = Math.max(...evening.map(h => h.windSpeedMph))
  const anyThunder = evening.some(h => h.hasThunderstorm)
  const anyRain = evening.some(h => h.hasRain)
  const avgPrecip = evening.reduce((s, h) => s + h.precipChance, 0) / evening.length

  if (avgTemp >= 60) reasons.push(`Warm evening (${Math.round(avgTemp)}°F)`)
  else reasons.push(`Cool evening (${Math.round(avgTemp)}°F)`)

  if (maxWind <= 8) reasons.push('Calm winds')
  else if (maxWind <= 15) reasons.push(`Moderate wind (${maxWind} mph)`)
  else reasons.push(`Windy (${maxWind} mph) — may suppress hatch`)

  if (anyThunder) reasons.push('Thunderstorm risk — could cut hatch short')
  if (anyRain && !anyThunder) reasons.push('Rain possible — can improve BWO hatches')
  if (avgPrecip < 20 && !anyRain) reasons.push('Dry evening')

  const good = avgTemp >= 55 && maxWind <= 15 && !anyThunder
  return { good, reasons }
}
