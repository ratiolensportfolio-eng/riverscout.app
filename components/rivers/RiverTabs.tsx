'use client'

import { useState, useEffect, useCallback } from 'react'
import dynamic from 'next/dynamic'
import type { River, FlowData } from '@/types'
import { formatCfs, trendArrow, celsiusToFahrenheit, isHypothermiaRisk } from '@/lib/usgs'
import { supabase } from '@/lib/supabase'

// Lazy-load Mapbox-backed map component. ssr: false because Mapbox needs
// the browser. The Maps tab also has a click-to-load gate further down so
// the chunk only downloads when the user explicitly opens the map.
const RiverMap = dynamic(() => import('@/components/maps/RiverMap'), {
  loading: () => (
    <div style={{
      height: '350px', background: 'var(--bg2)', borderRadius: 'var(--rlg)',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      fontFamily: "'IBM Plex Mono', monospace", fontSize: '10px', color: 'var(--tx3)',
    }}>
      Loading map...
    </div>
  ),
  ssr: false,
})
import { hasRiverMap, loadRiverMap } from '@/data/river-maps'
// FISHERIES (~4200 lines, ~150 kB) is dynamically imported when the user
// clicks the Fishing tab. See `loadFisheries` below.
import { RAPIDS } from '@/data/rapids'
import FishIcon from '@/components/icons/FishIcons'
import { getHatchTrigger } from '@/lib/hatch-triggers'
import type { AccessPoint, RiverSection } from '@/components/maps/RiverMap'
import type { RiverFisheries } from '@/types'
import type { RiverPageData } from '@/lib/river-page-data'

const TABS = ['Overview', 'History', 'Trip Reports', 'Fishing', 'Maps & Guides', 'Documents'] as const
type Tab = typeof TABS[number]

const ERA_LABELS: Record<string, string> = {
  native:  'Indigenous Era',
  logging: 'Logging & Industry',
  survey:  'Survey & Exploration',
  modern:  'Modern Era',
}

const ERA_COLORS: Record<string, string> = {
  native:  'var(--am)',
  logging: '#8b6914',
  survey:  'var(--rv)',
  modern:  'var(--rvdk)',
}

// Gear checklist based on river class
function gearList(cls: string, tempC: number | null): string[] {
  const base = [
    'PFD (personal flotation device)',
    'Paddle + spare',
    'Helmet',
    '2+ liters water',
    'First aid kit + SAM splint',
    'Whistle + signaling mirror',
    'Dry bag for essentials',
    'Sun protection + insect repellent',
    'Snacks / high-energy food',
    'Float plan left with someone',
  ]
  const cold = (tempC !== null && celsiusToFahrenheit(tempC) < 60) || tempC === null
  if (cold) base.splice(3, 0, 'Wetsuit or drysuit (cold water risk)')

  const clsNum = parseInt(cls.replace(/\D.*/, ''))
  if (clsNum >= 3) {
    base.push('Throw bag (50+ ft)')
    base.push('Carabiner + prussik loops')
    base.push('Swiftwater rescue course (recommended)')
  }
  if (clsNum >= 4) {
    base.push('Knife accessible on PFD')
    base.push('Paddling with experienced group')
    base.push('Scouting skills — never assume a rapid is clear')
  }
  return base
}

interface ReportForm {
  name: string
  stars: number
  text: string
  cfs: string
  tripDate: string
}

interface OutfitterListing {
  id: string
  business_name: string
  description: string | null
  website: string | null
  phone: string | null
  logo_url: string | null
  cover_photo_url: string | null
  tier: 'listed' | 'featured' | 'sponsored' | 'guide' | 'destination'
  specialty_tags: string[]
}

interface UserReport {
  id: string
  author_name: string
  rating: number
  flow_cfs: number | null
  trip_date: string | null
  body: string
  photos: string[]
  created_at: string
}

interface RiverTabsProps {
  river: River
  flow: FlowData
  // Server-side prefetched payload from lib/river-page-data.ts.
  // When provided, RiverTabs initializes its state from this and skips the
  // matching client-side fetches entirely (no browser→Vercel→Supabase round
  // trips for trip reports, stocking, or outfitters).
  initialData?: RiverPageData
}

export default function RiverTabs({ river, flow, initialData }: RiverTabsProps) {
  const [tab, setTab] = useState<Tab>('Overview')
  const [form, setForm] = useState<ReportForm>({ name: '', stars: 4, text: '', cfs: '', tripDate: '' })
  const [submitted, setSubmitted] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [submitError, setSubmitError] = useState('')
  const [photos, setPhotos] = useState<string[]>([])
  const [uploading, setUploading] = useState(false)
  const [userReports, setUserReports] = useState<UserReport[]>(initialData?.tripReports ?? [])
  const [loadingReports, setLoadingReports] = useState(false)
  const [riverMapData, setRiverMapData] = useState<{ accessPoints: AccessPoint[]; sections: RiverSection[]; riverPath: [number, number][] } | null>(null)
  const [riverMapLoading, setRiverMapLoading] = useState(false)
  const riverHasMap = hasRiverMap(river.id)
  // Outfitters: hydrated from server prefetch when available, otherwise lazy.
  const [outfitters, setOutfitters] = useState<OutfitterListing[]>(
    initialData?.outfitters ?? []
  )
  const [outfittersLoaded, setOutfittersLoaded] = useState(!!initialData)

  // Weather state
  interface RiverWeatherData {
    current: { tempF: number; windSpeedMph: number; windDirection: string; shortForecast: string; precipChance: number; hasThunderstorm: boolean; hasRain: boolean } | null
    daily: Array<{ name: string; tempF: number; isDaytime: boolean; shortForecast: string; windSpeed: string; precipChance: number; hasThunderstorm: boolean; hasRain: boolean; rainWindow?: string | null; estimatedInches?: number | null }>
    todayHigh: number | null; todayLow: number | null
    tomorrowHigh: number | null; tomorrowLow: number | null
    sunrise: string | null; sunset: string | null
    thunderstormRisk: boolean; rainNext24h: boolean
  }
  const [weather, setWeather] = useState<RiverWeatherData | null>(null)
  const [weatherLoaded, setWeatherLoaded] = useState(false)
  const [forecastExpanded, setForecastExpanded] = useState(false)

  // Fetch weather on Overview tab
  useEffect(() => {
    if (tab === 'Overview' && !weatherLoaded) {
      fetch(`/api/weather?riverId=${river.id}`)
        .then(r => { if (!r.ok) throw new Error('weather fetch failed'); return r.json() })
        .then(d => {
          if (d.current) setWeather(d)
          setWeatherLoaded(true)
        })
        .catch(() => setWeatherLoaded(true))
    }
  }, [tab, weatherLoaded, river.id])

  // Lazily-loaded fisheries data — only when user clicks the Fishing tab.
  // Saves ~150 kB of JS on first load for the 90% of visitors who never
  // open the Fishing tab.
  const [fisheries, setFisheries] = useState<Record<string, RiverFisheries> | null>(null)
  const [fisheriesLoading, setFisheriesLoading] = useState(false)
  useEffect(() => {
    if (tab === 'Fishing' && !fisheries && !fisheriesLoading) {
      setFisheriesLoading(true)
      import('@/data/fisheries')
        .then(m => setFisheries(m.FISHERIES))
        .finally(() => setFisheriesLoading(false))
    }
  }, [tab, fisheries, fisheriesLoading])

  // Pro features state
  interface WeeklyFlow { week: number; month: string; avg: number; median: number; p10: number; p90: number; min: number; max: number }
  interface ForecastPoint { time: string; cfs: number }
  const [overviewUserId, setOverviewUserId] = useState<string | null>(null)
  const [overviewIsPro, setOverviewIsPro] = useState(false)
  const [historicalData, setHistoricalData] = useState<WeeklyFlow[] | null>(null)
  const [forecastData, setForecastData] = useState<ForecastPoint[] | null>(null)
  const [forecastUnavailable, setForecastUnavailable] = useState(false)
  const [customRange, setCustomRange] = useState<{ min_cfs: number; max_cfs: number } | null>(null)
  const [customRangeMin, setCustomRangeMin] = useState('')
  const [customRangeMax, setCustomRangeMax] = useState('')
  const [customRangeSaving, setCustomRangeSaving] = useState(false)

  // Check Pro status on mount for overview features
  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      const uid = data.user?.id ?? null
      setOverviewUserId(uid)
      if (uid) {
        fetch(`/api/pro/status?userId=${uid}`)
          .then(r => r.json())
          .then(d => setOverviewIsPro(d.isPro ?? false))
          .catch(() => {})
        // Load custom CFS range
        fetch(`/api/pro/cfs-range?userId=${uid}&riverId=${river.id}`)
          .then(r => r.json())
          .then(d => {
            if (d.range) {
              setCustomRange(d.range)
              setCustomRangeMin(String(d.range.min_cfs))
              setCustomRangeMax(String(d.range.max_cfs))
            }
          })
          .catch(() => {})
      }
    })
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setOverviewUserId(session?.user?.id ?? null)
    })
    return () => subscription.unsubscribe()
  }, [river.id])

  // Fetch Pro data when Pro user views Overview
  useEffect(() => {
    if (overviewIsPro && tab === 'Overview') {
      // Historical
      if (!historicalData) {
        fetch(`/api/pro/historical?gaugeId=${river.g}`)
          .then(r => r.json())
          .then(d => { if (d.weeks) setHistoricalData(d.weeks) })
          .catch(() => {})
      }
      // Forecast
      if (!forecastData && !forecastUnavailable) {
        fetch(`/api/pro/forecast?gaugeId=${river.g}`)
          .then(r => r.json())
          .then(d => {
            if (d.forecasts?.length > 0) setForecastData(d.forecasts)
            else setForecastUnavailable(true)
          })
          .catch(() => setForecastUnavailable(true))
      }
    }
  }, [overviewIsPro, tab, river.g, historicalData, forecastData, forecastUnavailable])

  // Stocking data
  interface StockingEvent {
    id: string
    stocking_date: string
    is_scheduled: boolean
    species: string
    quantity: number | null
    size_category: string | null
    size_inches: number | null
    location_description: string | null
    stocking_authority: string | null
    source_url: string | null
    verified: boolean
  }
  // Stocking: hydrated from server prefetch when available, otherwise lazy.
  const [stockingEvents, setStockingEvents] = useState<StockingEvent[]>(
    initialData?.stockingEvents ?? []
  )
  const [stockingLoaded, setStockingLoaded] = useState(!!initialData)

  const fetchStocking = useCallback(() => {
    fetch(`/api/stocking?riverId=${river.id}`)
      .then(r => r.json())
      .then(data => {
        if (data.events) setStockingEvents(data.events)
        setStockingLoaded(true)
      })
      .catch(() => setStockingLoaded(true))
  }, [river.id])

  // Stocking form state
  const [stockingUserId, setStockingUserId] = useState<string | null>(null)
  const [userIsPro, setUserIsPro] = useState(false)
  const [stockingForm, setStockingForm] = useState({
    species: '', date: '', isScheduled: false, quantity: '',
    sizeCategory: '', locationDesc: '', sourceUrl: '',
  })
  const [stockingSubmitting, setStockingSubmitting] = useState(false)
  const [stockingSubmitted, setStockingSubmitted] = useState(false)
  const [stockingError, setStockingError] = useState('')
  // Hatch alerts state
  interface HatchAlertSub { id: string; hatch_name: string; active: boolean }
  const [hatchAlerts, setHatchAlerts] = useState<HatchAlertSub[]>([])
  const [hatchAlertsLoaded, setHatchAlertsLoaded] = useState(false)
  const [hatchAlertExpanded, setHatchAlertExpanded] = useState<string | null>(null)
  const [hatchAlertSaving, setHatchAlertSaving] = useState<string | null>(null)
  const [hatchAlertDaysBefore, setHatchAlertDaysBefore] = useState('7')
  const [hatchProPrompt, setHatchProPrompt] = useState<string | null>(null)

  const [stockingAlertOpen, setStockingAlertOpen] = useState(false)
  const [stockingAlertEmail, setStockingAlertEmail] = useState('')
  const [stockingAlertSpecies, setStockingAlertSpecies] = useState<string[]>(['All species'])
  const [stockingAlertSubmitting, setStockingAlertSubmitting] = useState(false)
  const [stockingAlertDone, setStockingAlertDone] = useState(false)

  // Fetch stocking data when Fishing tab is selected
  useEffect(() => {
    if (tab === 'Fishing' && !stockingLoaded) fetchStocking()
  }, [tab, stockingLoaded, fetchStocking])

  // Fetch hatch alerts when Fishing tab is selected and user is signed in
  useEffect(() => {
    if (tab === 'Fishing' && stockingAlertEmail && !hatchAlertsLoaded) {
      fetch(`/api/hatch-alerts?email=${encodeURIComponent(stockingAlertEmail)}&riverId=${river.id}`)
        .then(r => r.json())
        .then(d => { if (d.alerts) setHatchAlerts(d.alerts); setHatchAlertsLoaded(true) })
        .catch(() => setHatchAlertsLoaded(true))
    }
  }, [tab, stockingAlertEmail, hatchAlertsLoaded, river.id])

  // Check auth + Pro status for stocking form
  useEffect(() => {
    function checkAuth(userId: string | undefined, email: string | undefined) {
      setStockingUserId(userId ?? null)
      if (email) setStockingAlertEmail(email)
      if (userId) {
        fetch(`/api/pro/status?userId=${userId}`)
          .then(r => r.json())
          .then(d => setUserIsPro(d.isPro ?? false))
          .catch(() => {})
      }
    }

    supabase.auth.getUser().then(({ data }) => {
      checkAuth(data.user?.id, data.user?.email ?? undefined)
    })

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      checkAuth(session?.user?.id, session?.user?.email ?? undefined)
    })
    return () => subscription.unsubscribe()
  }, [])

  // Fetch outfitter listings from Supabase only when not server-prefetched.
  // When initialData is provided, outfitters are already populated above.
  useEffect(() => {
    if (initialData) return
    fetch(`/api/outfitters?riverId=${river.id}`)
      .then(r => r.json())
      .then(data => {
        if (data.listings) setOutfitters(data.listings)
        setOutfittersLoaded(true)
      })
      .catch(() => setOutfittersLoaded(true))
  }, [river.id, initialData])

  function trackClick(outfitterId: string, source: string) {
    fetch('/api/outfitters/click', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ outfitterId, riverId: river.id, source }),
    }).catch(() => {})
  }

  // Split outfitters by tier
  const sponsored = outfitters.filter(o => o.tier === 'sponsored' || o.tier === 'destination')
  const featured = outfitters.filter(o => o.tier === 'featured')
  const listed = outfitters.filter(o => o.tier === 'listed')
  const guides = outfitters.filter(o => o.tier === 'guide')

  // Fetch user-submitted reports when Trip Reports tab is selected
  const fetchReports = async () => {
    setLoadingReports(true)
    try {
      const res = await fetch(`/api/trips?riverId=${river.id}`)
      const data = await res.json()
      if (data.reports) setUserReports(data.reports)
    } catch { /* silently fail */ }
    setLoadingReports(false)
  }

  // Upload a photo
  async function handlePhotoUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const files = e.target.files
    if (!files || files.length === 0) return
    setUploading(true)
    for (const file of Array.from(files)) {
      const formData = new FormData()
      formData.append('file', file)
      formData.append('riverId', river.id)
      try {
        const res = await fetch('/api/trips/upload', { method: 'POST', body: formData })
        const data = await res.json()
        if (data.ok && data.url) {
          setPhotos(prev => [...prev, data.url])
        }
      } catch { /* silently fail */ }
    }
    setUploading(false)
    e.target.value = ''
  }

  async function submitReport(e: React.FormEvent) {
    e.preventDefault()
    if (!form.name.trim() || !form.text.trim()) return
    setSubmitting(true)
    setSubmitError('')
    try {
      const res = await fetch('/api/trips', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          riverId: river.id,
          riverName: river.n,
          authorName: form.name,
          rating: form.stars,
          flowCfs: form.cfs || null,
          tripDate: form.tripDate || null,
          text: form.text,
          photos,
        }),
      })
      const data = await res.json()
      if (data.ok) {
        setSubmitted(true)
        setPhotos([])
        fetchReports()
      } else {
        setSubmitError(data.error || 'Failed to submit report')
      }
    } catch {
      setSubmitError('Network error — please try again')
    }
    setSubmitting(false)
  }

  const gear = gearList(river.cls, flow.tempC)
  const hasHistory = river.history.length > 0
  const hasDocs = river.docs.length > 0

  return (
    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', minHeight: 0 }}>
      {/* Tab bar */}
      <div style={{
        display: 'flex', borderBottom: '.5px solid var(--bd)',
        overflowX: 'auto', flexShrink: 0,
      }} className="no-scrollbar tab-bar">
        {TABS.map(t => (
          <button
            key={t}
            onClick={() => setTab(t)}
            style={{
              fontFamily: "'IBM Plex Mono', monospace",
              fontSize: '10px',
              padding: '10px 14px',
              border: 'none',
              borderBottom: tab === t ? '2px solid var(--rv)' : '2px solid transparent',
              background: 'none',
              color: tab === t ? 'var(--rv)' : 'var(--tx2)',
              cursor: 'pointer',
              whiteSpace: 'nowrap',
              letterSpacing: '.4px',
              flexShrink: 0,
            }}
          >
            {t}
          </button>
        ))}
      </div>

      {/* Tab content */}
      <div style={{ flex: 1, overflowY: 'auto', padding: '14px 16px' }}>

        {/* ── OVERVIEW ─────────────────────────────────────── */}
        {tab === 'Overview' && (
          <div>
            {/* Sponsored outfitter — above the fold */}
            {sponsored.map(o => (
              <div key={o.id} style={{
                marginBottom: '14px', padding: '14px', borderRadius: 'var(--rlg)',
                background: 'linear-gradient(135deg, #E6F1FB, #E1F5EE)',
                border: '1px solid var(--wt)', position: 'relative',
              }}>
                <span style={{
                  position: 'absolute', top: '8px', right: '10px',
                  fontFamily: "'IBM Plex Mono', monospace", fontSize: '8px', padding: '2px 8px',
                  borderRadius: '8px', background: 'var(--wt)', color: '#fff',
                  textTransform: 'uppercase', letterSpacing: '.5px',
                }}>Sponsored</span>
                {o.cover_photo_url && (
                  <img src={o.cover_photo_url} alt={o.business_name} loading="lazy" decoding="async"
                    style={{ width: '100%', height: '120px', objectFit: 'cover', borderRadius: '6px', marginBottom: '10px' }} />
                )}
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '6px' }}>
                  {o.logo_url && (
                    <img src={o.logo_url} alt="" loading="lazy" decoding="async" style={{ width: '36px', height: '36px', borderRadius: '6px', objectFit: 'contain', border: '.5px solid var(--bd)' }} />
                  )}
                  <div>
                    <div style={{ fontFamily: "'Playfair Display', serif", fontSize: '15px', fontWeight: 700, color: '#042C53' }}>{o.business_name}</div>
                    {o.phone && <div style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: '10px', color: 'var(--wt)' }}>{o.phone}</div>}
                  </div>
                </div>
                {o.description && <div style={{ fontSize: '12px', color: 'var(--tx2)', lineHeight: 1.55, marginBottom: '10px' }}>{o.description}</div>}
                {o.website && (
                  <a href={o.website.startsWith('http') ? o.website : `https://${o.website}`}
                    target="_blank" rel="noopener noreferrer"
                    onClick={() => trackClick(o.id, 'overview')}
                    style={{
                      display: 'inline-block', fontFamily: "'IBM Plex Mono', monospace", fontSize: '11px',
                      padding: '8px 18px', borderRadius: 'var(--r)',
                      background: 'var(--wt)', color: '#fff', textDecoration: 'none', fontWeight: 500,
                    }}>
                    Book Now
                  </a>
                )}
              </div>
            ))}

            {/* Stats grid */}
            <div className="stats-grid" style={{ marginBottom: '12px' }}>
              {[
                { n: river.len, l: 'Length' },
                { n: `Class ${river.cls}`, l: 'Difficulty' },
                { n: `${river.opt} cfs`, l: 'Optimal' },
                { n: river.avg ? `${river.avg.toLocaleString()} cfs` : '—', l: 'Avg Flow' },
                { n: river.histFlow ? `${river.histFlow.toLocaleString()} cfs` : '—', l: 'Hist. Median' },
                { n: `#${river.g}`, l: 'USGS Gauge' },
              ].map(s => (
                <div key={s.l} style={{ background: 'var(--bg2)', borderRadius: 'var(--r)', padding: '8px 10px' }}>
                  <div style={{ fontFamily: "'Playfair Display', serif", fontSize: '13px', fontWeight: 600, color: 'var(--tx)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{s.n}</div>
                  <div style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: '8px', color: 'var(--tx3)', textTransform: 'uppercase', letterSpacing: '.4px', marginTop: '2px' }}>{s.l}</div>
                </div>
              ))}
            </div>

            {/* Designation */}
            {river.desig && (
              <div style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: '10px', color: 'var(--rvdk)', background: 'var(--rvlt)', padding: '7px 10px', borderRadius: 'var(--r)', marginBottom: '10px', lineHeight: 1.5, border: '.5px solid var(--rvmd)' }}>
                {river.desig}
              </div>
            )}

            {/* Description */}
            <p style={{ fontSize: '13px', color: 'var(--tx)', lineHeight: 1.78, marginBottom: '12px' }}>
              {river.desc}
            </p>

            {/* Weather conditions */}
            {weather?.current && (
              <div style={{
                marginBottom: '14px', padding: '12px 14px', borderRadius: 'var(--r)',
                border: `.5px solid ${weather.thunderstormRisk ? 'var(--am)' : 'var(--bd)'}`,
                background: weather.thunderstormRisk ? 'var(--amlt)' : 'var(--bg2)',
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '6px' }}>
                  <div style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: '9px', color: 'var(--tx3)', textTransform: 'uppercase', letterSpacing: '1px' }}>
                    Current Weather
                  </div>
                  {weather.sunrise && weather.sunset && (
                    <div style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: '9px', color: 'var(--tx3)' }}>
                      &#9788; {weather.sunrise} — {weather.sunset}
                    </div>
                  )}
                </div>
                <div style={{ display: 'flex', alignItems: 'baseline', gap: '8px', marginBottom: '4px' }}>
                  <span style={{ fontFamily: "'Playfair Display', serif", fontSize: '22px', fontWeight: 700, color: 'var(--tx)' }}>
                    {weather.current.tempF}°F
                  </span>
                  <span style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: '11px', color: 'var(--tx2)' }}>
                    {weather.current.shortForecast}
                  </span>
                </div>
                <div style={{ display: 'flex', gap: '12px', fontFamily: "'IBM Plex Mono', monospace", fontSize: '10px', color: 'var(--tx2)', flexWrap: 'wrap' }}>
                  {weather.current.windSpeedMph > 0 && (
                    <span>Wind {weather.current.windSpeedMph} mph {weather.current.windDirection}</span>
                  )}
                  {weather.current.precipChance > 0 && (
                    <span>{weather.current.precipChance}% precip</span>
                  )}
                  {weather.todayHigh !== null && weather.todayLow !== null && (
                    <span>H {weather.todayHigh}° / L {weather.todayLow}°</span>
                  )}
                </div>
                {weather.thunderstormRisk && (
                  <div style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: '10px', color: 'var(--am)', marginTop: '6px', display: 'flex', alignItems: 'center', gap: '4px' }}>
                    <span style={{ fontSize: '12px' }}>&#9888;</span> Thunderstorm risk in the next 24 hours — check conditions before heading out
                  </div>
                )}

                {/* 7-Day Forecast — collapsed by default to defer the 7×detail render */}
                {weather.daily && weather.daily.length > 0 && (
                  <div style={{ marginTop: '10px' }}>
                    <button
                      onClick={() => setForecastExpanded(e => !e)}
                      style={{
                        fontFamily: "'IBM Plex Mono', monospace", fontSize: '9px',
                        color: 'var(--tx3)', textTransform: 'uppercase', letterSpacing: '1px',
                        marginBottom: '6px', background: 'none', border: 'none',
                        cursor: 'pointer', padding: 0, display: 'flex', alignItems: 'center', gap: '6px',
                      }}
                      aria-expanded={forecastExpanded}
                    >
                      <span>{forecastExpanded ? '\u25BC' : '\u25B6'}</span>
                      7-Day Forecast
                    </button>
                    {forecastExpanded && (
                    <div style={{ display: 'flex', gap: '0', overflow: 'hidden', borderRadius: 'var(--r)', border: '.5px solid var(--bd)' }}>
                      {weather.daily.filter(d => d.isDaytime).slice(0, 7).map((d, i) => (
                        <div key={i} style={{
                          flex: 1, padding: '8px 4px', textAlign: 'center',
                          borderRight: i < 6 ? '.5px solid var(--bd)' : 'none',
                          background: d.hasThunderstorm ? 'var(--amlt)' : d.hasRain ? 'var(--wtlt)' : 'var(--bg)',
                          minWidth: 0,
                        }}>
                          <div style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: '9px', color: 'var(--tx3)', marginBottom: '3px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                            {d.name.replace(/ Night$/, '').slice(0, 3)}
                          </div>
                          <div style={{ fontFamily: "'Playfair Display', serif", fontSize: '15px', fontWeight: 700, color: 'var(--tx)', marginBottom: '1px' }}>
                            {d.tempF}°
                          </div>
                          <div style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: '8px', color: 'var(--tx2)', lineHeight: 1.3, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                            {(() => {
                              // Override misleading NOAA text when it contradicts precip %
                              const text = d.shortForecast
                              const lower = text.toLowerCase()
                              if (d.precipChance >= 70 && (lower.includes('slight') || lower.includes('partly'))) {
                                return d.hasThunderstorm ? 'T-Storms' : 'Rain Likely'
                              }
                              if (d.precipChance >= 50 && lower.includes('slight')) {
                                return d.hasThunderstorm ? 'Chance T-St…' : 'Chance Rain'
                              }
                              return text.length > 12 ? text.slice(0, 11) + '…' : text
                            })()}
                          </div>
                          {d.precipChance > 0 && (
                            <div style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: '8px', color: 'var(--wt)', marginTop: '2px' }}>
                              {d.precipChance}%
                              {d.rainWindow && (
                                <span style={{ color: 'var(--tx3)', display: 'block' }}>
                                  {d.rainWindow}
                                </span>
                              )}
                            </div>
                          )}
                          {d.estimatedInches != null && d.estimatedInches > 0 && (
                            <div style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: '7px', color: 'var(--wt)', marginTop: '1px' }}>
                              ~{d.estimatedInches}&quot;
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                    )}
                  </div>
                )}
              </div>
            )}

            {/* Sections */}
            {river.secs.length > 0 && (
              <div style={{ marginBottom: '14px' }}>
                <div style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: '9px', color: 'var(--tx3)', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '7px' }}>
                  Trip sections
                </div>
                {river.secs.map((sec, i) => (
                  <div key={i} style={{ fontSize: '12px', color: 'var(--tx)', marginBottom: '5px', paddingLeft: '10px', borderLeft: '2px solid var(--rvmd)', lineHeight: 1.55 }}>
                    {sec}
                  </div>
                ))}
              </div>
            )}

            {/* Notable Rapids */}
            {RAPIDS[river.id] && RAPIDS[river.id].length > 0 && (
              <div style={{ marginBottom: '14px' }}>
                <div style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: '9px', color: 'var(--tx3)', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '8px' }}>
                  Notable Rapids
                </div>
                {RAPIDS[river.id].map((rapid, i) => (
                  <div key={i} style={{
                    padding: '10px 12px', marginBottom: '6px',
                    background: 'var(--bg2)', borderRadius: 'var(--r)',
                    border: '.5px solid var(--bd)',
                    borderLeft: `3px solid ${
                      rapid.class.includes('V') ? 'var(--dg)' :
                      rapid.class.includes('IV') ? 'var(--am)' :
                      rapid.class.includes('III') ? 'var(--rv)' :
                      'var(--wt)'
                    }`,
                  }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: '3px' }}>
                      <span style={{ fontFamily: "'Playfair Display', serif", fontSize: '14px', fontWeight: 600, color: 'var(--rvdk)' }}>
                        {rapid.name}
                      </span>
                      <span style={{
                        fontFamily: "'IBM Plex Mono', monospace", fontSize: '9px', padding: '2px 6px',
                        borderRadius: '4px', fontWeight: 600,
                        color: rapid.class.includes('V') ? 'var(--dg)' : rapid.class.includes('IV') ? 'var(--am)' : 'var(--rv)',
                        background: rapid.class.includes('V') ? 'var(--dglt)' : rapid.class.includes('IV') ? 'var(--amlt)' : 'var(--rvlt)',
                      }}>
                        Class {rapid.class}
                      </span>
                    </div>
                    <div style={{ fontSize: '12px', color: 'var(--tx2)', lineHeight: 1.55 }}>
                      {rapid.description}
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Data Accuracy */}
            <DataAccuracy riverId={river.id} />

            {/* Outfitters — tiered rendering */}
            {(outfittersLoaded && (featured.length > 0 || listed.length > 0 || river.outs.length > 0)) && (
              <div style={{ marginBottom: '14px' }}>
                <div style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: '9px', color: 'var(--tx3)', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '8px' }}>
                  Outfitters
                </div>

                {/* Featured outfitters */}
                {featured.map(o => (
                  <div key={o.id} style={{
                    border: '.5px solid var(--rvmd)', borderRadius: 'var(--r)',
                    padding: '12px', background: 'var(--rvlt)', marginBottom: '8px', position: 'relative',
                  }}>
                    <span style={{
                      position: 'absolute', top: '6px', right: '8px',
                      fontFamily: "'IBM Plex Mono', monospace", fontSize: '8px', padding: '2px 6px',
                      borderRadius: '6px', background: 'var(--rv)', color: '#fff',
                      textTransform: 'uppercase', letterSpacing: '.5px',
                    }}>Featured</span>
                    {o.cover_photo_url && (
                      <img src={o.cover_photo_url} alt={o.business_name} loading="lazy" decoding="async"
                        style={{ width: '100%', height: '80px', objectFit: 'cover', borderRadius: '4px', marginBottom: '8px' }} />
                    )}
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                      {o.logo_url && (
                        <img src={o.logo_url} alt="" loading="lazy" decoding="async" style={{ width: '28px', height: '28px', borderRadius: '4px', objectFit: 'contain' }} />
                      )}
                      <div>
                        <div style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: '12px', fontWeight: 600, color: 'var(--rvdk)' }}>{o.business_name}</div>
                        {o.phone && <div style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: '9px', color: 'var(--tx3)' }}>{o.phone}</div>}
                      </div>
                    </div>
                    {o.description && <div style={{ fontSize: '11px', color: 'var(--tx2)', lineHeight: 1.5, marginBottom: '8px' }}>{o.description}</div>}
                    {o.website && (
                      <a href={o.website.startsWith('http') ? o.website : `https://${o.website}`}
                        target="_blank" rel="noopener noreferrer"
                        onClick={() => trackClick(o.id, 'outfitters_tab')}
                        style={{
                          fontFamily: "'IBM Plex Mono', monospace", fontSize: '10px',
                          color: 'var(--rv)', textDecoration: 'none',
                        }}>
                        {o.website.replace(/^https?:\/\//, '')} &rarr;
                      </a>
                    )}
                  </div>
                ))}

                {/* Listed outfitters (from Supabase) */}
                {listed.map(o => (
                  <div key={o.id} style={{
                    border: '.5px solid var(--bd)', borderRadius: 'var(--r)',
                    padding: '9px 11px', background: 'var(--bg2)', marginBottom: '6px',
                  }}>
                    <div style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: '11px', fontWeight: 500, color: 'var(--rvdk)' }}>{o.business_name}</div>
                    {o.website && (
                      <a href={o.website.startsWith('http') ? o.website : `https://${o.website}`}
                        target="_blank" rel="noopener noreferrer"
                        onClick={() => trackClick(o.id, 'outfitters_tab')}
                        style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: '10px', color: 'var(--rv)', textDecoration: 'none' }}>
                        {o.website.replace(/^https?:\/\//, '')}
                      </a>
                    )}
                  </div>
                ))}

                {/* Seed outfitters (from static data — shown if no DB outfitters) */}
                {outfitters.length === 0 && river.outs.map((out, i) => (
                  <div key={`seed-${i}`} style={{
                    border: '.5px dashed var(--bd2)', borderRadius: 'var(--r)',
                    padding: '9px 11px', background: 'var(--bg2)', marginBottom: '6px',
                  }}>
                    <div style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: '11px', fontWeight: 500, color: 'var(--rvdk)' }}>{out.n}</div>
                    <div style={{ fontSize: '11px', color: 'var(--tx2)', marginTop: '2px' }}>{out.d}</div>
                  </div>
                ))}
              </div>
            )}

            {/* Local Guides — separate from outfitters */}
            {guides.length > 0 && (
              <div style={{ marginBottom: '14px' }}>
                <div style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: '9px', color: 'var(--am)', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '8px' }}>
                  Local Guides
                </div>
                {guides.map(g => (
                  <div key={g.id} style={{
                    border: '.5px solid var(--am)', borderRadius: 'var(--r)',
                    padding: '10px 12px', background: 'var(--amlt)', marginBottom: '6px',
                  }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                      <div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '3px' }}>
                          {g.logo_url && <img src={g.logo_url} alt="" loading="lazy" decoding="async" style={{ width: '24px', height: '24px', borderRadius: '50%' }} />}
                          <span style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: '12px', fontWeight: 600, color: 'var(--am)' }}>{g.business_name}</span>
                          <span style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: '8px', padding: '2px 6px', borderRadius: '6px', background: 'var(--am)', color: '#fff', textTransform: 'uppercase' }}>Guide</span>
                        </div>
                        {g.specialty_tags.length > 0 && (
                          <div style={{ display: 'flex', gap: '4px', flexWrap: 'wrap', marginBottom: '4px' }}>
                            {g.specialty_tags.map((tag, i) => (
                              <span key={i} style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: '8px', padding: '1px 5px', borderRadius: '4px', border: '.5px solid var(--am)', color: 'var(--am)' }}>{tag}</span>
                            ))}
                          </div>
                        )}
                        {g.description && <div style={{ fontSize: '11px', color: 'var(--tx2)', lineHeight: 1.5 }}>{g.description}</div>}
                      </div>
                    </div>
                    <div style={{ display: 'flex', gap: '10px', marginTop: '6px' }}>
                      {g.phone && <span style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: '10px', color: 'var(--tx3)' }}>{g.phone}</span>}
                      {g.website && (
                        <a href={g.website.startsWith('http') ? g.website : `https://${g.website}`}
                          target="_blank" rel="noopener noreferrer"
                          onClick={() => trackClick(g.id, 'guide_tab')}
                          style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: '10px', color: 'var(--am)', textDecoration: 'none' }}>
                          Contact &rarr;
                        </a>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
            {/* 72-Hour Flow Forecast */}
            <div style={{ marginTop: '16px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '8px' }}>
                <div style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: '9px', color: 'var(--tx3)', textTransform: 'uppercase', letterSpacing: '1px' }}>
                  72-Hour Flow Forecast
                </div>
                {overviewIsPro && <span style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: '8px', color: 'var(--rv)', padding: '1px 5px', borderRadius: '3px', background: 'var(--rvlt)' }}>PRO</span>}
              </div>
              {overviewIsPro ? (
                forecastData && forecastData.length > 0 ? (
                  <div style={{ border: '.5px solid var(--bd)', borderRadius: 'var(--r)', overflow: 'hidden' }}>
                    <div style={{ height: '140px', background: 'var(--bg2)', display: 'flex', alignItems: 'flex-end', padding: '12px 16px 8px', gap: '2px' }}>
                      {(() => {
                        const maxCfs = Math.max(...forecastData.map(f => f.cfs))
                        return forecastData.map((f, i) => {
                          const pct = maxCfs > 0 ? (f.cfs / maxCfs) * 85 + 5 : 10
                          return (
                            <div key={i} title={`${new Date(f.time).toLocaleString()}: ${f.cfs.toLocaleString()} cfs`}
                              style={{ flex: 1, height: `${pct}%`, background: 'var(--wt)', borderRadius: '2px 2px 0 0', opacity: 0.8, minWidth: '3px' }} />
                          )
                        })
                      })()}
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', padding: '6px 16px', fontFamily: "'IBM Plex Mono', monospace", fontSize: '9px', color: 'var(--tx3)' }}>
                      <span>Now</span>
                      <span>+24h</span>
                      <span>+48h</span>
                      <span>+72h</span>
                    </div>
                  </div>
                ) : forecastUnavailable ? (
                  <div style={{ padding: '12px', background: 'var(--bg2)', borderRadius: 'var(--r)', border: '.5px solid var(--bd)', fontFamily: "'IBM Plex Mono', monospace", fontSize: '10px', color: 'var(--tx3)', textAlign: 'center' }}>
                    Forecast temporarily unavailable
                  </div>
                ) : (
                  <div style={{ padding: '12px', fontFamily: "'IBM Plex Mono', monospace", fontSize: '10px', color: 'var(--tx3)', textAlign: 'center' }}>Loading forecast...</div>
                )
              ) : (
                <div style={{ position: 'relative', borderRadius: 'var(--r)', overflow: 'hidden' }}>
                  <div style={{ filter: 'blur(5px)', pointerEvents: 'none', userSelect: 'none' }}>
                    <div style={{ height: '120px', background: 'var(--bg2)', borderRadius: 'var(--r)', border: '.5px solid var(--bd)', display: 'flex', alignItems: 'flex-end', padding: '12px 16px', gap: '4px' }}>
                      {[35, 42, 55, 68, 72, 65, 58, 50, 48, 52, 60, 70, 75, 72, 68].map((h, i) => (
                        <div key={i} style={{ flex: 1, height: `${h}%`, background: 'var(--rvmd)', borderRadius: '2px 2px 0 0' }} />
                      ))}
                    </div>
                  </div>
                  <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', background: 'rgba(255,255,255,.6)' }}>
                    <div style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: '11px', color: 'var(--rvdk)', marginBottom: '8px' }}>Upgrade to Pro for 72-hour flow forecasts</div>
                    <a href="/pro" style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: '10px', fontWeight: 500, padding: '6px 16px', borderRadius: 'var(--r)', background: 'var(--rvdk)', color: '#fff', textDecoration: 'none' }}>Upgrade to Pro &rarr;</a>
                  </div>
                </div>
              )}
            </div>

            {/* Historical Flow Analysis */}
            <div style={{ marginTop: '16px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '8px' }}>
                <div style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: '9px', color: 'var(--tx3)', textTransform: 'uppercase', letterSpacing: '1px' }}>
                  10-Year Flow Patterns
                </div>
                {overviewIsPro && <span style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: '8px', color: 'var(--rv)', padding: '1px 5px', borderRadius: '3px', background: 'var(--rvlt)' }}>PRO</span>}
              </div>
              {overviewIsPro ? (
                historicalData && historicalData.length > 0 ? (
                  <div style={{ border: '.5px solid var(--bd)', borderRadius: 'var(--r)', overflow: 'hidden' }}>
                    {/* Current vs average summary */}
                    {(() => {
                      const currentWeek = Math.floor((new Date().getTime() - new Date(new Date().getFullYear(), 0, 0).getTime()) / (86400000 * 7))
                      const thisWeek = historicalData.find(w => w.week === currentWeek)
                      const currentCfs = flow.cfs
                      if (!thisWeek) return null
                      const pctOfAvg = currentCfs ? Math.round((currentCfs / thisWeek.avg) * 100) : null
                      const aboveBelow = pctOfAvg ? (pctOfAvg > 110 ? 'above' : pctOfAvg < 90 ? 'below' : 'near') : null
                      return (
                        <div style={{ padding: '12px 14px', borderBottom: '.5px solid var(--bd)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '8px' }}>
                          <div>
                            <div style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: '9px', color: 'var(--tx3)', marginBottom: '2px' }}>This week&apos;s 10-year average</div>
                            <span style={{ fontFamily: "'Playfair Display', serif", fontSize: '20px', fontWeight: 700, color: 'var(--wt)' }}>{thisWeek.avg.toLocaleString()}</span>
                            <span style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: '10px', color: 'var(--tx3)', marginLeft: '4px' }}>CFS</span>
                            <span style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: '9px', color: 'var(--tx3)', marginLeft: '8px' }}>
                              ({thisWeek.p10.toLocaleString()}–{thisWeek.p90.toLocaleString()} typical)
                            </span>
                          </div>
                          {currentCfs && pctOfAvg && (
                            <div style={{ textAlign: 'right' }}>
                              <div style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: '9px', color: 'var(--tx3)', marginBottom: '2px' }}>Current flow</div>
                              <span style={{ fontFamily: "'Playfair Display', serif", fontSize: '20px', fontWeight: 700, color: aboveBelow === 'above' ? 'var(--am)' : aboveBelow === 'below' ? 'var(--lo)' : 'var(--rv)' }}>
                                {currentCfs.toLocaleString()}
                              </span>
                              <span style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: '10px', color: 'var(--tx3)', marginLeft: '4px' }}>CFS</span>
                              <span style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: '9px', marginLeft: '8px', color: aboveBelow === 'above' ? 'var(--am)' : aboveBelow === 'below' ? 'var(--lo)' : 'var(--rv)' }}>
                                {pctOfAvg}% of avg
                              </span>
                            </div>
                          )}
                        </div>
                      )
                    })()}
                    {/* Chart */}
                    <div style={{ height: '140px', background: 'var(--bg2)', display: 'flex', alignItems: 'flex-end', padding: '10px 8px 6px', gap: '1px' }}>
                      {(() => {
                        const maxVal = Math.max(...historicalData.map(w => w.p90), flow.cfs || 0)
                        const currentWeek = Math.floor((new Date().getTime() - new Date(new Date().getFullYear(), 0, 0).getTime()) / (86400000 * 7))
                        return historicalData.map((w, i) => {
                          const isCurrent = w.week === currentWeek
                          const avgPct = maxVal > 0 ? (w.avg / maxVal) * 82 + 3 : 10
                          const rangePct = maxVal > 0 ? (w.p90 / maxVal) * 82 + 3 : 10
                          const currentPct = (isCurrent && flow.cfs) ? (flow.cfs / maxVal) * 82 + 3 : 0
                          return (
                            <div key={i} title={`${w.month}: avg ${w.avg.toLocaleString()} cfs\n10th: ${w.p10.toLocaleString()} · 90th: ${w.p90.toLocaleString()}${isCurrent && flow.cfs ? `\nNow: ${flow.cfs.toLocaleString()} cfs` : ''}`}
                              style={{ flex: 1, position: 'relative', height: '100%', minWidth: '2px' }}>
                              {/* P10-P90 range bar */}
                              <div style={{
                                position: 'absolute', bottom: 0, left: '10%', right: '10%',
                                height: `${rangePct}%`,
                                background: isCurrent ? 'var(--rvlt)' : 'var(--bg3)',
                                borderRadius: '2px 2px 0 0',
                              }} />
                              {/* Average bar */}
                              <div style={{
                                position: 'absolute', bottom: 0, left: '15%', right: '15%',
                                height: `${avgPct}%`,
                                background: isCurrent ? 'var(--rvmd)' : 'var(--wtmd)',
                                borderRadius: '2px 2px 0 0', opacity: 0.8,
                              }} />
                              {/* Current flow marker */}
                              {isCurrent && flow.cfs && (
                                <div style={{
                                  position: 'absolute', bottom: `${currentPct}%`, left: 0, right: 0,
                                  height: '3px', background: flow.condition === 'optimal' ? 'var(--rv)' : flow.condition === 'high' ? 'var(--am)' : flow.condition === 'flood' ? 'var(--dg)' : 'var(--lo)',
                                  borderRadius: '2px',
                                }} />
                              )}
                            </div>
                          )
                        })
                      })()}
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', padding: '4px 12px 6px', fontFamily: "'IBM Plex Mono', monospace", fontSize: '8px', color: 'var(--tx3)' }}>
                      {['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'].map(m => <span key={m}>{m}</span>)}
                    </div>
                    <div style={{ display: 'flex', gap: '12px', padding: '4px 12px 10px', fontFamily: "'IBM Plex Mono', monospace", fontSize: '9px', color: 'var(--tx2)' }}>
                      <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}><span style={{ width: 8, height: 8, background: 'var(--wtmd)', borderRadius: '2px' }} /> 10-yr avg</span>
                      <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}><span style={{ width: 8, height: 8, background: 'var(--bg3)', borderRadius: '2px' }} /> Typical range</span>
                      <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}><span style={{ width: 10, height: 3, background: 'var(--rv)', borderRadius: '2px' }} /> Current</span>
                    </div>
                  </div>
                ) : (
                  <div style={{ padding: '12px', fontFamily: "'IBM Plex Mono', monospace", fontSize: '10px', color: 'var(--tx3)', textAlign: 'center' }}>Loading historical data...</div>
                )
              ) : (
                <div style={{ position: 'relative', borderRadius: 'var(--r)', overflow: 'hidden' }}>
                  <div style={{ filter: 'blur(5px)', pointerEvents: 'none', userSelect: 'none' }}>
                    <div style={{ height: '120px', background: 'var(--bg2)', borderRadius: 'var(--r)', border: '.5px solid var(--bd)', display: 'flex', alignItems: 'flex-end', padding: '12px 16px', gap: '3px' }}>
                      {[20, 25, 35, 50, 70, 85, 90, 80, 65, 45, 30, 22, 25, 35, 50, 65, 75, 80, 70, 55, 40, 28, 20, 18].map((h, i) => (
                        <div key={i} style={{ flex: 1, height: `${h}%`, background: 'var(--wtmd)', borderRadius: '2px 2px 0 0', opacity: 0.7 }} />
                      ))}
                    </div>
                  </div>
                  <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', background: 'rgba(255,255,255,.6)' }}>
                    <div style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: '11px', color: 'var(--rvdk)', marginBottom: '8px' }}>Upgrade to Pro to see historical flow patterns</div>
                    <a href="/pro" style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: '10px', fontWeight: 500, padding: '6px 16px', borderRadius: 'var(--r)', background: 'var(--rvdk)', color: '#fff', textDecoration: 'none' }}>Upgrade to Pro &rarr;</a>
                  </div>
                </div>
              )}
            </div>

            {/* Custom Optimal CFS Range */}
            <div style={{ marginTop: '16px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '8px' }}>
                <div style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: '9px', color: 'var(--tx3)', textTransform: 'uppercase', letterSpacing: '1px' }}>
                  Your Optimal Range
                </div>
                {overviewIsPro && <span style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: '8px', color: 'var(--rv)', padding: '1px 5px', borderRadius: '3px', background: 'var(--rvlt)' }}>PRO</span>}
              </div>
              {overviewIsPro ? (
                <div style={{ border: '.5px solid var(--bd)', borderRadius: 'var(--r)', padding: '12px 14px', background: 'var(--bg2)' }}>
                  {customRange && (
                    <div style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: '11px', color: 'var(--rv)', marginBottom: '8px' }}>
                      Your range: {customRange.min_cfs.toLocaleString()}–{customRange.max_cfs.toLocaleString()} CFS
                    </div>
                  )}
                  <div style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: '10px', color: 'var(--tx3)', marginBottom: '8px' }}>
                    Default: {river.opt} CFS {customRange ? '· ' : ''}
                    {!customRange && 'Set your personal preferred CFS range for flow alerts'}
                  </div>
                  <div style={{ display: 'flex', gap: '8px', alignItems: 'center', flexWrap: 'wrap' }}>
                    <input type="number" value={customRangeMin} onChange={e => setCustomRangeMin(e.target.value)}
                      placeholder="Min" style={{ width: '80px', padding: '6px 8px', fontFamily: "'IBM Plex Mono', monospace", fontSize: '11px', border: '.5px solid var(--bd2)', borderRadius: 'var(--r)', background: 'var(--bg)', color: 'var(--tx)' }} />
                    <span style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: '10px', color: 'var(--tx3)' }}>to</span>
                    <input type="number" value={customRangeMax} onChange={e => setCustomRangeMax(e.target.value)}
                      placeholder="Max" style={{ width: '80px', padding: '6px 8px', fontFamily: "'IBM Plex Mono', monospace", fontSize: '11px', border: '.5px solid var(--bd2)', borderRadius: 'var(--r)', background: 'var(--bg)', color: 'var(--tx)' }} />
                    <span style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: '10px', color: 'var(--tx3)' }}>CFS</span>
                    <button disabled={customRangeSaving || !customRangeMin || !customRangeMax}
                      onClick={async () => {
                        setCustomRangeSaving(true)
                        try {
                          const res = await fetch('/api/pro/cfs-range', {
                            method: 'POST',
                            headers: { 'Content-Type': 'application/json' },
                            body: JSON.stringify({ userId: overviewUserId, riverId: river.id, minCfs: parseInt(customRangeMin), maxCfs: parseInt(customRangeMax) }),
                          })
                          const data = await res.json()
                          if (data.ok) setCustomRange({ min_cfs: parseInt(customRangeMin), max_cfs: parseInt(customRangeMax) })
                        } catch { /* ignore */ }
                        setCustomRangeSaving(false)
                      }}
                      style={{
                        fontFamily: "'IBM Plex Mono', monospace", fontSize: '10px', fontWeight: 500,
                        padding: '6px 14px', borderRadius: 'var(--r)',
                        background: 'var(--rv)', color: '#fff', border: 'none',
                        cursor: customRangeSaving ? 'wait' : 'pointer',
                        opacity: (customRangeSaving || !customRangeMin || !customRangeMax) ? 0.6 : 1,
                      }}>
                      {customRangeSaving ? 'Saving...' : customRange ? 'Update' : 'Save'}
                    </button>
                  </div>
                </div>
              ) : (
                <div style={{
                  padding: '10px 14px', background: 'var(--rvlt)', border: '.5px solid var(--rvmd)',
                  borderRadius: 'var(--r)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '12px', flexWrap: 'wrap',
                }}>
                  <span style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: '11px', color: 'var(--rvdk)' }}>
                    Set your own optimal CFS range for personalized alerts
                  </span>
                  <a href="/pro" style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: '10px', fontWeight: 500, padding: '5px 14px', borderRadius: 'var(--r)', background: 'var(--rvdk)', color: '#fff', textDecoration: 'none', flexShrink: 0 }}>
                    Upgrade to Pro &rarr;
                  </a>
                </div>
              )}
            </div>

            {/* Credibility disclaimer */}
            <div style={{
              marginTop: '20px', padding: '12px 14px',
              background: 'var(--bg2)', border: '.5px solid var(--bd)',
              borderRadius: 'var(--r)',
            }}>
              <div style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: '9px', color: 'var(--tx3)', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '6px' }}>
                Data Quality
              </div>
              <p style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: '11px', color: 'var(--tx2)', lineHeight: 1.6, margin: 0 }}>
                River conditions are community-verified. CFS ranges, difficulty ratings, and trip sections may not reflect every flow level or seasonal change. Always check current conditions, scout unfamiliar rapids, and paddle within your skill level. If you spot an error, use the <strong style={{ color: 'var(--rv)' }}>Improve This River</strong> button at the top of the page &mdash; your local knowledge is what makes this atlas accurate.
              </p>
            </div>
          </div>
        )}

        {/* ── HISTORY ──────────────────────────────────────── */}
        {tab === 'History' && (
          <div>
            {hasHistory ? (
              river.history.map((era, ei) => (
                <div key={ei} style={{ marginBottom: '24px' }}>
                  <div style={{
                    display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '10px',
                    paddingBottom: '6px', borderBottom: `.5px solid var(--bd)`,
                  }}>
                    <div style={{ width: '3px', height: '16px', borderRadius: '2px', background: ERA_COLORS[era.era] ?? 'var(--tx3)', flexShrink: 0 }} />
                    <div style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: '10px', color: ERA_COLORS[era.era] ?? 'var(--tx3)', textTransform: 'uppercase', letterSpacing: '1px' }}>
                      {ERA_LABELS[era.era] ?? era.era}
                    </div>
                  </div>
                  {era.entries.map((entry, i) => (
                    <div key={i} style={{ paddingBottom: '14px', marginBottom: '14px', borderBottom: i < era.entries.length - 1 ? '.5px solid var(--bd)' : 'none' }}>
                      <div style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: '10px', fontWeight: 500, color: ERA_COLORS[era.era] ?? 'var(--rv)', marginBottom: '3px' }}>
                        {entry.yr}
                      </div>
                      <div style={{ fontFamily: "'Playfair Display', serif", fontSize: '15px', fontWeight: 600, color: 'var(--tx)', marginBottom: '5px' }}>
                        {entry.title}
                      </div>
                      <p style={{ fontSize: '12.5px', color: 'var(--tx)', lineHeight: 1.75, marginBottom: '6px' }}>
                        {entry.text}
                      </p>
                      {entry.src && (
                        <div style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: '9px', color: 'var(--tx3)', fontStyle: 'italic' }}>
                          Source: {entry.src}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              ))
            ) : (
              <EmptyState icon="📜" label="No history on file yet" sub="Historical records for this river are being researched." />
            )}
          </div>
        )}

        {/* ── TRIP REPORTS ─────────────────────────────────── */}
        {tab === 'Trip Reports' && (
          <div>
            {/* Hardcoded reviews from data */}
            {river.revs.length > 0 && (
              <div style={{ marginBottom: '20px' }}>
                {river.revs.map((rev, i) => (
                  <div key={`hc-${i}`} style={{ padding: '11px 0', borderBottom: '.5px solid var(--bd)' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '2px' }}>
                      <span style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: '10px', fontWeight: 500 }}>{rev.u}</span>
                      <span style={{ color: 'var(--am)', fontSize: '12px', letterSpacing: '2px' }}>{'★'.repeat(rev.s)}{'☆'.repeat(5 - rev.s)}</span>
                    </div>
                    <div style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: '9px', color: 'var(--tx3)', marginBottom: '4px' }}>{rev.d}</div>
                    <p style={{ fontSize: '12.5px', color: 'var(--tx)', lineHeight: 1.68, fontStyle: 'italic' }}>{rev.t}</p>
                  </div>
                ))}
              </div>
            )}

            {/* User-submitted reports from Supabase */}
            {userReports.length > 0 && (
              <div style={{ marginBottom: '20px' }}>
                <div style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: '9px', color: 'var(--rv)', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '8px' }}>
                  Community Reports
                </div>
                {userReports.map(report => (
                  <div key={report.id} style={{ padding: '11px 0', borderBottom: '.5px solid var(--bd)' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '2px' }}>
                      <span style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: '10px', fontWeight: 500 }}>{report.author_name}</span>
                      <span style={{ color: 'var(--am)', fontSize: '12px', letterSpacing: '2px' }}>{'★'.repeat(report.rating)}{'☆'.repeat(5 - report.rating)}</span>
                    </div>
                    <div style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: '9px', color: 'var(--tx3)', marginBottom: '4px', display: 'flex', gap: '8px' }}>
                      {report.trip_date && <span>{new Date(report.trip_date).toLocaleDateString()}</span>}
                      {report.flow_cfs && <span>{report.flow_cfs.toLocaleString()} cfs</span>}
                    </div>
                    <p style={{ fontSize: '12.5px', color: 'var(--tx)', lineHeight: 1.68 }}>{report.body}</p>
                    {report.photos.length > 0 && (
                      <div style={{ display: 'flex', gap: '6px', marginTop: '8px', overflowX: 'auto' }}>
                        {report.photos.map((url, pi) => (
                          <a key={pi} href={url} target="_blank" rel="noopener noreferrer">
                            <img src={url} alt="Trip photo" loading="lazy" decoding="async" style={{ width: '100px', height: '75px', objectFit: 'cover', borderRadius: '4px', border: '.5px solid var(--bd)' }} />
                          </a>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}

            {/* Load reports button */}
            {userReports.length === 0 && !loadingReports && (
              <button onClick={fetchReports} style={{
                fontFamily: "'IBM Plex Mono', monospace", fontSize: '10px', color: 'var(--rv)',
                background: 'none', border: '.5px solid var(--rvmd)', borderRadius: 'var(--r)',
                padding: '6px 14px', cursor: 'pointer', marginBottom: '14px',
              }}>
                Load community reports
              </button>
            )}
            {loadingReports && (
              <div style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: '10px', color: 'var(--tx3)', marginBottom: '14px' }}>
                Loading reports...
              </div>
            )}

            {/* Submit form */}
            <div style={{ background: 'var(--bg2)', borderRadius: 'var(--r)', padding: '14px', border: '.5px solid var(--bd)' }}>
              <div style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: '9px', color: 'var(--tx3)', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '12px' }}>
                Add a trip report
              </div>
              {submitted ? (
                <div style={{ textAlign: 'center', padding: '20px 0' }}>
                  <div style={{ fontSize: '24px', marginBottom: '6px' }}>&#127881;</div>
                  <div style={{ fontFamily: "'Playfair Display', serif", fontSize: '15px', color: 'var(--rv)', marginBottom: '4px' }}>Thanks for the report!</div>
                  <div style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: '10px', color: 'var(--tx3)' }}>Your trip report helps the paddling community.</div>
                  <button onClick={() => { setSubmitted(false); setForm({ name: '', stars: 4, text: '', cfs: '', tripDate: '' }); setPhotos([]) }}
                    style={{ marginTop: '10px', fontFamily: "'IBM Plex Mono', monospace", fontSize: '10px', color: 'var(--rv)', background: 'none', border: 'none', cursor: 'pointer', textDecoration: 'underline' }}>
                    Add another
                  </button>
                </div>
              ) : (
                <form onSubmit={submitReport}>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
                    <label style={labelStyle}>
                      Your name
                      <input type="text" value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
                        placeholder="Paddler name" required style={inputStyle} />
                    </label>
                    <label style={labelStyle}>
                      Trip date
                      <input type="date" value={form.tripDate} onChange={e => setForm(f => ({ ...f, tripDate: e.target.value }))}
                        style={inputStyle} />
                    </label>
                  </div>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
                    <label style={labelStyle}>
                      Flow at time of trip (CFS)
                      <input type="number" value={form.cfs} onChange={e => setForm(f => ({ ...f, cfs: e.target.value }))}
                        placeholder={`Current: ${formatCfs(flow.cfs)}`} style={inputStyle} />
                    </label>
                    <div style={{ marginBottom: '10px' }}>
                      <div style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: '9px', color: 'var(--tx3)', textTransform: 'uppercase', letterSpacing: '.5px', marginBottom: '6px' }}>
                        Rating
                      </div>
                      <div style={{ display: 'flex', gap: '4px' }}>
                        {[1, 2, 3, 4, 5].map(n => (
                          <button key={n} type="button" onClick={() => setForm(f => ({ ...f, stars: n }))}
                            style={{ fontSize: '18px', background: 'none', border: 'none', cursor: 'pointer',
                              color: n <= form.stars ? 'var(--am)' : 'var(--bd2)', padding: '0 2px', lineHeight: 1 }}>
                            &#9733;
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                  <label style={labelStyle}>
                    Trip notes
                    <textarea value={form.text} onChange={e => setForm(f => ({ ...f, text: e.target.value }))}
                      placeholder="Water conditions, hazards, highlights, put-in/take-out notes..."
                      required rows={4}
                      style={{ ...inputStyle, resize: 'vertical', fontFamily: 'Georgia, serif', lineHeight: 1.6 }} />
                  </label>

                  {/* Photo upload */}
                  <div style={{ marginBottom: '12px' }}>
                    <div style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: '9px', color: 'var(--tx3)', textTransform: 'uppercase', letterSpacing: '.5px', marginBottom: '6px' }}>
                      Photos (optional)
                    </div>
                    {photos.length > 0 && (
                      <div style={{ display: 'flex', gap: '6px', marginBottom: '8px', flexWrap: 'wrap' }}>
                        {photos.map((url, i) => (
                          <div key={i} style={{ position: 'relative' }}>
                            <img src={url} alt={`Upload ${i + 1}`} loading="lazy" decoding="async" style={{ width: '80px', height: '60px', objectFit: 'cover', borderRadius: '4px', border: '.5px solid var(--bd)' }} />
                            <button type="button" onClick={() => setPhotos(prev => prev.filter((_, j) => j !== i))}
                              style={{ position: 'absolute', top: -4, right: -4, width: 16, height: 16, borderRadius: '50%',
                                background: 'var(--dg)', color: '#fff', border: 'none', fontSize: '9px', cursor: 'pointer',
                                display: 'flex', alignItems: 'center', justifyContent: 'center', lineHeight: 1 }}>
                              x
                            </button>
                          </div>
                        ))}
                      </div>
                    )}
                    <label style={{
                      display: 'inline-flex', alignItems: 'center', gap: '6px', cursor: uploading ? 'wait' : 'pointer',
                      fontFamily: "'IBM Plex Mono', monospace", fontSize: '10px', color: 'var(--rv)',
                      padding: '6px 12px', border: '.5px solid var(--rvmd)', borderRadius: 'var(--r)',
                      background: 'var(--bg)', opacity: uploading ? 0.6 : 1,
                    }}>
                      {uploading ? 'Uploading...' : photos.length > 0 ? '+ Add more photos' : 'Upload photos'}
                      <input type="file" accept="image/*" multiple onChange={handlePhotoUpload}
                        disabled={uploading} style={{ display: 'none' }} />
                    </label>
                    {photos.length > 0 && (
                      <span style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: '9px', color: 'var(--tx3)', marginLeft: '8px' }}>
                        {photos.length} photo{photos.length !== 1 ? 's' : ''} attached
                      </span>
                    )}
                  </div>

                  {submitError && (
                    <div style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: '10px', color: 'var(--dg)', marginBottom: '8px' }}>
                      {submitError}
                    </div>
                  )}

                  <button type="submit" disabled={submitting}
                    style={{
                      fontFamily: "'IBM Plex Mono', monospace", fontSize: '10px',
                      background: 'var(--rv)', color: '#fff', border: 'none',
                      borderRadius: 'var(--r)', padding: '9px 18px',
                      cursor: submitting ? 'wait' : 'pointer',
                      letterSpacing: '.4px', opacity: submitting ? 0.7 : 1,
                    }}>
                    {submitting ? 'Submitting...' : 'Submit report'}
                  </button>
                </form>
              )}
            </div>
          </div>
        )}

        {/* ── FISHING ────────────────────────────────────────── */}
        {tab === 'Fishing' && (() => {
          // Wait for the lazy fisheries dataset to finish loading.
          if (!fisheries) return (
            <div style={{ padding: '20px', textAlign: 'center', fontFamily: "'IBM Plex Mono', monospace", fontSize: '10px', color: 'var(--tx3)' }}>Loading fisheries data...</div>
          )
          const fish = fisheries[river.id]
          if (!fish && stockingLoaded && stockingEvents.length === 0) return (
            <EmptyState icon="&#x1F3A3;" label="Fisheries data coming soon" sub="Species, hatch charts, stocking reports, and run timing for this river will appear here." />
          )
          if (!fish && !stockingLoaded) return (
            <div style={{ padding: '20px', textAlign: 'center', fontFamily: "'IBM Plex Mono', monospace", fontSize: '10px', color: 'var(--tx3)' }}>Loading...</div>
          )

          const mono = "'IBM Plex Mono', monospace"
          const serif = "'Playfair Display', serif"

          const speciesColors: Record<string, string> = {
            resident: 'var(--rv)',
            anadromous: 'var(--wt)',
            warmwater: 'var(--am)',
          }

          return (
            <div>
              {/* Au Sable Hex Hatch Hero */}
              {river.id === 'ausable' && (() => {
                const hexHatch = fish?.hatches.find(h => h.name.toLowerCase().includes('hex'))
                if (!hexHatch) return null
                const trigger = getHatchTrigger(hexHatch.name)
                const waterTempF = flow.tempC != null ? Math.round(flow.tempC * 9 / 5 + 32) : null
                const triggerMet = trigger && waterTempF ? waterTempF >= trigger.tempMinF : false
                const hexAlertSet = hatchAlerts.some(a => a.hatch_name === hexHatch.name && a.active)

                return (
                  <div style={{
                    marginBottom: '20px', borderRadius: 'var(--rlg)', overflow: 'hidden',
                    border: '.5px solid var(--rvmd)', background: 'var(--rvdk)', color: '#fff',
                  }}>
                    {/* Hero header */}
                    <div style={{ padding: '20px 18px 16px' }}>
                      <div style={{ fontFamily: mono, fontSize: '9px', letterSpacing: '2px', textTransform: 'uppercase', opacity: 0.6, marginBottom: '6px' }}>
                        Michigan&apos;s Most Legendary Fishing Event
                      </div>
                      <div style={{ fontFamily: serif, fontSize: '22px', fontWeight: 700, marginBottom: '10px' }}>
                        The Hex Hatch
                      </div>
                      <p style={{ fontFamily: mono, fontSize: '11px', opacity: 0.8, lineHeight: 1.7, marginBottom: '14px' }}>
                        The Hexagenia limbata hatch on the Au Sable River is one of the largest mayfly hatches in North America. Trout that ignore flies all year gorge on the surface for two weeks in late June and early July.
                      </p>

                      {/* Live status */}
                      <div style={{
                        display: 'flex', alignItems: 'center', gap: '12px', flexWrap: 'wrap',
                        padding: '10px 14px', background: 'rgba(255,255,255,.1)', borderRadius: 'var(--r)',
                        marginBottom: '14px',
                      }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                          <div style={{
                            width: 8, height: 8, borderRadius: '50%',
                            background: triggerMet ? 'var(--rv)' : waterTempF && trigger ? 'var(--am)' : 'var(--tx3)',
                          }} />
                          <span style={{ fontFamily: mono, fontSize: '10px', fontWeight: 500 }}>
                            {triggerMet ? 'CONDITIONS MET' : waterTempF && trigger && waterTempF >= trigger.tempMinF - 5 ? 'APPROACHING' : 'MONITORING'}
                          </span>
                        </div>
                        {waterTempF !== null && (
                          <span style={{ fontFamily: mono, fontSize: '10px', opacity: 0.8 }}>
                            Water: {waterTempF}°F {trigger ? `(trigger: ${trigger.tempMinF}°F)` : ''}
                          </span>
                        )}
                        {flow.cfs !== null && (
                          <span style={{ fontFamily: mono, fontSize: '10px', opacity: 0.8 }}>
                            Flow: {flow.cfs.toLocaleString()} cfs
                          </span>
                        )}
                      </div>

                      {/* Alert button */}
                      {hexAlertSet ? (
                        <span style={{ fontFamily: mono, fontSize: '10px', color: 'var(--rvmd)', display: 'flex', alignItems: 'center', gap: '4px' }}>
                          &#10003; Hex hatch alert set — we&apos;ll email you when conditions are right
                        </span>
                      ) : stockingAlertEmail && userIsPro ? (
                        <button onClick={() => setHatchAlertExpanded(hexHatch.name)} style={{
                          fontFamily: mono, fontSize: '11px', fontWeight: 500,
                          padding: '9px 20px', borderRadius: 'var(--r)',
                          background: '#fff', color: 'var(--rvdk)', border: 'none',
                          cursor: 'pointer', letterSpacing: '.3px',
                        }}>
                          Set Hex Hatch Alert &rarr;
                        </button>
                      ) : stockingAlertEmail ? (
                        <a href="/pro" style={{
                          display: 'inline-block', fontFamily: mono, fontSize: '11px', fontWeight: 500,
                          padding: '9px 20px', borderRadius: 'var(--r)',
                          background: '#fff', color: 'var(--rvdk)', textDecoration: 'none',
                          letterSpacing: '.3px',
                        }}>
                          Get Pro for Hex Alerts &rarr;
                        </a>
                      ) : (
                        <a href="/login" style={{
                          fontFamily: mono, fontSize: '10px', color: 'var(--rvmd)', textDecoration: 'underline',
                        }}>
                          Sign in to set a Hex hatch alert
                        </a>
                      )}
                    </div>

                    {/* Details sections */}
                    <div style={{ padding: '0 18px 18px', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                      <div>
                        <div style={{ fontFamily: mono, fontSize: '9px', letterSpacing: '1px', textTransform: 'uppercase', opacity: 0.5, marginBottom: '4px' }}>Timing</div>
                        <div style={{ fontFamily: mono, fontSize: '10px', opacity: 0.85, lineHeight: 1.6 }}>
                          Begins when water temps reach 60–65°F, typically the third week of June. Lasts 2–3 weeks. Peak activity after dark — 10pm to 2am.
                        </div>
                      </div>
                      <div>
                        <div style={{ fontFamily: mono, fontSize: '9px', letterSpacing: '1px', textTransform: 'uppercase', opacity: 0.5, marginBottom: '4px' }}>What to Expect</div>
                        <div style={{ fontFamily: mono, fontSize: '10px', opacity: 0.85, lineHeight: 1.6 }}>
                          Hexagenia are enormous — size 4–6 hooks, pale yellow. Fish the spinner fall and dun emergence. Bring a headlamp, waders, and patience.
                        </div>
                      </div>
                    </div>

                    <div style={{ padding: '0 18px 16px' }}>
                      <div style={{ fontFamily: mono, fontSize: '9px', letterSpacing: '1px', textTransform: 'uppercase', opacity: 0.5, marginBottom: '4px' }}>History</div>
                      <div style={{ fontFamily: mono, fontSize: '10px', opacity: 0.75, lineHeight: 1.6 }}>
                        Trout Unlimited was founded on the Au Sable in 1959 specifically to protect this fishery. The Hex hatch has drawn fly fishers from around the world for over a century.
                      </div>
                    </div>
                  </div>
                )
              })()}

              {/* Designations */}
              {fish && fish.designations.length > 0 && (
                <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap', marginBottom: '14px' }}>
                  {fish.designations.map((d, i) => (
                    <span key={i} style={{
                      fontFamily: mono, fontSize: '9px', padding: '4px 10px',
                      borderRadius: '12px', background: 'var(--rvlt)', color: 'var(--rvdk)',
                      border: '.5px solid var(--rvmd)',
                    }}>{d}</span>
                  ))}
                </div>
              )}

              {/* Species */}
              {fish && <div style={{ marginBottom: '16px' }}>
                <div style={{ fontFamily: mono, fontSize: '9px', color: 'var(--tx3)', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '8px' }}>
                  Species
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '8px' }}>
                  {fish.species.map((sp, i) => (
                    <div key={i} style={{
                      padding: '8px 10px', background: 'var(--bg2)', borderRadius: 'var(--r)',
                      border: `.5px solid ${sp.primary ? 'var(--rvmd)' : 'var(--bd)'}`,
                    }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '2px' }}>
                        <span style={{ width: 6, height: 6, borderRadius: '50%', background: speciesColors[sp.type], display: 'inline-block', flexShrink: 0 }} />
                        <span style={{ fontFamily: serif, fontSize: '13px', fontWeight: 600 }}>{sp.name}</span>
                        {sp.primary && <span style={{ fontFamily: mono, fontSize: '8px', color: 'var(--rv)', textTransform: 'uppercase' }}>Primary</span>}
                      </div>
                      <div style={{ fontFamily: mono, fontSize: '9px', color: 'var(--tx3)', textTransform: 'capitalize' }}>{sp.type}</div>
                      {sp.notes && <div style={{ fontSize: '10px', color: 'var(--tx2)', marginTop: '2px' }}>{sp.notes}</div>}
                    </div>
                  ))}
                </div>
              </div>}

              {/* Runs (Salmon/Steelhead) */}
              {fish && fish.runs.length > 0 && (
                <div style={{ marginBottom: '16px' }}>
                  <div style={{ fontFamily: mono, fontSize: '9px', color: 'var(--tx3)', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '8px' }}>
                    Run Timing
                  </div>
                  {fish.runs.map((run, i) => (
                    <div key={i} style={{ padding: '8px 10px', background: 'var(--bg2)', borderRadius: 'var(--r)', border: '.5px solid var(--bd)', marginBottom: '6px' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
                        <span style={{ fontFamily: serif, fontSize: '13px', fontWeight: 600 }}>{run.species}</span>
                        <span style={{ fontFamily: mono, fontSize: '10px', color: 'var(--wt)' }}>{run.timing}</span>
                      </div>
                      {run.peak && <div style={{ fontFamily: mono, fontSize: '10px', color: 'var(--rv)', marginTop: '2px' }}>Peak: {run.peak}</div>}
                      {run.notes && <div style={{ fontSize: '10px', color: 'var(--tx2)', marginTop: '2px' }}>{run.notes}</div>}
                    </div>
                  ))}
                </div>
              )}

              {/* Hatch Calendar with Alerts */}
              {fish && fish.hatches.length > 0 && (
                <div style={{ marginBottom: '16px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                    <div style={{ fontFamily: mono, fontSize: '9px', color: 'var(--tx3)', textTransform: 'uppercase', letterSpacing: '1px' }}>
                      Hatch Calendar &amp; Alerts
                    </div>
                    {stockingAlertEmail && (
                      <span style={{ fontFamily: mono, fontSize: '9px', color: 'var(--tx3)' }}>
                        {hatchAlerts.length} alert{hatchAlerts.length !== 1 ? 's' : ''} set
                      </span>
                    )}
                  </div>
                  {stockingAlertEmail && (
                    <div style={{ fontFamily: mono, fontSize: '10px', color: 'var(--tx2)', marginBottom: '10px', lineHeight: 1.6 }}>
                      Get notified when conditions are right for each hatch. We monitor water temperature and seasonal timing.
                    </div>
                  )}
                  <div style={{ border: '.5px solid var(--bd)', borderRadius: 'var(--r)', overflow: 'hidden' }}>
                    {fish.hatches.map((h, i) => {
                      const trigger = getHatchTrigger(h.name)
                      const isAlertSet = hatchAlerts.some(a => a.hatch_name === h.name && a.active)
                      const isExpanded = hatchAlertExpanded === h.name
                      const isSaving = hatchAlertSaving === h.name

                      return (
                        <div key={i} style={{
                          borderBottom: i < fish.hatches.length - 1 ? '.5px solid var(--bd)' : 'none',
                          background: i % 2 === 0 ? 'var(--bg)' : 'var(--bg2)',
                        }}>
                          <div style={{
                            display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start',
                            padding: '9px 10px',
                          }}>
                            <div style={{ flex: 1 }}>
                              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                                <span style={{ fontFamily: mono, fontSize: '11px', fontWeight: 500 }}>{h.name}</span>
                                {isAlertSet && <span style={{ color: 'var(--rv)', fontSize: '11px' }}>&#10003;</span>}
                              </div>
                              <div style={{ fontFamily: mono, fontSize: '10px', color: 'var(--rv)', marginTop: '2px' }}>
                                {h.timing}
                              </div>
                              {trigger && (
                                <div style={{ fontFamily: mono, fontSize: '9px', color: 'var(--wt)', marginTop: '2px' }}>
                                  Trigger: {trigger.description}
                                </div>
                              )}
                              {h.notes && <div style={{ fontSize: '9px', color: 'var(--tx2)', marginTop: '2px', fontStyle: 'italic' }}>{h.notes}</div>}
                            </div>
                            {/* Alert button */}
                            <div style={{ flexShrink: 0, marginLeft: '8px' }}>
                              {isAlertSet ? (
                                <button onClick={() => {
                                  const alert = hatchAlerts.find(a => a.hatch_name === h.name)
                                  if (alert) {
                                    fetch(`/api/hatch-alerts?id=${alert.id}`, { method: 'DELETE' })
                                    setHatchAlerts(prev => prev.filter(a => a.id !== alert.id))
                                  }
                                }} style={{
                                  fontFamily: mono, fontSize: '9px', color: 'var(--rv)',
                                  background: 'var(--rvlt)', border: '.5px solid var(--rvmd)',
                                  borderRadius: '4px', padding: '4px 8px', cursor: 'pointer',
                                  display: 'flex', alignItems: 'center', gap: '3px',
                                }}>
                                  &#10003; Alert Set
                                </button>
                              ) : stockingAlertEmail && userIsPro ? (
                                <button onClick={() => setHatchAlertExpanded(isExpanded ? null : h.name)} style={{
                                  fontFamily: mono, fontSize: '9px', color: 'var(--wt)',
                                  background: 'var(--wtlt)', border: '.5px solid var(--wtmd)',
                                  borderRadius: '4px', padding: '4px 8px', cursor: 'pointer',
                                }}>
                                  Set Alert
                                </button>
                              ) : stockingAlertEmail ? (
                                <button onClick={() => setHatchProPrompt(hatchProPrompt === h.name ? null : h.name)} style={{
                                  fontFamily: mono, fontSize: '9px', color: 'var(--wt)',
                                  background: 'var(--wtlt)', border: '.5px solid var(--wtmd)',
                                  borderRadius: '4px', padding: '4px 8px', cursor: 'pointer',
                                }}>
                                  Set Alert
                                </button>
                              ) : (
                                <a href="/login" style={{
                                  fontFamily: mono, fontSize: '9px', color: 'var(--tx3)',
                                  textDecoration: 'underline',
                                }}>
                                  Sign in
                                </a>
                              )}
                            </div>
                          </div>

                          {/* Pro upgrade prompt for free users */}
                          {hatchProPrompt === h.name && !userIsPro && (
                            <div style={{
                              padding: '14px', borderTop: '.5px solid var(--rvmd)',
                              background: 'var(--rvlt)',
                            }}>
                              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '8px' }}>
                                <span style={{ fontSize: '13px' }}>&#9889;</span>
                                <span style={{ fontFamily: mono, fontSize: '11px', fontWeight: 500, color: 'var(--rvdk)' }}>
                                  Hatch Alerts — RiverScout Pro
                                </span>
                              </div>
                              <div style={{ fontFamily: mono, fontSize: '11px', color: 'var(--tx)', lineHeight: 1.6, marginBottom: '10px' }}>
                                Get notified the moment water temps hit the {h.name} trigger{river.n ? ` on the ${river.n}` : ''}.
                              </div>
                              <div style={{ fontFamily: mono, fontSize: '10px', color: 'var(--tx2)', marginBottom: '12px', lineHeight: 1.5 }}>
                                Includes all hatch alerts, stocking alerts, and unlimited flow alerts.
                              </div>
                              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flexWrap: 'wrap' }}>
                                <a href="/pro" style={{
                                  fontFamily: mono, fontSize: '11px', fontWeight: 500,
                                  padding: '8px 20px', borderRadius: 'var(--r)',
                                  background: 'var(--rvdk)', color: '#fff',
                                  textDecoration: 'none', letterSpacing: '.3px',
                                }}>
                                  Upgrade to Pro &rarr;
                                </a>
                                <span style={{ fontFamily: mono, fontSize: '10px', color: 'var(--tx3)' }}>
                                  $4.99/month &middot; Cancel anytime
                                </span>
                              </div>
                            </div>
                          )}

                          {/* Expanded alert settings (Pro users only) */}
                          {isExpanded && (
                            <div style={{
                              padding: '10px 12px', borderTop: '.5px solid var(--bd)',
                              background: 'var(--wtlt)',
                            }}>
                              <div style={{ fontFamily: mono, fontSize: '10px', fontWeight: 500, color: 'var(--wt)', marginBottom: '8px' }}>
                                Alert settings for {h.name}
                              </div>
                              <div style={{ fontFamily: mono, fontSize: '10px', color: 'var(--tx2)', marginBottom: '8px' }}>
                                {trigger ? (
                                  <>Notify when water temp hits {trigger.tempMinF}°F and during the {h.timing} window</>
                                ) : (
                                  <>Notify before the {h.timing} window</>
                                )}
                              </div>
                              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '10px' }}>
                                <span style={{ fontFamily: mono, fontSize: '10px', color: 'var(--tx3)' }}>Alert lead time:</span>
                                <select value={hatchAlertDaysBefore} onChange={e => setHatchAlertDaysBefore(e.target.value)}
                                  style={{ padding: '4px 8px', fontFamily: mono, fontSize: '10px', border: '.5px solid var(--bd2)', borderRadius: 'var(--r)', background: 'var(--bg)', color: 'var(--tx)' }}>
                                  <option value="3">3 days before</option>
                                  <option value="7">7 days before</option>
                                  <option value="14">14 days before</option>
                                </select>
                              </div>
                              <div style={{ display: 'flex', gap: '8px' }}>
                                <button disabled={isSaving} onClick={async () => {
                                  setHatchAlertSaving(h.name)
                                  try {
                                    const res = await fetch('/api/hatch-alerts', {
                                      method: 'POST',
                                      headers: { 'Content-Type': 'application/json' },
                                      body: JSON.stringify({
                                        userId: stockingUserId,
                                        email: stockingAlertEmail,
                                        riverId: river.id,
                                        riverName: river.n,
                                        stateKey: river.stateKey,
                                        hatchName: h.name,
                                        species: h.name,
                                        notifyDaysBefore: parseInt(hatchAlertDaysBefore),
                                        notifyOnTempTrigger: !!trigger,
                                        notifyOnCalendar: true,
                                      }),
                                    })
                                    const data = await res.json()
                                    if (data.ok && data.alert) {
                                      setHatchAlerts(prev => [...prev, { id: data.alert.id, hatch_name: h.name, active: true }])
                                    }
                                  } catch { /* ignore */ }
                                  setHatchAlertSaving(null)
                                  setHatchAlertExpanded(null)
                                }} style={{
                                  fontFamily: mono, fontSize: '10px', fontWeight: 500,
                                  padding: '6px 16px', borderRadius: 'var(--r)',
                                  background: 'var(--wt)', color: '#fff', border: 'none',
                                  cursor: isSaving ? 'wait' : 'pointer', opacity: isSaving ? 0.6 : 1,
                                }}>
                                  {isSaving ? 'Saving...' : 'Save Alert'}
                                </button>
                                <button onClick={() => setHatchAlertExpanded(null)} style={{
                                  fontFamily: mono, fontSize: '10px', padding: '6px 12px',
                                  borderRadius: 'var(--r)', background: 'var(--bg)', color: 'var(--tx3)',
                                  border: '.5px solid var(--bd2)', cursor: 'pointer',
                                }}>
                                  Cancel
                                </button>
                              </div>
                            </div>
                          )}
                        </div>
                      )
                    })}
                  </div>
                </div>
              )}

              {/* ── Stocking Reports ─────────────────────────── */}
              {stockingLoaded && (() => {
                const now = new Date()
                const d90 = new Date(now.getTime() - 90 * 24 * 60 * 60 * 1000)
                const recent = stockingEvents.filter(ev => !ev.is_scheduled && new Date(ev.stocking_date + 'T00:00:00') >= d90)
                const historical = stockingEvents.filter(ev => !ev.is_scheduled && new Date(ev.stocking_date + 'T00:00:00') < d90)
                const scheduled = stockingEvents.filter(ev => ev.is_scheduled && new Date(ev.stocking_date + 'T00:00:00') >= now)

                const stockingSourceUrls: Record<string, string> = {
                  mi: 'https://www.michigan.gov/dnr/fishing/reports/stocking',
                  pa: 'https://www.fishandboat.com/Fish/StockingSchedules',
                  wv: 'https://www.wvdnr.gov/fishing/stocking.shtm',
                  va: 'https://dwr.virginia.gov/fishing/trout-stocking-schedules/',
                  nc: 'https://www.ncwildlife.org/fishing/trout-stocking-program',
                  tn: 'https://www.tnwildlife.org/fishing/trout-stocking',
                  co: 'https://cpw.state.co.us/thingstodo/Pages/FishingStocking.aspx',
                  ca: 'https://www.wildlife.ca.gov/Fishing/Inland/Stocking',
                  wa: 'https://wdfw.wa.gov/fishing/reports/stocking',
                  or: 'https://myodfw.com/fishing/stocking-schedules',
                  mt: 'https://myfwp.mt.gov/fwpPub/stockingSchedule',
                  ky: 'https://fw.ky.gov/Fish/Pages/Stocking-Schedules.aspx',
                  id: 'https://idfg.idaho.gov/fish/stocking',
                  az: 'https://www.azgfd.com/fishing/stocking/',
                }
                const dnrUrl = stockingSourceUrls[river.stateKey as string]

                const fmtDate = (iso: string) => {
                  const dt = new Date(iso + 'T00:00:00')
                  return dt.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
                }

                const sizeLabel = (ev: StockingEvent) => {
                  const parts: string[] = []
                  if (ev.quantity) parts.push(ev.quantity.toLocaleString())
                  if (ev.size_category) parts.push(ev.size_category)
                  if (ev.size_inches) parts.push(`(${ev.size_inches}\u2033)`)
                  return parts.length > 0 ? parts.join(' ') : 'Unknown quantity'
                }

                const renderEvent = (ev: StockingEvent, i: number, total: number, isScheduledSection: boolean) => (
                  <div key={ev.id} style={{
                    padding: '10px 12px',
                    borderBottom: i < total - 1 ? '.5px solid var(--bd)' : 'none',
                    background: i % 2 === 0 ? 'var(--bg)' : 'var(--bg2)',
                  }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '8px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                        <FishIcon species={ev.species} size={18} color="var(--wt)" />
                        <span style={{ fontFamily: serif, fontSize: '13px', fontWeight: 600 }}>{ev.species}</span>
                        {ev.verified && (
                          <span className="verified-badge" title="Verified stocking event">&#10003;</span>
                        )}
                      </div>
                      <span style={{ fontFamily: mono, fontSize: '10px', color: isScheduledSection ? 'var(--am)' : 'var(--tx3)', flexShrink: 0 }}>
                        {isScheduledSection ? 'Scheduled ' : ''}{fmtDate(ev.stocking_date)}
                      </span>
                    </div>
                    <div style={{ marginLeft: '25px', marginTop: '3px' }}>
                      <div style={{ fontFamily: mono, fontSize: '10px', color: 'var(--tx2)' }}>
                        {sizeLabel(ev)}
                      </div>
                      {ev.stocking_authority && (
                        <div style={{ fontFamily: mono, fontSize: '10px', color: 'var(--tx2)', marginTop: '1px' }}>
                          Stocked by {ev.stocking_authority}
                        </div>
                      )}
                      {ev.location_description && (
                        <div style={{ fontFamily: mono, fontSize: '9px', color: 'var(--tx3)', marginTop: '1px' }}>
                          Location: {ev.location_description}
                        </div>
                      )}
                      {isScheduledSection && (
                        <div style={{ fontFamily: mono, fontSize: '9px', color: 'var(--am)', marginTop: '2px', fontStyle: 'italic' }}>
                          Subject to change
                        </div>
                      )}
                      {isScheduledSection && (
                        <div style={{ display: 'flex', gap: '8px', marginTop: '5px', alignItems: 'center' }}>
                          <button onClick={() => setStockingAlertOpen(true)} style={{
                            fontFamily: mono, fontSize: '9px', color: 'var(--wt)',
                            background: 'var(--wtlt)', border: '.5px solid var(--wtmd)',
                            borderRadius: '4px', padding: '3px 8px', cursor: 'pointer',
                          }}>
                            Set Alert
                          </button>
                          {ev.source_url && (
                            <a href={ev.source_url} target="_blank" rel="noopener noreferrer"
                              style={{ fontFamily: mono, fontSize: '9px', color: 'var(--rv)' }}>
                              View source &#8599;
                            </a>
                          )}
                        </div>
                      )}
                      {!isScheduledSection && ev.source_url && (
                        <a href={ev.source_url} target="_blank" rel="noopener noreferrer"
                          style={{ fontFamily: mono, fontSize: '9px', color: 'var(--rv)', marginTop: '3px', display: 'inline-block' }}>
                          View source &#8599;
                        </a>
                      )}
                    </div>
                  </div>
                )

                return (
                  <>
                    {/* Subsection A — Recent Stockings */}
                    <div style={{ marginBottom: '16px' }}>
                      <div style={{ fontFamily: mono, fontSize: '9px', color: 'var(--tx3)', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '8px' }}>
                        Recent Stockings
                      </div>
                      {recent.length > 0 ? (
                        <div style={{ border: '.5px solid var(--bd)', borderRadius: 'var(--r)', overflow: 'hidden' }}>
                          {recent.map((ev, i) => renderEvent(ev, i, recent.length, false))}
                        </div>
                      ) : (
                        <div style={{
                          padding: '14px', background: 'var(--bg2)', borderRadius: 'var(--r)',
                          border: '.5px solid var(--bd)', fontFamily: mono, fontSize: '11px',
                          color: 'var(--tx2)', lineHeight: 1.6, textAlign: 'center',
                        }}>
                          No stocking records in the past 90 days for this river.<br />
                          Know about a recent stocking? Submit it below.
                        </div>
                      )}
                    </div>

                    {/* Subsection B — Scheduled Stockings */}
                    <div style={{ marginBottom: '16px' }}>
                      <div style={{ fontFamily: mono, fontSize: '9px', color: 'var(--tx3)', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '8px' }}>
                        Scheduled Stockings
                      </div>
                      {scheduled.length > 0 ? (
                        <div style={{ border: '.5px solid var(--am)', borderRadius: 'var(--r)', overflow: 'hidden' }}>
                          {scheduled.map((ev, i) => renderEvent(ev, i, scheduled.length, true))}
                        </div>
                      ) : (
                        <div style={{
                          padding: '14px', background: 'var(--bg2)', borderRadius: 'var(--r)',
                          border: '.5px solid var(--bd)', fontFamily: mono, fontSize: '11px',
                          color: 'var(--tx2)', lineHeight: 1.6, textAlign: 'center',
                        }}>
                          No upcoming stockings currently scheduled.
                          {dnrUrl ? (
                            <span> Check the <a href={String(dnrUrl)} target="_blank" rel="noopener noreferrer" style={{ color: 'var(--rv)' }}>
                              {String(river.stateName)} DNR stocking page &#8599;
                            </a> for the latest schedule.</span>
                          ) : null}
                        </div>
                      )}
                    </div>

                    {/* Stocking History */}
                    {historical.length > 0 && (
                      <div style={{ marginBottom: '16px' }}>
                        <div style={{ fontFamily: mono, fontSize: '9px', color: 'var(--tx3)', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '8px' }}>
                          Stocking History
                        </div>
                        <div style={{ border: '.5px solid var(--bd)', borderRadius: 'var(--r)', overflow: 'hidden' }}>
                          {historical.map((ev, i) => renderEvent(ev, i, historical.length, false))}
                        </div>
                      </div>
                    )}

                    {/* Subsection C — Submit a Stocking Report */}
                    <div style={{ marginBottom: '16px' }}>
                      <div style={{ fontFamily: mono, fontSize: '9px', color: 'var(--tx3)', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '8px' }}>
                        Know About a Stocking?
                      </div>
                      <div style={{
                        border: '.5px solid var(--bd)', borderRadius: 'var(--r)',
                        padding: '14px', background: 'var(--bg2)',
                      }}>
                        {stockingSubmitted ? (
                          <div style={{ textAlign: 'center', padding: '10px 0' }}>
                            <div style={{ fontSize: '20px', marginBottom: '6px' }}>&#10003;</div>
                            <div style={{ fontFamily: serif, fontSize: '14px', fontWeight: 600, color: 'var(--rv)', marginBottom: '4px' }}>
                              Thank you
                            </div>
                            <div style={{ fontFamily: mono, fontSize: '11px', color: 'var(--tx2)' }}>
                              Stocking report submitted. It will appear after review.
                            </div>
                          </div>
                        ) : !stockingUserId ? (
                          <div style={{ textAlign: 'center', padding: '8px 0' }}>
                            <div style={{ fontFamily: mono, fontSize: '11px', color: 'var(--tx2)', marginBottom: '10px' }}>
                              Sign in to submit stocking reports and help the fishing community
                            </div>
                            <a href="/login" style={{
                              fontFamily: mono, fontSize: '11px', fontWeight: 500,
                              padding: '8px 20px', borderRadius: 'var(--r)',
                              background: 'var(--rv)', color: '#fff',
                              textDecoration: 'none', display: 'inline-block',
                            }}>
                              Sign In
                            </a>
                          </div>
                        ) : (
                          <form onSubmit={async (e) => {
                            e.preventDefault()
                            if (!stockingForm.species || !stockingForm.date) {
                              setStockingError('Species and date are required')
                              return
                            }
                            setStockingSubmitting(true)
                            setStockingError('')
                            try {
                              const isGov = stockingForm.sourceUrl &&
                                (/\.gov(\/|$)/.test(stockingForm.sourceUrl) || /\.state\.\w+\.us/.test(stockingForm.sourceUrl))
                              const res = await fetch('/api/stocking', {
                                method: 'POST',
                                headers: { 'Content-Type': 'application/json' },
                                body: JSON.stringify({
                                  riverId: river.id,
                                  stateKey: river.stateKey,
                                  stockingDate: stockingForm.date,
                                  isScheduled: stockingForm.isScheduled,
                                  species: stockingForm.species,
                                  quantity: stockingForm.quantity ? parseInt(stockingForm.quantity) : null,
                                  sizeCategory: stockingForm.sizeCategory || null,
                                  locationDescription: stockingForm.locationDesc || null,
                                  sourceUrl: stockingForm.sourceUrl || null,
                                  userId: stockingUserId,
                                  autoVerified: !!isGov,
                                }),
                              })
                              const data = await res.json()
                              if (data.ok) {
                                setStockingSubmitted(true)
                                fetchStocking()
                              } else {
                                setStockingError(data.error || 'Failed to submit')
                              }
                            } catch {
                              setStockingError('Network error')
                            }
                            setStockingSubmitting(false)
                          }}>
                            <div style={{ fontFamily: mono, fontSize: '11px', color: 'var(--tx2)', marginBottom: '12px' }}>
                              Help other anglers by submitting stocking information
                            </div>

                            <div style={{ display: 'grid', gridTemplateColumns: '80px 1fr', gap: '8px', alignItems: 'center' }}>
                              <span style={{ fontFamily: mono, fontSize: '10px', color: 'var(--tx3)' }}>Species *</span>
                              <select value={stockingForm.species}
                                onChange={e => setStockingForm(f => ({ ...f, species: e.target.value }))}
                                style={{ padding: '7px 8px', fontFamily: mono, fontSize: '11px', border: '.5px solid var(--bd2)', borderRadius: 'var(--r)', background: 'var(--bg)', color: 'var(--tx)' }}>
                                <option value="">Select species...</option>
                                {['Brown Trout', 'Rainbow Trout', 'Brook Trout', 'Cutthroat Trout', 'Lake Trout', 'Steelhead', 'Chinook Salmon', 'Coho Salmon', 'Atlantic Salmon', 'Walleye', 'Muskie', 'Smallmouth Bass', 'Largemouth Bass', 'Channel Catfish', 'Other'].map(s =>
                                  <option key={s} value={s}>{s}</option>
                                )}
                              </select>

                              <span style={{ fontFamily: mono, fontSize: '10px', color: 'var(--tx3)' }}>Date *</span>
                              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                                <input type="date" value={stockingForm.date}
                                  onChange={e => setStockingForm(f => ({ ...f, date: e.target.value }))}
                                  style={{ padding: '7px 8px', fontFamily: mono, fontSize: '11px', border: '.5px solid var(--bd2)', borderRadius: 'var(--r)', background: 'var(--bg)', color: 'var(--tx)', flex: 1 }} />
                                <label style={{ display: 'flex', alignItems: 'center', gap: '4px', cursor: 'pointer', flexShrink: 0 }}>
                                  <input type="checkbox" checked={stockingForm.isScheduled}
                                    onChange={e => setStockingForm(f => ({ ...f, isScheduled: e.target.checked }))}
                                    style={{ accentColor: 'var(--am)' }} />
                                  <span style={{ fontFamily: mono, fontSize: '10px', color: 'var(--am)' }}>Scheduled</span>
                                </label>
                              </div>

                              <span style={{ fontFamily: mono, fontSize: '10px', color: 'var(--tx3)' }}>Quantity</span>
                              <input type="number" value={stockingForm.quantity} placeholder="e.g. 2000"
                                onChange={e => setStockingForm(f => ({ ...f, quantity: e.target.value }))}
                                style={{ padding: '7px 8px', fontFamily: mono, fontSize: '11px', border: '.5px solid var(--bd2)', borderRadius: 'var(--r)', background: 'var(--bg)', color: 'var(--tx)' }} />

                              <span style={{ fontFamily: mono, fontSize: '10px', color: 'var(--tx3)' }}>Size</span>
                              <select value={stockingForm.sizeCategory}
                                onChange={e => setStockingForm(f => ({ ...f, sizeCategory: e.target.value }))}
                                style={{ padding: '7px 8px', fontFamily: mono, fontSize: '11px', border: '.5px solid var(--bd2)', borderRadius: 'var(--r)', background: 'var(--bg)', color: 'var(--tx)' }}>
                                <option value="">Select size (optional)</option>
                                <option value="fingerling">Fingerling (2-4&quot;)</option>
                                <option value="sub-catchable">Sub-catchable (4-6&quot;)</option>
                                <option value="catchable">Catchable (9-11&quot;)</option>
                                <option value="trophy">Trophy (14-16&quot;)</option>
                                <option value="broodstock">Broodstock (18&quot;+)</option>
                              </select>

                              <span style={{ fontFamily: mono, fontSize: '10px', color: 'var(--tx3)' }}>Location</span>
                              <input type="text" value={stockingForm.locationDesc} placeholder="Section or access point"
                                onChange={e => setStockingForm(f => ({ ...f, locationDesc: e.target.value }))}
                                style={{ padding: '7px 8px', fontFamily: mono, fontSize: '11px', border: '.5px solid var(--bd2)', borderRadius: 'var(--r)', background: 'var(--bg)', color: 'var(--tx)' }} />

                              <span style={{ fontFamily: mono, fontSize: '10px', color: 'var(--tx3)' }}>Source</span>
                              <input type="url" value={stockingForm.sourceUrl} placeholder="Link to official announcement"
                                onChange={e => setStockingForm(f => ({ ...f, sourceUrl: e.target.value }))}
                                style={{ padding: '7px 8px', fontFamily: mono, fontSize: '11px', border: '.5px solid var(--bd2)', borderRadius: 'var(--r)', background: 'var(--bg)', color: 'var(--tx)' }} />
                            </div>

                            {stockingError && <div style={{ fontFamily: mono, fontSize: '10px', color: 'var(--dg)', marginTop: '8px' }}>{stockingError}</div>}

                            <button type="submit" disabled={stockingSubmitting} style={{
                              marginTop: '12px', width: '100%', padding: '10px',
                              fontFamily: mono, fontSize: '11px', fontWeight: 500,
                              background: 'var(--rv)', color: '#fff', border: 'none',
                              borderRadius: 'var(--r)', cursor: stockingSubmitting ? 'wait' : 'pointer',
                              opacity: stockingSubmitting ? 0.6 : 1,
                            }}>
                              {stockingSubmitting ? 'Submitting...' : 'Submit Stocking Report'}
                            </button>
                          </form>
                        )}
                      </div>
                    </div>

                    {/* Stocking Alert Modal */}
                    {stockingAlertOpen && (
                      <div onClick={() => { setStockingAlertOpen(false); setStockingAlertDone(false) }} style={{
                        position: 'fixed', inset: 0, background: 'rgba(0,0,0,.4)',
                        zIndex: 100, display: 'flex', alignItems: 'center', justifyContent: 'center',
                      }}>
                        <div onClick={e => e.stopPropagation()} style={{
                          background: 'var(--bg)', borderRadius: 'var(--rlg)',
                          padding: '24px', maxWidth: '400px', width: '90%',
                          boxShadow: '0 8px 40px rgba(0,0,0,.2)',
                        }}>
                          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
                            <div style={{ fontFamily: serif, fontSize: '16px', fontWeight: 700, color: 'var(--rvdk)' }}>
                              Get notified when {river.n} is stocked
                            </div>
                            <button onClick={() => { setStockingAlertOpen(false); setStockingAlertDone(false) }} style={{
                              background: 'none', border: 'none', fontSize: '16px', color: 'var(--tx3)', cursor: 'pointer',
                            }}>&#10005;</button>
                          </div>

                          {!userIsPro && !stockingAlertDone ? (
                            <div style={{ textAlign: 'center', padding: '12px 0' }}>
                              <div style={{ fontSize: '18px', marginBottom: '8px' }}>&#9889;</div>
                              <div style={{ fontFamily: mono, fontSize: '11px', color: 'var(--rvdk)', marginBottom: '4px', fontWeight: 500 }}>
                                RiverScout Pro
                              </div>
                              <div style={{ fontFamily: mono, fontSize: '11px', color: 'var(--tx2)', marginBottom: '4px' }}>
                                Stocking alerts are a Pro feature
                              </div>
                              <div style={{ fontFamily: mono, fontSize: '10px', color: 'var(--tx3)', marginBottom: '14px' }}>
                                $4.99/month &middot; Cancel anytime
                              </div>
                              <a href="/pro" style={{
                                display: 'inline-block', fontFamily: mono, fontSize: '11px', fontWeight: 500,
                                padding: '9px 24px', borderRadius: 'var(--r)',
                                background: 'var(--rvdk)', color: '#fff',
                                textDecoration: 'none', letterSpacing: '.3px',
                              }}>
                                Upgrade to Pro &rarr;
                              </a>
                            </div>
                          ) : stockingAlertDone ? (
                            <div style={{ textAlign: 'center', padding: '12px 0' }}>
                              <div style={{ fontSize: '20px', marginBottom: '6px' }}>&#10003;</div>
                              <div style={{ fontFamily: mono, fontSize: '11px', color: 'var(--rv)', marginBottom: '8px' }}>
                                Stocking alert set! We'll email you when this river is stocked.
                              </div>
                              <div style={{ fontFamily: mono, fontSize: '9px', color: 'var(--tx3)' }}>
                                Stocking alerts are free during beta. They'll be part of RiverScout Pro ($4.99/mo) when it launches.
                              </div>
                            </div>
                          ) : (
                            <div>
                              <label style={{ display: 'block', marginBottom: '12px' }}>
                                <span style={{ fontFamily: mono, fontSize: '10px', color: 'var(--tx2)', display: 'block', marginBottom: '4px' }}>Email</span>
                                <input type="email" value={stockingAlertEmail}
                                  onChange={e => setStockingAlertEmail(e.target.value)}
                                  placeholder="you@email.com"
                                  style={{ width: '100%', padding: '8px 10px', fontFamily: mono, fontSize: '12px', border: '.5px solid var(--bd2)', borderRadius: 'var(--r)', background: 'var(--bg)', color: 'var(--tx)', boxSizing: 'border-box' }} />
                              </label>

                              <div style={{ marginBottom: '14px' }}>
                                <span style={{ fontFamily: mono, fontSize: '10px', color: 'var(--tx2)', display: 'block', marginBottom: '6px' }}>Notify me about:</span>
                                {['All species', 'Brown Trout', 'Rainbow Trout', 'Brook Trout', 'Salmon / Steelhead'].map(sp => (
                                  <label key={sp} style={{ display: 'flex', alignItems: 'center', gap: '6px', padding: '3px 0', cursor: 'pointer' }}>
                                    <input type="checkbox"
                                      checked={stockingAlertSpecies.includes(sp) || (sp === 'All species' && stockingAlertSpecies.includes('All species'))}
                                      onChange={e => {
                                        if (sp === 'All species') {
                                          setStockingAlertSpecies(e.target.checked ? ['All species'] : [])
                                        } else {
                                          setStockingAlertSpecies(prev => {
                                            const without = prev.filter(s => s !== 'All species' && s !== sp)
                                            return e.target.checked ? [...without, sp] : without
                                          })
                                        }
                                      }}
                                      style={{ accentColor: 'var(--rv)' }} />
                                    <span style={{ fontFamily: mono, fontSize: '11px', color: 'var(--tx)' }}>{sp}</span>
                                  </label>
                                ))}
                              </div>

                              <button
                                disabled={stockingAlertSubmitting || !stockingAlertEmail}
                                onClick={async () => {
                                  setStockingAlertSubmitting(true)
                                  try {
                                    const res = await fetch('/api/stocking/alerts', {
                                      method: 'POST',
                                      headers: { 'Content-Type': 'application/json' },
                                      body: JSON.stringify({
                                        email: stockingAlertEmail,
                                        riverId: river.id,
                                        stateKey: river.stateKey,
                                        userId: stockingUserId,
                                        speciesFilter: stockingAlertSpecies,
                                      }),
                                    })
                                    const data = await res.json()
                                    if (data.ok) setStockingAlertDone(true)
                                  } catch { /* ignore */ }
                                  setStockingAlertSubmitting(false)
                                }}
                                style={{
                                  width: '100%', padding: '10px', fontFamily: mono, fontSize: '11px', fontWeight: 500,
                                  background: 'var(--rv)', color: '#fff', border: 'none', borderRadius: 'var(--r)',
                                  cursor: stockingAlertSubmitting ? 'wait' : 'pointer',
                                  opacity: (stockingAlertSubmitting || !stockingAlertEmail) ? 0.6 : 1,
                                }}>
                                {stockingAlertSubmitting ? 'Setting alert...' : 'Set Stocking Alert'}
                              </button>
                            </div>
                          )}
                        </div>
                      </div>
                    )}
                  </>
                )
              })()}

              {/* Spawn Timing */}
              {fish && fish.spawning.length > 0 && (
                <div style={{ marginBottom: '16px' }}>
                  <div style={{ fontFamily: mono, fontSize: '9px', color: 'var(--tx3)', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '8px' }}>
                    Spawn Timing
                  </div>
                  <div style={{ background: 'var(--amlt)', border: '.5px solid var(--am)', borderRadius: 'var(--r)', padding: '10px 12px' }}>
                    <div style={{ fontFamily: mono, fontSize: '9px', color: 'var(--am)', marginBottom: '6px', fontWeight: 500 }}>
                      Please avoid wading on spawning beds (redds)
                    </div>
                    {fish.spawning.map((s, i) => (
                      <div key={i} style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '3px' }}>
                        <span style={{ fontFamily: mono, fontSize: '10px' }}>{s.species}</span>
                        <span style={{ fontFamily: mono, fontSize: '10px', color: 'var(--am)' }}>{s.season}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Guide Services */}
              {fish && fish.guides.length > 0 && (
                <div>
                  <div style={{ fontFamily: mono, fontSize: '9px', color: 'var(--tx3)', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '8px' }}>
                    Fishing Guides
                  </div>
                  {fish.guides.map((g, i) => (
                    <div key={i} style={{ padding: '8px 10px', background: 'var(--bg2)', borderRadius: 'var(--r)', border: '.5px solid var(--bd)', marginBottom: '6px' }}>
                      <span style={{ fontFamily: mono, fontSize: '11px', fontWeight: 500, color: 'var(--rvdk)' }}>{g}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )
        })()}

        {/* ── MAPS & GUIDES ──────────────────────────────────── */}
        {tab === 'Maps & Guides' && (
          <div>
            <div style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: '9px', color: 'var(--tx3)', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '12px' }}>
              Maps & Guides for {river.n}
            </div>

            {/* Interactive River Map */}
            {riverHasMap && (
              <div style={{ marginBottom: '16px' }}>
                {!riverMapData && !riverMapLoading && (
                  <button onClick={async () => {
                    setRiverMapLoading(true)
                    const data = await loadRiverMap(river.id)
                    if (data) setRiverMapData(data)
                    setRiverMapLoading(false)
                  }} style={{
                    width: '100%', padding: '14px', border: '.5px solid var(--rvmd)',
                    borderRadius: 'var(--rlg)', background: 'var(--rvlt)', cursor: 'pointer',
                    fontFamily: "'IBM Plex Mono', monospace", fontSize: '11px', color: 'var(--rvdk)',
                    textAlign: 'center',
                  }}>
                    Load Interactive River Map — Access Points, Distances & Paddle Times
                  </button>
                )}
                {riverMapLoading && (
                  <div style={{ padding: '20px', textAlign: 'center', fontFamily: "'IBM Plex Mono', monospace", fontSize: '10px', color: 'var(--tx3)' }}>
                    Loading map data...
                  </div>
                )}
                {riverMapData && (
                  <RiverMap
                    riverName={river.n}
                    accessPoints={riverMapData.accessPoints}
                    sections={riverMapData.sections}
                    riverPath={riverMapData.riverPath}
                  />
                )}
              </div>
            )}

            {/* Featured map placeholder */}
            <div style={{ border: '.5px solid var(--rvmd)', borderRadius: 'var(--rlg)', padding: '16px 18px', background: 'var(--rvlt)', marginBottom: '12px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <div>
                  <div style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: '9px', color: 'var(--rv)', textTransform: 'uppercase', letterSpacing: '.7px', marginBottom: '4px' }}>
                    Featured Map
                  </div>
                  <div style={{ fontFamily: "'Playfair Display', serif", fontSize: '15px', fontWeight: 600, color: 'var(--rvdk)', marginBottom: '4px' }}>
                    {river.n} — River Map & Guide
                  </div>
                  <div style={{ fontSize: '12px', color: 'var(--tx2)', lineHeight: 1.5, marginBottom: '8px' }}>
                    Detailed put-in/take-out locations, rapid ratings, mile markers, camping, and access points.
                  </div>
                  <div style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: '10px', color: 'var(--tx3)' }}>
                    Waterproof · Double-sided · Updated {new Date().getFullYear()}
                  </div>
                </div>
              </div>
              <div style={{
                marginTop: '12px', display: 'inline-block',
                fontFamily: "'IBM Plex Mono', monospace", fontSize: '11px',
                padding: '8px 18px', borderRadius: 'var(--r)',
                background: 'var(--rvdk)', color: '#fff', cursor: 'default',
                opacity: 0.7,
              }}>
                Coming Soon
              </div>
            </div>

            {/* Additional map slots */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
              <div style={{ border: '.5px solid var(--bd)', borderRadius: 'var(--r)', padding: '12px 14px', background: 'var(--bg2)' }}>
                <div style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: '9px', color: 'var(--tx3)', textTransform: 'uppercase', letterSpacing: '.5px', marginBottom: '4px' }}>
                  Topographic Map
                </div>
                <div style={{ fontFamily: "'Playfair Display', serif", fontSize: '13px', fontWeight: 600, color: 'var(--tx)', marginBottom: '3px' }}>
                  {river.co.split('/')[0].trim()} County Topo
                </div>
                <div style={{ fontSize: '11px', color: 'var(--tx2)', marginBottom: '8px' }}>
                  USGS 7.5-minute quadrangle covering the river corridor
                </div>
                <div style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: '10px', color: 'var(--tx3)' }}>
                  Coming Soon
                </div>
              </div>

              <div style={{ border: '.5px solid var(--bd)', borderRadius: 'var(--r)', padding: '12px 14px', background: 'var(--bg2)' }}>
                <div style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: '9px', color: 'var(--tx3)', textTransform: 'uppercase', letterSpacing: '.5px', marginBottom: '4px' }}>
                  Guidebook
                </div>
                <div style={{ fontFamily: "'Playfair Display', serif", fontSize: '13px', fontWeight: 600, color: 'var(--tx)', marginBottom: '3px' }}>
                  {river.abbr} Paddling Guide
                </div>
                <div style={{ fontSize: '11px', color: 'var(--tx2)', marginBottom: '8px' }}>
                  Comprehensive guidebook covering rivers in {river.abbr}
                </div>
                <div style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: '10px', color: 'var(--tx3)' }}>
                  Coming Soon
                </div>
              </div>
            </div>

            {/* Affiliate notice */}
            <div style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: '9px', color: 'var(--tx3)', marginTop: '16px', lineHeight: 1.5, fontStyle: 'italic' }}>
              Maps and guides are selected by RiverScout editors. Some links may earn a small commission that supports this site.
            </div>
          </div>
        )}

        {/* ── DOCUMENTS ─────────────────────────────────────── */}
        {tab === 'Documents' && (
          <div>
            {hasDocs ? (
              <div>
                <div style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: '9px', color: 'var(--tx3)', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '10px' }}>
                  {river.docs.length} document{river.docs.length !== 1 ? 's' : ''}
                </div>
                {river.docs.map((doc, i) => {
                  const inner = (
                    <>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '4px' }}>
                        <div style={{ fontFamily: "'Playfair Display', serif", fontSize: '13px', fontWeight: 600, color: doc.url ? 'var(--rvdk)' : 'var(--tx)', flex: 1, marginRight: '8px' }}>
                          {doc.t}
                          {doc.url && <span style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: '9px', color: 'var(--rv)', marginLeft: '6px' }}>↗</span>}
                        </div>
                        <span style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: '9px', padding: '2px 6px', borderRadius: '3px', background: 'var(--rvlt)', color: 'var(--rvdk)', flexShrink: 0 }}>
                          {doc.tp}
                        </span>
                      </div>
                      <div style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: '9px', color: 'var(--tx3)' }}>
                        {doc.s} · {doc.y} · {doc.pg} pages
                      </div>
                    </>
                  )
                  return doc.url ? (
                    <a key={i} href={doc.url.startsWith('http') ? doc.url : `https://${doc.url}`} target="_blank" rel="noopener noreferrer"
                      style={{ display: 'block', padding: '10px 12px', background: 'var(--bg2)', borderRadius: 'var(--r)', marginBottom: '8px', border: '.5px solid var(--bd)', textDecoration: 'none', color: 'inherit', transition: 'border-color .15s', }}
                      onMouseEnter={e => (e.currentTarget.style.borderColor = 'var(--rvmd)')}
                      onMouseLeave={e => (e.currentTarget.style.borderColor = 'var(--bd)')}
                    >{inner}</a>
                  ) : (
                    <div key={i} style={{ padding: '10px 12px', background: 'var(--bg2)', borderRadius: 'var(--r)', marginBottom: '8px', border: '.5px solid var(--bd)' }}>
                      {inner}
                    </div>
                  )
                })}
              </div>
            ) : (
              <EmptyState icon="📄" label="No documents on file" sub="Permit forms, maps, and guides for this river will appear here." />
            )}
          </div>
        )}

      </div>
    </div>
  )
}

// ── Data Accuracy component ──────────────────────────────────────

const accuracyFieldLabels: Record<string, string> = {
  cls: 'Whitewater Class', opt: 'Optimal CFS Range', len: 'River Length',
  desc: 'Description', desig: 'Designations', species: 'Fish Species',
  hatches: 'Hatch Calendar', runs: 'Run Timing', spawning: 'Spawn Timing',
  access_points: 'Access Points', sections: 'Sections', gauge: 'USGS Gauge',
  outfitters: 'Outfitters', history: 'History', other: 'Other',
}

function relativeTime(dateStr: string): string {
  const diff = Date.now() - new Date(dateStr).getTime()
  const mins = Math.floor(diff / 60000)
  const hours = Math.floor(diff / 3600000)
  const days = Math.floor(diff / 86400000)
  const weeks = Math.floor(days / 7)
  if (mins < 60) return `${mins}m ago`
  if (hours < 24) return `${hours}h ago`
  if (days === 1) return 'yesterday'
  if (days < 7) return `${days} days ago`
  if (weeks < 5) return `${weeks} weeks ago`
  return new Date(dateStr).toLocaleDateString()
}

function DataAccuracy({ riverId }: { riverId: string }) {
  const [changes, setChanges] = useState<Array<{ field: string; reviewed_at: string }>>([])
  const [loaded, setLoaded] = useState(false)
  const [expanded, setExpanded] = useState(false)

  useEffect(() => {
    fetch(`/api/suggestions?riverId=${riverId}`)
      .then(r => r.json())
      .then(data => {
        setChanges(data.changes || [])
        setLoaded(true)
      })
      .catch(() => setLoaded(true))
  }, [riverId])

  if (!loaded) return null

  const visible = expanded ? changes : changes.slice(0, 3)
  const hasMore = changes.length > 3

  return (
    <div style={{ marginBottom: '14px' }}>
      <div
        onClick={() => changes.length > 0 ? setExpanded(!expanded) : null}
        style={{
          display: 'flex', alignItems: 'center', gap: '6px',
          cursor: changes.length > 0 ? 'pointer' : 'default',
          fontFamily: "'IBM Plex Mono', monospace", fontSize: '9px',
          color: 'var(--rv)', textTransform: 'uppercase', letterSpacing: '1px',
          marginBottom: '6px',
        }}
      >
        <span style={{ fontSize: '12px' }}>&#10003;</span>
        Data Accuracy
        {changes.length > 0 && (
          <span style={{ fontSize: '9px', color: 'var(--tx3)', textTransform: 'none', letterSpacing: 0 }}>
            ({changes.length} community improvement{changes.length !== 1 ? 's' : ''})
          </span>
        )}
      </div>

      {changes.length === 0 ? (
        <div style={{
          fontFamily: "'IBM Plex Mono', monospace", fontSize: '10px', color: 'var(--tx3)',
          padding: '8px 10px', background: 'var(--bg2)', borderRadius: 'var(--r)',
          border: '.5px solid var(--bd)',
        }}>
          Data verified by RiverScout team
        </div>
      ) : (
        <div style={{
          padding: '8px 10px', background: 'var(--bg2)', borderRadius: 'var(--r)',
          border: '.5px solid var(--bd)',
        }}>
          {visible.map((c, i) => (
            <div key={i} style={{
              fontFamily: "'IBM Plex Mono', monospace", fontSize: '10px', color: 'var(--tx2)',
              padding: '3px 0',
              borderBottom: i < visible.length - 1 ? '.5px solid var(--bd)' : 'none',
            }}>
              <span style={{ color: 'var(--tx)' }}>{accuracyFieldLabels[c.field] || c.field}</span>
              {' '}updated — community contribution — {' '}
              <span style={{ color: 'var(--tx3)' }}>{relativeTime(c.reviewed_at)}</span>
            </div>
          ))}
          {hasMore && !expanded && (
            <button onClick={() => setExpanded(true)} style={{
              fontFamily: "'IBM Plex Mono', monospace", fontSize: '9px', color: 'var(--rv)',
              background: 'none', border: 'none', cursor: 'pointer', padding: '4px 0', marginTop: '2px',
            }}>
              View full history ({changes.length - 3} more)
            </button>
          )}
          {expanded && hasMore && (
            <button onClick={() => setExpanded(false)} style={{
              fontFamily: "'IBM Plex Mono', monospace", fontSize: '9px', color: 'var(--tx3)',
              background: 'none', border: 'none', cursor: 'pointer', padding: '4px 0', marginTop: '2px',
            }}>
              Show less
            </button>
          )}
        </div>
      )}
    </div>
  )
}

// ── Small helpers ─────────────────────────────────────────────────

function EmptyState({ icon, label, sub }: { icon: string; label: string; sub: string }) {
  return (
    <div style={{ textAlign: 'center', padding: '40px 20px', color: 'var(--tx2)' }}>
      <div style={{ fontSize: '32px', marginBottom: '8px', opacity: 0.4 }}>{icon}</div>
      <div style={{ fontFamily: "'Playfair Display', serif", fontSize: '15px', marginBottom: '4px' }}>{label}</div>
      <div style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: '10px', color: 'var(--tx3)', lineHeight: 1.6 }}>{sub}</div>
    </div>
  )
}

function CondItem({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <div style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: '8px', color: 'var(--tx3)', textTransform: 'uppercase', letterSpacing: '.5px', marginBottom: '2px' }}>{label}</div>
      <div style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: '11px', color: 'var(--tx)' }}>{value}</div>
    </div>
  )
}

function GearItem({ label }: { label: string }) {
  const [checked, setChecked] = useState(false)
  return (
    <div
      onClick={() => setChecked(c => !c)}
      style={{
        display: 'flex', alignItems: 'center', gap: '9px',
        padding: '6px 0', borderBottom: '.5px solid var(--bd)',
        cursor: 'pointer',
      }}
    >
      <div style={{
        width: '14px', height: '14px', borderRadius: '3px',
        border: `.5px solid ${checked ? 'var(--rv)' : 'var(--bd2)'}`,
        background: checked ? 'var(--rv)' : 'var(--bg)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        flexShrink: 0, transition: 'all .12s',
      }}>
        {checked && <span style={{ color: '#fff', fontSize: '9px', lineHeight: 1 }}>✓</span>}
      </div>
      <span style={{
        fontSize: '12px', color: checked ? 'var(--tx3)' : 'var(--tx)',
        textDecoration: checked ? 'line-through' : 'none',
        transition: 'color .12s',
      }}>{label}</span>
    </div>
  )
}

// Shared input styles
const labelStyle: React.CSSProperties = {
  display: 'flex',
  flexDirection: 'column',
  gap: '5px',
  marginBottom: '10px',
  fontFamily: "'IBM Plex Mono', monospace",
  fontSize: '9px',
  color: 'var(--tx3)',
  textTransform: 'uppercase',
  letterSpacing: '.5px',
}

const inputStyle: React.CSSProperties = {
  fontFamily: "'IBM Plex Mono', monospace",
  fontSize: '11px',
  color: 'var(--tx)',
  background: 'var(--bg)',
  border: '.5px solid var(--bd2)',
  borderRadius: 'var(--r)',
  padding: '7px 9px',
  outline: 'none',
  width: '100%',
  boxSizing: 'border-box',
}
