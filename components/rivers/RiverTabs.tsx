'use client'

import { useState, useEffect, useCallback } from 'react'
import dynamic from 'next/dynamic'
import type { River, FlowData } from '@/types'
import { formatCfs, celsiusToFahrenheit } from '@/lib/usgs'
import { supabase } from '@/lib/supabase'

// Lazy-load Mapbox-backed map component. ssr: false because Mapbox GL JS
// needs the browser DOM. The JS chunk downloads when `<RiverMap>` first
// renders (which happens automatically when the Maps tab becomes active
// and map data loads via the useEffect). The loading placeholder matches
// the spinner we show in the Maps tab body so the user sees one
// continuous loading state, not a flash.
const RiverMap = dynamic(() => import('@/components/maps/RiverMap'), {
  loading: () => (
    <div style={{
      height: '350px', background: '#f0efec', borderRadius: 'var(--rlg)',
      display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
      gap: '10px',
    }}>
      <style>{`@keyframes river-map-spin { to { transform: rotate(360deg); } }`}</style>
      <div style={{
        width: '24px', height: '24px',
        border: '2.5px solid var(--bd2)',
        borderTopColor: 'var(--rv)',
        borderRadius: '50%',
        animation: 'river-map-spin .8s linear infinite',
      }} />
      <span style={{
        fontFamily: "'IBM Plex Mono', monospace",
        fontSize: '10px', color: 'var(--tx3)',
        letterSpacing: '.5px',
      }}>
        Loading map…
      </span>
    </div>
  ),
  ssr: false,
})
import RiverPermits from '@/components/rivers/RiverPermits'
import GaugeSwitcher from '@/components/rivers/GaugeSwitcher'
import { hasRiverMap, loadRiverMap } from '@/data/river-maps'
// FISHERIES (~4200 lines, ~150 kB) is dynamically imported when the user
// clicks the Fishing tab. See `loadFisheries` below.
// `hasFisheries` is a lightweight Set lookup used to hide the Fishing tab
// entirely for rivers without fisheries data — no need to pay the 150 kB
// cost just to decide whether to render the tab.
import { hasFisheries } from '@/data/fisheries-keys'
import { RAPIDS } from '@/data/rapids'
import FishIcon from '@/components/icons/FishIcons'
import { SHOW_PRO_TIER, SHOW_NOAA_FORECAST } from '@/lib/features'
import { getHatchTrigger } from '@/lib/hatch-triggers'
import type { AccessPoint, RiverSection } from '@/components/maps/RiverMap'
import type { RiverFisheries } from '@/types'
import type { RiverPageData } from '@/lib/river-page-data'
import ContributorBadge from '@/components/ContributorBadge'

const TABS = ['Overview', 'History', 'Trip Reports', 'Q&A', 'Fishing', 'Maps & Guides', 'Documents'] as const
type Tab = typeof TABS[number]

// Access points — local writable mirror of PrefetchedAccessPoint
// from lib/river-page-data.ts. We redeclare here so RiverTabs can
// own its own state without spreading the SSR type across client
// mutators.
interface AccessPointLite {
  id: string
  river_id: string
  name: string
  description: string | null
  access_type: string | null
  ramp_surface: string | null
  trailer_access: boolean
  max_trailer_length_ft: number | null
  parking_capacity: string | null
  parking_fee: boolean
  fee_amount: string | null
  facilities: string[]
  lat: number | null
  lng: number | null
  river_mile: number | null
  distance_to_next_access_miles: number | null
  next_access_name: string | null
  float_time_to_next: string | null
  seasonal_notes: string | null
  submitted_by: string | null
  submitted_by_name: string | null
  verification_status: 'pending' | 'verified' | 'needs_review' | 'rejected'
  helpful_count: number
  last_verified_at: string | null
  last_verified_by: string | null
  created_at: string
  updated_at: string
  confirmation_count: number
}

// Subset of fields the Q&A tab uses. Mirrors PrefetchedQAQuestion
// from lib/river-page-data.ts but redeclared here so RiverTabs can
// own its local writeable state without spreading the SSR type
// across client mutators.
//
// `contributor_count` is the server-decorated count (approved
// suggestions + helpful answers). Anonymous rows pass null and
// the renderer shows no badge.
interface QAAnswerLite {
  id: string
  display_name: string
  answer: string
  created_at: string
  helpful_count: number
  is_best_answer: boolean
  contributor_count: number | null
}
interface QAQuestionLite {
  id: string
  river_id: string
  display_name: string
  question: string
  created_at: string
  answered: boolean
  helpful_count: number
  contributor_count: number | null
  answers: QAAnswerLite[]
}

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
  // Cold water tier — message escalates with severity. When temp is
  // unknown we still warn (safer default) using the mid-tier copy.
  const f = tempC !== null ? celsiusToFahrenheit(tempC) : null
  const coldGearLine = f === null
    ? 'Cold water — dress for immersion, not air temperature'
    : f <= 40 ? 'Dangerous cold water — dress for full immersion'
    : f <= 50 ? 'Cold water immersion risk — dress for the water, not the air'
    : f <= 60 ? 'Cold water — dress for immersion, not air temperature'
    : null
  if (coldGearLine) base.splice(3, 0, coldGearLine)

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

  // Q&A state — initialized from the SSR prefetch so the tab body
  // is populated on first paint and Google indexes the actual
  // question/answer text. Mutators only need to refetch from
  // /api/qa/list after a successful submit.
  const [qa, setQa] = useState<QAQuestionLite[]>(initialData?.qa ?? [])
  const [qaModalOpen, setQaModalOpen] = useState(false)
  const [qaAskForm, setQaAskForm] = useState({ question: '', name: '', notify: false, notifyEmail: '' })
  const [qaAskSubmitting, setQaAskSubmitting] = useState(false)
  const [qaAskError, setQaAskError] = useState<string | null>(null)
  // Per-question answer composer state. Keyed by question id so
  // multiple inline composers can stay open without colliding.
  const [qaAnswerDrafts, setQaAnswerDrafts] = useState<Record<string, string>>({})
  const [qaAnswerSubmitting, setQaAnswerSubmitting] = useState<string | null>(null)
  const [qaAnswerError, setQaAnswerError] = useState<Record<string, string | null>>({})
  // Tracks which questions have their full answer list expanded.
  const [qaExpanded, setQaExpanded] = useState<Set<string>>(new Set())

  // Access points state — initialized from SSR prefetch.
  const [accessPoints, setAccessPoints] = useState<AccessPointLite[]>(
    (initialData?.accessPoints as AccessPointLite[] | undefined) ?? []
  )
  const [apModalOpen, setApModalOpen] = useState(false)
  // When set, the modal is in edit mode for the given access
  // point id. Submit dispatches to /api/access-points/edit
  // instead of /submit. Cleared when the modal closes.
  const [apEditingId, setApEditingId] = useState<string | null>(null)
  const [apReportOpen, setApReportOpen] = useState<string | null>(null) // access point id whose report form is open
  const [apBusyId, setApBusyId] = useState<string | null>(null)
  const [apHelpfulMarked, setApHelpfulMarked] = useState<Set<string>>(new Set())
  // Submission form state — see the submit modal at the bottom of
  // the Maps & Guides tab body for the field map.
  const [apForm, setApForm] = useState({
    name: '',
    description: '',
    accessType: '',
    rampSurface: '',
    trailerAccess: false,
    maxTrailerLengthFt: '',
    parkingCapacity: '',
    parkingFee: false,
    feeAmount: '',
    facilities: [] as string[],
    lat: '',
    lng: '',
    riverMile: '',
    distanceToNextAccessMiles: '',
    nextAccessName: '',
    floatTimeToNext: '',
    seasonalNotes: '',
    displayName: '',
  })
  const [apSubmitting, setApSubmitting] = useState(false)
  const [apSubmitError, setApSubmitError] = useState<string | null>(null)
  const [apReportForm, setApReportForm] = useState({ changeType: '', notes: '' })
  const [apReportSubmitting, setApReportSubmitting] = useState(false)
  // Local helpful-mark dedupe so a single click doesn't double-bump
  // when the user spam-clicks. We'd ideally enforce this in the DB,
  // but the spec calls for no-login helpful so per-client is the
  // best we can do without an audit table.
  const [qaHelpfulMarked, setQaHelpfulMarked] = useState<Set<string>>(new Set())
  const [riverMapData, setRiverMapData] = useState<{ accessPoints: AccessPoint[]; sections: RiverSection[]; riverPath: [number, number][] } | null>(null)
  const [riverMapLoading, setRiverMapLoading] = useState(false)
  const riverHasMap = hasRiverMap(river.id)

  // Auto-load river map data when the Maps & Guides tab becomes
  // active. Replaces the old "click to load" button so the map
  // starts rendering immediately when the tab is clicked. The
  // Mapbox GL JS library itself is still lazy-loaded (via
  // next/dynamic), so this doesn't add to the initial bundle.
  useEffect(() => {
    if (tab === 'Maps & Guides' && riverHasMap && !riverMapData && !riverMapLoading) {
      setRiverMapLoading(true)
      loadRiverMap(river.id)
        .then(data => { if (data) setRiverMapData(data) })
        .finally(() => setRiverMapLoading(false))
    }
  }, [tab, riverHasMap, riverMapData, riverMapLoading, river.id])
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
    // Coordinates the NWS forecast was fetched for. Used to link
    // the user out to the matching forecast.weather.gov page so
    // they can verify the data and trust the source.
    latitude?: number
    longitude?: number
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

  // Fetch the 72-hour NOAA flow forecast for everyone on the Overview tab —
  // the raw chart is part of the free tier (discovery/planning). AI
  // interpretation of the forecast stays Pro-only.
  useEffect(() => {
    if (tab === 'Overview' && !forecastData && !forecastUnavailable) {
      fetch(`/api/pro/forecast?gaugeId=${river.g}`)
        .then(r => r.json())
        .then(d => {
          if (d.forecasts?.length > 0) setForecastData(d.forecasts)
          else setForecastUnavailable(true)
        })
        .catch(() => setForecastUnavailable(true))
    }
  }, [tab, river.g, forecastData, forecastUnavailable])

  // Fetch 10-year historical flow analysis only for Pro users — this one
  // is a heavier analytical tool that stays gated.
  useEffect(() => {
    if (overviewIsPro && tab === 'Overview' && !historicalData) {
      fetch(`/api/pro/historical?gaugeId=${river.g}`)
        .then(r => r.json())
        .then(d => { if (d.weeks) setHistoricalData(d.weeks) })
        .catch(() => {})
    }
  }, [overviewIsPro, tab, river.g, historicalData])

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

  // Split outfitters by tier. Destinations render above sponsored on the
  // Overview tab (highest tier at $499/mo → top placement); they share the
  // same card layout but get a distinct "Destination Sponsor" badge.
  const destinations = outfitters.filter(o => o.tier === 'destination')
  const sponsored = outfitters.filter(o => o.tier === 'sponsored')
  const overviewTop = [...destinations, ...sponsored]
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

  // Refetch the Q&A list after a successful ask/answer/helpful so
  // the tab body reflects the new content. We hit /api/qa/list
  // (service-role) rather than refreshing the whole page so the
  // user keeps their tab + scroll position.
  async function refreshQa() {
    try {
      const res = await fetch(`/api/qa/list?riverId=${encodeURIComponent(river.id)}`)
      const data = await res.json()
      if (res.ok && Array.isArray(data.qa)) {
        setQa(data.qa as QAQuestionLite[])
      }
    } catch {
      /* swallow — next page reload will recover */
    }
  }

  // Submit a new question. Anonymous OK — display name required.
  // notify-when-answered is opt-in so we don't burn email goodwill.
  async function submitQuestion(e: React.FormEvent) {
    e.preventDefault()
    if (!qaAskForm.question.trim() || !qaAskForm.name.trim()) {
      setQaAskError('Question and display name are required.')
      return
    }
    if (qaAskForm.notify && !qaAskForm.notifyEmail.includes('@')) {
      setQaAskError('Enter a valid email or uncheck "notify me".')
      return
    }
    setQaAskSubmitting(true)
    setQaAskError(null)
    try {
      // Try to attach userId if the visitor is signed in. Optional —
      // anon submissions are allowed.
      const { data: { user } } = await supabase.auth.getUser()
      const res = await fetch('/api/qa/ask', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          riverId: river.id,
          question: qaAskForm.question,
          displayName: qaAskForm.name,
          userId: user?.id ?? null,
          notifyEmail: qaAskForm.notify ? qaAskForm.notifyEmail : null,
        }),
      })
      const data = await res.json()
      if (!res.ok) {
        setQaAskError(data.error || 'Failed to post question.')
        return
      }
      // Reset and close.
      setQaAskForm({ question: '', name: qaAskForm.name, notify: false, notifyEmail: '' })
      setQaModalOpen(false)
      await refreshQa()
    } catch {
      setQaAskError('Network error — please try again.')
    } finally {
      setQaAskSubmitting(false)
    }
  }

  // Submit an answer to an existing question. Login required.
  async function submitAnswer(questionId: string) {
    const draft = (qaAnswerDrafts[questionId] || '').trim()
    if (!draft) return
    setQaAnswerSubmitting(questionId)
    setQaAnswerError(prev => ({ ...prev, [questionId]: null }))
    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) {
        setQaAnswerError(prev => ({ ...prev, [questionId]: 'Sign in to answer.' }))
        return
      }
      const displayName =
        (user.user_metadata?.full_name as string | undefined) ||
        user.email?.split('@')[0] ||
        'Paddler'
      const res = await fetch('/api/qa/answer', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ questionId, answer: draft, displayName }),
      })
      const data = await res.json()
      if (!res.ok) {
        setQaAnswerError(prev => ({ ...prev, [questionId]: data.error || 'Failed to post answer.' }))
        return
      }
      setQaAnswerDrafts(prev => ({ ...prev, [questionId]: '' }))
      await refreshQa()
    } catch {
      setQaAnswerError(prev => ({ ...prev, [questionId]: 'Network error.' }))
    } finally {
      setQaAnswerSubmitting(null)
    }
  }

  // Mark a question or answer helpful. Optimistic local bump so
  // the user sees immediate feedback; we don't roll back on
  // network failure because the worst case is a +1 desync that
  // self-corrects on next page load.
  async function markHelpful(kind: 'question' | 'answer', id: string) {
    const key = `${kind}:${id}`
    if (qaHelpfulMarked.has(key)) return
    setQaHelpfulMarked(prev => new Set(prev).add(key))
    setQa(prev => prev.map(q => {
      if (kind === 'question' && q.id === id) {
        return { ...q, helpful_count: q.helpful_count + 1 }
      }
      if (kind === 'answer') {
        return {
          ...q,
          answers: q.answers.map(a => a.id === id ? { ...a, helpful_count: a.helpful_count + 1 } : a),
        }
      }
      return q
    }))
    try {
      await fetch('/api/qa/helpful', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ kind, id }),
      })
    } catch {
      /* see comment above — desync self-corrects */
    }
  }

  // ── Access points handlers ──────────────────────────────
  // Refresh the local access points list after any mutation.
  async function refreshAccessPoints() {
    try {
      const res = await fetch(`/api/access-points/list?riverId=${encodeURIComponent(river.id)}`)
      const data = await res.json()
      if (res.ok && Array.isArray(data.accessPoints)) {
        setAccessPoints(data.accessPoints as AccessPointLite[])
      }
    } catch { /* swallow — next page reload recovers */ }
  }

  // Open the modal in edit mode for an existing access point.
  // Pre-fills the form with the row's current values so the user
  // tweaks instead of retypes — replaces the slow Report Change
  // → admin → admin-edits cycle for users who can edit directly
  // (admins always; submitters while their row is still pending).
  function openEditForAccessPoint(ap: AccessPointLite) {
    setApEditingId(ap.id)
    setApForm({
      name: ap.name ?? '',
      description: ap.description ?? '',
      accessType: ap.access_type ?? '',
      rampSurface: ap.ramp_surface ?? '',
      trailerAccess: !!ap.trailer_access,
      maxTrailerLengthFt: ap.max_trailer_length_ft != null ? String(ap.max_trailer_length_ft) : '',
      parkingCapacity: ap.parking_capacity ?? '',
      parkingFee: !!ap.parking_fee,
      feeAmount: ap.fee_amount ?? '',
      facilities: ap.facilities ?? [],
      lat: ap.lat != null ? String(ap.lat) : '',
      lng: ap.lng != null ? String(ap.lng) : '',
      riverMile: ap.river_mile != null ? String(ap.river_mile) : '',
      distanceToNextAccessMiles: ap.distance_to_next_access_miles != null ? String(ap.distance_to_next_access_miles) : '',
      nextAccessName: ap.next_access_name ?? '',
      floatTimeToNext: ap.float_time_to_next ?? '',
      seasonalNotes: ap.seasonal_notes ?? '',
      displayName: ap.submitted_by_name ?? '',
    })
    setApSubmitError(null)
    setApModalOpen(true)
  }

  // Close the modal AND clear edit state. Use this everywhere
  // the modal closes so the next "Add access point" click
  // doesn't accidentally hit the previous edit row.
  function closeAccessPointModal() {
    setApModalOpen(false)
    setApEditingId(null)
  }

  // Submit a new access point OR save edits to an existing one.
  // Same form, different endpoint and field map.
  async function submitAccessPoint(e: React.FormEvent) {
    e.preventDefault()
    if (!apForm.name.trim()) {
      setApSubmitError('Name is required.')
      return
    }
    if (!apEditingId && !apForm.displayName.trim()) {
      // Display name is only required when creating — edits
      // don't change the original submitter's name.
      setApSubmitError('Display name is required.')
      return
    }
    setApSubmitting(true)
    setApSubmitError(null)
    try {
      let res: Response
      if (apEditingId) {
        // Edit path. Build a snake_case patch matching the
        // river_access_points columns. Empty strings become null
        // so users can clear fields they want unset.
        res = await fetch('/api/access-points/edit', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            id: apEditingId,
            patch: {
              name: apForm.name,
              description: apForm.description || null,
              access_type: apForm.accessType || null,
              ramp_surface: apForm.rampSurface || null,
              trailer_access: apForm.trailerAccess,
              max_trailer_length_ft: apForm.maxTrailerLengthFt ? Number(apForm.maxTrailerLengthFt) : null,
              parking_capacity: apForm.parkingCapacity || null,
              parking_fee: apForm.parkingFee,
              fee_amount: apForm.feeAmount || null,
              facilities: apForm.facilities,
              lat: apForm.lat ? Number(apForm.lat) : null,
              lng: apForm.lng ? Number(apForm.lng) : null,
              river_mile: apForm.riverMile ? Number(apForm.riverMile) : null,
              distance_to_next_access_miles: apForm.distanceToNextAccessMiles ? Number(apForm.distanceToNextAccessMiles) : null,
              next_access_name: apForm.nextAccessName || null,
              float_time_to_next: apForm.floatTimeToNext || null,
              seasonal_notes: apForm.seasonalNotes || null,
            },
          }),
        })
      } else {
        // Create path.
        res = await fetch('/api/access-points/submit', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            riverId: river.id,
            name: apForm.name,
            description: apForm.description || null,
            accessType: apForm.accessType || null,
            rampSurface: apForm.rampSurface || null,
            trailerAccess: apForm.trailerAccess,
            maxTrailerLengthFt: apForm.maxTrailerLengthFt ? Number(apForm.maxTrailerLengthFt) : null,
            parkingCapacity: apForm.parkingCapacity || null,
            parkingFee: apForm.parkingFee,
            feeAmount: apForm.feeAmount || null,
            facilities: apForm.facilities,
            lat: apForm.lat ? Number(apForm.lat) : null,
            lng: apForm.lng ? Number(apForm.lng) : null,
            riverMile: apForm.riverMile ? Number(apForm.riverMile) : null,
            distanceToNextAccessMiles: apForm.distanceToNextAccessMiles ? Number(apForm.distanceToNextAccessMiles) : null,
            nextAccessName: apForm.nextAccessName || null,
            floatTimeToNext: apForm.floatTimeToNext || null,
            seasonalNotes: apForm.seasonalNotes || null,
            displayName: apForm.displayName,
          }),
        })
      }
      const data = await res.json()
      if (!res.ok) {
        setApSubmitError(data.error || `Failed to ${apEditingId ? 'save' : 'submit'} access point.`)
        return
      }
      closeAccessPointModal()
      // Reset most fields but keep the display name for repeat
      // submissions in the same session.
      setApForm(f => ({
        ...f,
        name: '', description: '', accessType: '', rampSurface: '',
        trailerAccess: false, maxTrailerLengthFt: '',
        parkingCapacity: '', parkingFee: false, feeAmount: '',
        facilities: [], lat: '', lng: '', riverMile: '',
        distanceToNextAccessMiles: '', nextAccessName: '',
        floatTimeToNext: '', seasonalNotes: '',
      }))
      await refreshAccessPoints()
    } catch {
      setApSubmitError('Network error — please try again.')
    } finally {
      setApSubmitting(false)
    }
  }

  async function confirmAccessPoint(id: string) {
    setApBusyId(id)
    try {
      const res = await fetch('/api/access-points/confirm', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ accessPointId: id }),
      })
      const data = await res.json()
      if (!res.ok) {
        alert(data.error || 'Failed to confirm.')
        return
      }
      await refreshAccessPoints()
    } catch {
      /* swallow */
    } finally {
      setApBusyId(null)
    }
  }

  async function submitAccessPointReport(id: string) {
    if (!apReportForm.changeType) return
    setApReportSubmitting(true)
    try {
      const res = await fetch('/api/access-points/report-change', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          accessPointId: id,
          changeType: apReportForm.changeType,
          notes: apReportForm.notes || null,
        }),
      })
      const data = await res.json()
      if (!res.ok) {
        alert(data.error || 'Failed to report change.')
        return
      }
      setApReportOpen(null)
      setApReportForm({ changeType: '', notes: '' })
      await refreshAccessPoints()
    } catch {
      /* swallow */
    } finally {
      setApReportSubmitting(false)
    }
  }

  async function markAccessPointHelpful(id: string) {
    if (apHelpfulMarked.has(id)) return
    setApHelpfulMarked(prev => new Set(prev).add(id))
    setAccessPoints(prev => prev.map(ap =>
      ap.id === id ? { ...ap, helpful_count: ap.helpful_count + 1 } : ap
    ))
    try {
      await fetch('/api/access-points/helpful', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id }),
      })
    } catch { /* desync self-corrects on reload */ }
  }

  const gear = gearList(river.cls, flow.tempC)
  const hasHistory = river.history.length > 0
  const hasDocs = river.docs.length > 0

  return (
    // Used to be flex:1 + minHeight:0 to fit inside a 100vh-locked
    // page with the tab content scrolling internally. The page now
    // uses natural document scroll (see app/rivers/[state]/[slug]/
    // page.tsx), so this just grows to fit its content. The tab bar
    // is sticky-to-the-top instead of pinned via flex layout.
    <div style={{ display: 'flex', flexDirection: 'column' }}>
      {/* Tab bar */}
      <div style={{
        display: 'flex', borderBottom: '.5px solid var(--bd)',
        overflowX: 'auto', flexShrink: 0,
        position: 'sticky', top: 0, zIndex: 10, background: 'var(--bg)',
      }} className="no-scrollbar tab-bar">
        {TABS.filter(t => t !== 'Fishing' || hasFisheries(river.id)).map(t => (
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

      {/* Tab content — grows naturally now; no internal scroll. */}
      <div style={{ padding: '14px 16px' }}>

        {/* ── OVERVIEW ─────────────────────────────────────── */}
        {tab === 'Overview' && (
          <div>
            {/* Sponsored + Destination outfitters — above the fold */}
            {overviewTop.map(o => (
              <div key={o.id} style={{
                marginBottom: '14px', padding: '14px', borderRadius: 'var(--rlg)',
                background: o.tier === 'destination'
                  ? 'linear-gradient(135deg, #F3ECFB, #E9F1FB)'
                  : 'linear-gradient(135deg, #E6F1FB, #E1F5EE)',
                border: o.tier === 'destination' ? '1px solid #6E4BB4' : '1px solid var(--wt)',
                position: 'relative',
              }}>
                <span style={{
                  position: 'absolute', top: '8px', right: '10px',
                  fontFamily: "'IBM Plex Mono', monospace", fontSize: '8px', padding: '2px 8px',
                  borderRadius: '8px',
                  background: o.tier === 'destination' ? '#6E4BB4' : 'var(--wt)',
                  color: '#fff',
                  textTransform: 'uppercase', letterSpacing: '.5px',
                }}>{o.tier === 'destination' ? 'Destination Sponsor' : 'Sponsored'}</span>
                {o.cover_photo_url && (
                  // Banner sizing journey:
                  //   v1: height 120px + cover  → cropped wider banners
                  //   v2: aspectRatio 16/9 + cover → still cropped 4:1
                  //   v3: width 100%, height auto → too big, billboard
                  //   v4 (this): max-height cap + auto width preserves
                  //   the natural aspect ratio AND keeps the banner
                  //   from dominating the listing. Sponsored gets the
                  //   biggest cap because they paid the most.
                  <img src={o.cover_photo_url} alt={o.business_name} loading="lazy" decoding="async"
                    style={{ maxWidth: '100%', maxHeight: '160px', width: 'auto', height: 'auto', borderRadius: '6px', marginBottom: '10px', display: 'block' }} />
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

            {/* Secondary stats — a single muted line of the non-
                redundant data points the hero doesn't show. The
                hero already covers: live CFS, gauge height,
                condition badge, optimal range, water temp, and
                rate of change. Length, difficulty, and optimal are
                in the header sub-line. So only avg flow, hist
                median, and gauge ID belong down here. */}
            <div style={{
              fontFamily: "'IBM Plex Mono', monospace", fontSize: '10px',
              color: 'var(--tx3)', marginBottom: '12px',
              display: 'flex', gap: '12px', flexWrap: 'wrap',
              lineHeight: 1.5,
            }}>
              {river.avg != null && (
                <span>Avg flow: <strong style={{ color: 'var(--tx2)' }}>{river.avg.toLocaleString()} cfs</strong></span>
              )}
              {river.histFlow != null && (
                <span>Hist. median: <strong style={{ color: 'var(--tx2)' }}>{river.histFlow.toLocaleString()} cfs</strong></span>
              )}
              {river.g ? (
                river.gaugeSource === 'wsc' ? (
                  <span title="Environment Canada Water Survey">
                    🇨🇦 WSC <strong style={{ color: 'var(--tx2)' }}>#{river.g}</strong>
                  </span>
                ) : (
                  <span>USGS <strong style={{ color: 'var(--tx2)' }}>#{river.g}</strong></span>
                )
              ) : river.noGaugeAvailable ? (
                <span style={{ color: 'var(--tx3)' }}>No realtime gauge — see release schedule</span>
              ) : null}
              <GaugeSwitcher riverId={river.id} currentGaugeId={river.g} />
            </div>

            {/* Canadian beta banner — surfaces above the designation
                so the user knows flow data is via WSC and coverage is
                in beta. Only shown for rivers in the canada state block. */}
            {river.abbr === 'AB' || river.abbr === 'BC' ? (
              <div style={{
                fontFamily: "'IBM Plex Mono', monospace", fontSize: '10px',
                color: '#085041', background: '#E1F5EE',
                padding: '7px 10px', borderRadius: 'var(--r)',
                marginBottom: '10px', lineHeight: 1.5,
                border: '.5px solid #9FE1CB',
              }}>
                🇨🇦 <strong>Canadian river — beta coverage.</strong> Flow data via Environment Canada Water Survey (WSC) instead of USGS. Some features may be incomplete.
              </div>
            ) : null}

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
                    <>
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
                    {/* Source attribution — links the user out to the
                        same NWS forecast page our backend pulls from,
                        so they can verify and trust the data. */}
                    <div style={{ marginTop: '6px', fontFamily: "'IBM Plex Mono', monospace", fontSize: '8px', color: 'var(--tx3)', textAlign: 'right' }}>
                      Forecast: <a
                        href={`https://forecast.weather.gov/MapClick.php?lat=${weather.latitude ?? ''}&lon=${weather.longitude ?? ''}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        style={{ color: 'var(--rv)', textDecoration: 'underline' }}
                      >NOAA / National Weather Service &rarr;</a>
                    </div>
                    </>
                    )}
                  </div>
                )}
              </div>
            )}

            {/* Trip sections were removed in favor of the Maps &
                Guides → Access Points timeline, which is the
                canonical source for "where do I put in / take out"
                and the float segment between each pair. The legacy
                static `river.secs` array still exists in
                data/rivers.ts and the override pipeline still
                accepts updates to it (so historical approvals
                aren't broken), but nothing on the public render
                consumes it anymore. */}

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

            {/* Permit info — only renders when prefetch returned a row.
                Sits above outfitters so users see the permit-vs-commercial
                option before scrolling further. */}
            {initialData?.permit && <RiverPermits permit={initialData.permit} />}

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
                      // Featured tier — see sponsored card above for
                      // the sizing rationale. Smaller cap (110px)
                      // since featured pays less than sponsored.
                      <img src={o.cover_photo_url} alt={o.business_name} loading="lazy" decoding="async"
                        style={{ maxWidth: '100%', maxHeight: '110px', width: 'auto', height: 'auto', borderRadius: '4px', marginBottom: '8px', display: 'block' }} />
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

                {/* Listed outfitters (from Supabase) — render logo,
                    cover photo, description, phone, and website. The
                    earlier minimalist version only showed the business
                    name + website, which meant uploaded logos and
                    cover photos never appeared on the public page. */}
                {listed.map(o => {
                  // Validate the website looks like a real URL/domain
                  // before rendering it as a link. Owners sometimes
                  // enter their business name in the website field by
                  // mistake; the old code blindly prepended `https://`
                  // and produced 404s like `https://Pine River ...`.
                  // Heuristic: must contain a dot, no spaces, and at
                  // least one character on each side of a dot.
                  const websiteLooksValid = !!o.website
                    && !/\s/.test(o.website)
                    && /[a-z0-9-]+\.[a-z]{2,}/i.test(o.website)
                  const websiteHref = websiteLooksValid
                    ? (o.website!.startsWith('http') ? o.website! : `https://${o.website!}`)
                    : null

                  return (
                    <div key={o.id} style={{
                      border: '.5px solid var(--bd)', borderRadius: 'var(--r)',
                      padding: '12px', background: 'var(--bg2)', marginBottom: '8px',
                      position: 'relative',
                    }}>
                      <span style={{
                        position: 'absolute', top: '8px', right: '10px',
                        fontFamily: "'IBM Plex Mono', monospace", fontSize: '7px',
                        padding: '1px 6px', borderRadius: '5px',
                        background: 'var(--bg3, #e8e8e8)', color: 'var(--tx3)',
                        textTransform: 'uppercase', letterSpacing: '.4px',
                      }}>Listed</span>

                      {o.cover_photo_url && (
                        // Listed tier — smallest banner cap (90px).
                        // Listed is the free tier; listings should
                        // feel like listings, not advertisements.
                        // The image preserves natural aspect ratio
                        // within the cap so wide banners stay wide
                        // and 16:9 banners letterbox naturally.
                        <img src={o.cover_photo_url} alt={o.business_name} loading="lazy" decoding="async"
                          style={{ maxWidth: '100%', maxHeight: '90px', width: 'auto', height: 'auto', borderRadius: '4px', marginBottom: '8px', display: 'block' }} />
                      )}

                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px', paddingRight: '46px' }}>
                        {o.logo_url && (
                          <img src={o.logo_url} alt="" loading="lazy" decoding="async"
                            style={{ width: '32px', height: '32px', borderRadius: '4px', objectFit: 'contain', border: '.5px solid var(--bd)', flexShrink: 0 }} />
                        )}
                        <div>
                          <div style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: '12px', fontWeight: 600, color: 'var(--rvdk)' }}>{o.business_name}</div>
                          {o.phone && <div style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: '9px', color: 'var(--tx3)', marginTop: '1px' }}>{o.phone}</div>}
                        </div>
                      </div>

                      {o.description && (
                        <div style={{ fontSize: '11px', color: 'var(--tx2)', lineHeight: 1.5, marginTop: '6px', marginBottom: o.website ? '8px' : '0' }}>
                          {o.description}
                        </div>
                      )}

                      {websiteHref ? (
                        <a href={websiteHref}
                          target="_blank" rel="noopener noreferrer"
                          onClick={() => trackClick(o.id, 'outfitters_tab')}
                          style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: '10px', color: 'var(--rv)', textDecoration: 'none' }}>
                          {o.website!.replace(/^https?:\/\//, '')} &rarr;
                        </a>
                      ) : o.website ? (
                        // Owner-entered something in the website field
                        // that doesn't look like a URL — show it as
                        // plain text instead of producing a 404 link.
                        <div style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: '10px', color: 'var(--tx3)' }}>
                          {o.website}
                        </div>
                      ) : null}
                    </div>
                  )
                })}

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
            {/* 72-Hour Flow Forecast — public NOAA NWPS data, no paywall.
                Rebuilt with a real chart: condition-zone background bands
                (low/optimal/high/flood from river.opt), color-coded bars
                per condition, peak + low markers with values, hovered-bar
                callout, and a legend. AI interpretation stays Pro.
                Hidden by SHOW_NOAA_FORECAST flag — NOAA gauge mappings
                only cover a fraction of our rivers, so most pages were
                rendering "no forecast" until coverage is broader. */}
            {SHOW_NOAA_FORECAST && (
            <div style={{ marginTop: '16px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '8px' }}>
                <div style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: '9px', color: 'var(--tx3)', textTransform: 'uppercase', letterSpacing: '1px' }}>
                  72-Hour Flow Forecast
                </div>
                <span style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: '8px', color: 'var(--tx3)' }}>
                  NOAA NWPS
                </span>
              </div>
              {forecastData && forecastData.length > 0 ? (() => {
                // Parse the river's optimal range from river.opt (e.g.
                // "500–2000"). Falls back to using the current CFS as
                // a reference if parsing fails.
                const parseOpt = (s: string): [number, number] | null => {
                  const m = s.match(/(\d[\d,]*)\s*[\u2013\-]\s*(\d[\d,]*)/)
                  if (!m) return null
                  return [parseInt(m[1].replace(/,/g, ''), 10), parseInt(m[2].replace(/,/g, ''), 10)]
                }
                const optRange = parseOpt(river.opt)
                const lowCutoff = optRange?.[0] ?? 0
                const highCutoff = optRange?.[1] ?? Infinity
                const floodCutoff = highCutoff * 2.5

                const condFor = (cfs: number): 'low' | 'optimal' | 'high' | 'flood' => {
                  if (cfs < lowCutoff) return 'low'
                  if (cfs <= highCutoff) return 'optimal'
                  if (cfs < floodCutoff) return 'high'
                  return 'flood'
                }
                const condColor = (c: ReturnType<typeof condFor>): string => {
                  if (c === 'low') return 'var(--lo)'
                  if (c === 'optimal') return 'var(--rv)'
                  if (c === 'high') return 'var(--am)'
                  return 'var(--dg)'
                }
                const condLabel = (c: ReturnType<typeof condFor>): string => {
                  if (c === 'low') return 'Below optimal'
                  if (c === 'optimal') return 'Optimal'
                  if (c === 'high') return 'Above optimal'
                  return 'Flood'
                }

                // Y-axis scaling. Snap the chart top to either the
                // forecast peak or the flood cutoff, whichever is
                // smaller — keeps "normal weather" forecasts from
                // looking flat under a giant flood ceiling.
                const peakCfs = Math.max(...forecastData.map(f => f.cfs))
                const minCfs = Math.min(...forecastData.map(f => f.cfs))
                const chartTop = optRange
                  ? Math.max(peakCfs * 1.1, highCutoff * 1.15)
                  : peakCfs * 1.1
                const chartBottom = optRange
                  ? Math.min(minCfs * 0.9, lowCutoff * 0.85)
                  : 0

                // Convert a CFS value to a Y-percentage where 0% is the
                // chart bottom and 100% is the chart top.
                const pctOf = (cfs: number) => {
                  if (chartTop === chartBottom) return 50
                  return Math.max(0, Math.min(100, ((cfs - chartBottom) / (chartTop - chartBottom)) * 100))
                }

                // Find the peak and low forecast points for marker
                // labels. Find the next condition transition for the
                // "expected change" callout.
                const peakIdx = forecastData.findIndex(f => f.cfs === peakCfs)
                const minIdx = forecastData.findIndex(f => f.cfs === minCfs)
                const startCond = condFor(forecastData[0].cfs)
                let nextChangeIdx = -1
                for (let i = 1; i < forecastData.length; i++) {
                  if (condFor(forecastData[i].cfs) !== startCond) {
                    nextChangeIdx = i
                    break
                  }
                }
                const hoursFromNow = (timeStr: string) => {
                  const d = new Date(timeStr)
                  const diff = d.getTime() - Date.now()
                  const h = Math.round(diff / (1000 * 60 * 60))
                  if (h < 1) return 'now'
                  if (h < 24) return `+${h}h`
                  const days = Math.floor(h / 24)
                  const remH = h % 24
                  return remH === 0 ? `+${days}d` : `+${days}d ${remH}h`
                }

                const CHART_H = 160
                return (
                  <div style={{ border: '.5px solid var(--bd)', borderRadius: 'var(--r)', overflow: 'hidden', background: 'var(--bg)' }}>
                    {/* Header — current vs forecast peak */}
                    <div style={{ padding: '12px 14px', borderBottom: '.5px solid var(--bd)', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', gap: '12px', flexWrap: 'wrap', background: 'var(--bg2)' }}>
                      <div>
                        <div style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: '9px', color: 'var(--tx3)', marginBottom: '2px' }}>Forecast peak</div>
                        <div style={{ display: 'flex', alignItems: 'baseline', gap: '6px' }}>
                          <span style={{ fontFamily: "'Playfair Display', serif", fontSize: '22px', fontWeight: 700, color: condColor(condFor(peakCfs)) }}>
                            {peakCfs.toLocaleString()}
                          </span>
                          <span style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: '10px', color: 'var(--tx3)' }}>cfs</span>
                          <span style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: '9px', color: 'var(--tx3)' }}>
                            in {hoursFromNow(forecastData[peakIdx].time)}
                          </span>
                        </div>
                      </div>
                      <div style={{ textAlign: 'right' }}>
                        <div style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: '9px', color: 'var(--tx3)', marginBottom: '2px' }}>Forecast low</div>
                        <div style={{ display: 'flex', alignItems: 'baseline', gap: '6px', justifyContent: 'flex-end' }}>
                          <span style={{ fontFamily: "'Playfair Display', serif", fontSize: '16px', fontWeight: 600, color: condColor(condFor(minCfs)) }}>
                            {minCfs.toLocaleString()}
                          </span>
                          <span style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: '9px', color: 'var(--tx3)' }}>
                            in {hoursFromNow(forecastData[minIdx].time)}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* The chart itself. Two layers:
                          1. Background condition zones drawn as
                             absolutely-positioned colored stripes
                             across the chart height
                          2. Foreground bars positioned bottom-up
                             with color matching their predicted
                             condition */}
                    <div style={{ position: 'relative', height: `${CHART_H}px`, padding: '12px 14px 8px', background: 'var(--bg)' }}>
                      {/* Condition zone backdrop */}
                      {optRange && (
                        <div style={{ position: 'absolute', inset: '12px 14px 8px', pointerEvents: 'none' }}>
                          {/* Optimal band */}
                          <div style={{
                            position: 'absolute', left: 0, right: 0,
                            bottom: `${pctOf(lowCutoff)}%`,
                            top: `${100 - pctOf(highCutoff)}%`,
                            background: 'var(--rvlt)', opacity: 0.5,
                            borderTop: '.5px dashed var(--rvmd)',
                            borderBottom: '.5px dashed var(--rvmd)',
                          }} />
                          {/* Optimal label, top-right */}
                          <div style={{
                            position: 'absolute', right: '2px',
                            top: `${100 - pctOf(highCutoff)}%`,
                            transform: 'translateY(-100%)',
                            fontFamily: "'IBM Plex Mono', monospace", fontSize: '8px', color: 'var(--rv)',
                            padding: '0 2px',
                          }}>
                            optimal {lowCutoff.toLocaleString()}–{highCutoff.toLocaleString()}
                          </div>
                        </div>
                      )}

                      {/* Bars */}
                      <div style={{ position: 'relative', height: '100%', display: 'flex', alignItems: 'flex-end', gap: '2px', zIndex: 1 }}>
                        {forecastData.map((f, i) => {
                          const c = condFor(f.cfs)
                          const pct = pctOf(f.cfs)
                          const isPeak = i === peakIdx
                          const isMin = i === minIdx
                          return (
                            <div key={i} style={{ flex: 1, position: 'relative', height: '100%', display: 'flex', alignItems: 'flex-end', minWidth: '3px' }}>
                              <div
                                title={`${new Date(f.time).toLocaleString()}: ${f.cfs.toLocaleString()} cfs (${condLabel(c)})`}
                                style={{
                                  width: '100%',
                                  height: `${Math.max(2, pct)}%`,
                                  background: condColor(c),
                                  borderRadius: '2px 2px 0 0',
                                  border: (isPeak || isMin) ? '1px solid var(--bg)' : 'none',
                                  boxShadow: isPeak ? '0 0 0 1.5px var(--am)' : isMin ? '0 0 0 1.5px var(--lo)' : 'none',
                                }}
                              />
                            </div>
                          )
                        })}
                      </div>
                    </div>

                    {/* Time axis */}
                    <div style={{ display: 'flex', justifyContent: 'space-between', padding: '4px 16px 10px', fontFamily: "'IBM Plex Mono', monospace", fontSize: '9px', color: 'var(--tx3)' }}>
                      <span>Now</span>
                      <span>+24h</span>
                      <span>+48h</span>
                      <span>+72h</span>
                    </div>

                    {/* Condition transition callout */}
                    {nextChangeIdx > 0 && (
                      <div style={{
                        padding: '8px 14px', borderTop: '.5px solid var(--bd)',
                        background: 'var(--bg2)',
                        display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap',
                        fontFamily: "'IBM Plex Mono', monospace", fontSize: '10px', color: 'var(--tx2)',
                      }}>
                        <span style={{
                          width: 8, height: 8, borderRadius: '50%',
                          background: condColor(condFor(forecastData[nextChangeIdx].cfs)),
                          flexShrink: 0,
                        }} />
                        <span>
                          Expected to enter{' '}
                          <strong style={{ color: condColor(condFor(forecastData[nextChangeIdx].cfs)) }}>
                            {condLabel(condFor(forecastData[nextChangeIdx].cfs)).toLowerCase()}
                          </strong>
                          {' '}in{' '}
                          <strong style={{ color: 'var(--tx)' }}>{hoursFromNow(forecastData[nextChangeIdx].time)}</strong>
                          {' '}at {forecastData[nextChangeIdx].cfs.toLocaleString()} cfs
                        </span>
                      </div>
                    )}

                    {/* Legend */}
                    <div style={{ padding: '6px 14px 8px', display: 'flex', gap: '12px', flexWrap: 'wrap', fontFamily: "'IBM Plex Mono', monospace", fontSize: '8px', color: 'var(--tx3)' }}>
                      <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}><span style={{ width: 8, height: 8, background: 'var(--lo)', borderRadius: '2px' }} /> Low</span>
                      <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}><span style={{ width: 8, height: 8, background: 'var(--rv)', borderRadius: '2px' }} /> Optimal</span>
                      <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}><span style={{ width: 8, height: 8, background: 'var(--am)', borderRadius: '2px' }} /> High</span>
                      <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}><span style={{ width: 8, height: 8, background: 'var(--dg)', borderRadius: '2px' }} /> Flood</span>
                      <span style={{ marginLeft: 'auto', color: 'var(--tx3)' }}>Hover bars for time + value</span>
                    </div>

                    {/* AI interpretation upsell for free users */}
                    {SHOW_PRO_TIER && !overviewIsPro && (
                      <div style={{
                        borderTop: '.5px solid var(--bd)',
                        padding: '10px 14px', background: 'var(--bg2)',
                        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                        gap: '12px', flexWrap: 'wrap',
                      }}>
                        <span style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: '10px', color: 'var(--tx2)', lineHeight: 1.5 }}>
                          Get a plain-language forecast from our AI &mdash; Pro feature.
                        </span>
                        <a href="/pro" style={{
                          fontFamily: "'IBM Plex Mono', monospace", fontSize: '10px', fontWeight: 500,
                          padding: '5px 12px', borderRadius: 'var(--r)',
                          background: 'var(--rvdk)', color: '#fff', textDecoration: 'none',
                          flexShrink: 0,
                        }}>
                          Upgrade to Pro &rarr;
                        </a>
                      </div>
                    )}
                  </div>
                )
              })() : forecastUnavailable ? (
                <div style={{ padding: '12px', background: 'var(--bg2)', borderRadius: 'var(--r)', border: '.5px solid var(--bd)', fontFamily: "'IBM Plex Mono', monospace", fontSize: '10px', color: 'var(--tx3)', textAlign: 'center' }}>
                  Forecast temporarily unavailable
                </div>
              ) : (
                <div style={{ padding: '12px', fontFamily: "'IBM Plex Mono', monospace", fontSize: '10px', color: 'var(--tx3)', textAlign: 'center' }}>Loading forecast...</div>
              )}
            </div>
            )}

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
              ) : SHOW_PRO_TIER ? (
                <div style={{
                  padding: '14px 16px', background: 'var(--bg2)',
                  border: '.5px solid var(--bd)', borderRadius: 'var(--r)',
                  display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                  gap: '12px', flexWrap: 'wrap',
                }}>
                  <span style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: '11px', color: 'var(--tx2)', lineHeight: 1.5 }}>
                    See 10 years of flow patterns for this river &mdash; historical analysis is a Pro feature.
                  </span>
                  <a href="/pro" style={{
                    fontFamily: "'IBM Plex Mono', monospace", fontSize: '10px', fontWeight: 500,
                    padding: '6px 14px', borderRadius: 'var(--r)',
                    background: 'var(--rvdk)', color: '#fff', textDecoration: 'none',
                    flexShrink: 0,
                  }}>
                    Upgrade to Pro &rarr;
                  </a>
                </div>
              ) : null}
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
              ) : SHOW_PRO_TIER ? (
                <div style={{
                  padding: '10px 14px', background: 'var(--bg2)', border: '.5px solid var(--bd)',
                  borderRadius: 'var(--r)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '12px', flexWrap: 'wrap',
                }}>
                  <span style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: '11px', color: 'var(--tx2)', lineHeight: 1.5 }}>
                    Set your personal optimal CFS window per river &mdash; custom ranges are a Pro feature.
                  </span>
                  <a href="/pro" style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: '10px', fontWeight: 500, padding: '5px 14px', borderRadius: 'var(--r)', background: 'var(--rvdk)', color: '#fff', textDecoration: 'none', flexShrink: 0 }}>
                    Upgrade to Pro &rarr;
                  </a>
                </div>
              ) : null}
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
                River conditions are community-verified. CFS ranges, difficulty ratings, and access points may not reflect every flow level or seasonal change. Always check current conditions, scout unfamiliar rapids, and paddle within your skill level.
              </p>
            </div>

            <TabInviteBar riverName={river.n} />
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

        {/* ── Q&A ──────────────────────────────────────────────
            Community Q&A. Renders SSR off initialData.qa so Google
            indexes the actual question/answer text — each <h3>
            wraps a question for structured-content signal. Logged-in
            users can answer; anonymous visitors can ask and mark
            helpful with no friction. */}
        {tab === 'Q&A' && (
          <div>
            <div style={{
              display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between',
              gap: '12px', marginBottom: '14px', flexWrap: 'wrap',
            }}>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: '9px', color: 'var(--tx3)', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '4px' }}>
                  Local Knowledge
                </div>
                <p style={{ fontSize: '12px', color: 'var(--tx2)', lineHeight: 1.55, margin: 0 }}>
                  Ask anything a local paddler would know — access, parking, shuttle, water quality, seasonal tips. Anyone can ask, anyone can mark helpful, signed-in users can answer.
                </p>
              </div>
              <button
                type="button"
                onClick={() => setQaModalOpen(true)}
                style={{
                  fontFamily: "'IBM Plex Mono', monospace", fontSize: '10px', fontWeight: 500,
                  padding: '8px 16px', borderRadius: 'var(--r)',
                  background: 'var(--rv)', color: '#fff', border: 'none',
                  cursor: 'pointer', flexShrink: 0,
                }}
              >
                Ask a question
              </button>
            </div>

            {qa.length === 0 ? (
              <EmptyState
                icon="?"
                label="No questions yet"
                sub="Be the first to ask a local-knowledge question about this river."
              />
            ) : (
              <div>
                {qa.map(q => {
                  const topAnswer = q.answers[0] ?? null
                  const restAnswers = q.answers.slice(1)
                  const expanded = qaExpanded.has(q.id)
                  const helpfulQ = qaHelpfulMarked.has(`question:${q.id}`)
                  return (
                    <div key={q.id} style={{
                      padding: '14px 0',
                      borderBottom: '.5px solid var(--bd)',
                    }}>
                      {/* Question heading — h3 for SEO structure. */}
                      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '8px', marginBottom: '6px' }}>
                        <h3 style={{
                          fontFamily: "'Playfair Display', serif",
                          fontSize: '15px', fontWeight: 600, color: 'var(--tx)',
                          margin: 0, lineHeight: 1.4, flex: 1,
                        }}>
                          {q.question}
                        </h3>
                        {!q.answered && (
                          <span style={{
                            flexShrink: 0,
                            fontFamily: "'IBM Plex Mono', monospace", fontSize: '8px',
                            padding: '2px 7px', borderRadius: '8px',
                            background: 'var(--amlt)', color: 'var(--am)',
                            textTransform: 'uppercase', letterSpacing: '.5px', fontWeight: 600,
                          }}>Unanswered</span>
                        )}
                      </div>

                      <div style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: '9px', color: 'var(--tx3)', marginBottom: '8px', display: 'flex', gap: '10px', flexWrap: 'wrap', alignItems: 'center' }}>
                        <span style={{ display: 'inline-flex', alignItems: 'center', gap: '5px' }}>
                          Asked by {q.display_name}
                          {q.contributor_count != null && <ContributorBadge count={q.contributor_count} />}
                        </span>
                        <span>{new Date(q.created_at).toLocaleDateString()}</span>
                        <span>{q.answers.length} answer{q.answers.length === 1 ? '' : 's'}</span>
                        <button
                          type="button"
                          onClick={() => markHelpful('question', q.id)}
                          disabled={helpfulQ}
                          style={{
                            background: 'none', border: 'none',
                            fontFamily: "'IBM Plex Mono', monospace", fontSize: '9px',
                            color: helpfulQ ? 'var(--rv)' : 'var(--tx3)',
                            cursor: helpfulQ ? 'default' : 'pointer',
                            padding: 0,
                          }}
                        >
                          {helpfulQ ? '\u2713 ' : ''}Helpful ({q.helpful_count})
                        </button>
                      </div>

                      {/* Top answer inline. */}
                      {topAnswer && (
                        <div style={{
                          background: 'var(--bg2)',
                          borderLeft: topAnswer.is_best_answer ? '3px solid var(--rv)' : '2px solid var(--bd2)',
                          padding: '10px 12px', borderRadius: 'var(--r)',
                          marginBottom: '6px',
                        }}>
                          {topAnswer.is_best_answer && (
                            <div style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: '8px', color: 'var(--rv)', textTransform: 'uppercase', letterSpacing: '.5px', marginBottom: '4px', fontWeight: 600 }}>
                              ★ Best answer
                            </div>
                          )}
                          <p style={{ fontSize: '12.5px', color: 'var(--tx)', lineHeight: 1.65, margin: 0, marginBottom: '6px' }}>
                            {topAnswer.answer}
                          </p>
                          <div style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: '9px', color: 'var(--tx3)', display: 'flex', gap: '10px', flexWrap: 'wrap', alignItems: 'center' }}>
                            <span style={{ display: 'inline-flex', alignItems: 'center', gap: '5px' }}>
                              {topAnswer.display_name}
                              {topAnswer.contributor_count != null && <ContributorBadge count={topAnswer.contributor_count} />}
                            </span>
                            <span>{new Date(topAnswer.created_at).toLocaleDateString()}</span>
                            <button
                              type="button"
                              onClick={() => markHelpful('answer', topAnswer.id)}
                              disabled={qaHelpfulMarked.has(`answer:${topAnswer.id}`)}
                              style={{
                                background: 'none', border: 'none',
                                fontFamily: "'IBM Plex Mono', monospace", fontSize: '9px',
                                color: qaHelpfulMarked.has(`answer:${topAnswer.id}`) ? 'var(--rv)' : 'var(--tx3)',
                                cursor: qaHelpfulMarked.has(`answer:${topAnswer.id}`) ? 'default' : 'pointer',
                                padding: 0,
                              }}
                            >
                              {qaHelpfulMarked.has(`answer:${topAnswer.id}`) ? '\u2713 ' : ''}Helpful ({topAnswer.helpful_count})
                            </button>
                          </div>
                        </div>
                      )}

                      {/* Show-all-answers expander. */}
                      {restAnswers.length > 0 && (
                        <button
                          type="button"
                          onClick={() => setQaExpanded(prev => {
                            const next = new Set(prev)
                            if (next.has(q.id)) next.delete(q.id); else next.add(q.id)
                            return next
                          })}
                          style={{
                            background: 'none', border: 'none',
                            fontFamily: "'IBM Plex Mono', monospace", fontSize: '10px',
                            color: 'var(--rv)', cursor: 'pointer', padding: '4px 0',
                          }}
                        >
                          {expanded ? '\u25BC Hide' : `\u25B6 Show ${restAnswers.length} more answer${restAnswers.length === 1 ? '' : 's'}`}
                        </button>
                      )}
                      {expanded && restAnswers.map(a => {
                        const helpfulA = qaHelpfulMarked.has(`answer:${a.id}`)
                        return (
                          <div key={a.id} style={{
                            background: 'var(--bg2)',
                            borderLeft: a.is_best_answer ? '3px solid var(--rv)' : '2px solid var(--bd2)',
                            padding: '10px 12px', borderRadius: 'var(--r)',
                            marginTop: '6px',
                          }}>
                            {a.is_best_answer && (
                              <div style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: '8px', color: 'var(--rv)', textTransform: 'uppercase', letterSpacing: '.5px', marginBottom: '4px', fontWeight: 600 }}>
                                ★ Best answer
                              </div>
                            )}
                            <p style={{ fontSize: '12.5px', color: 'var(--tx)', lineHeight: 1.65, margin: 0, marginBottom: '6px' }}>{a.answer}</p>
                            <div style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: '9px', color: 'var(--tx3)', display: 'flex', gap: '10px', flexWrap: 'wrap', alignItems: 'center' }}>
                              <span style={{ display: 'inline-flex', alignItems: 'center', gap: '5px' }}>
                                {a.display_name}
                                {a.contributor_count != null && <ContributorBadge count={a.contributor_count} />}
                              </span>
                              <span>{new Date(a.created_at).toLocaleDateString()}</span>
                              <button
                                type="button"
                                onClick={() => markHelpful('answer', a.id)}
                                disabled={helpfulA}
                                style={{
                                  background: 'none', border: 'none',
                                  fontFamily: "'IBM Plex Mono', monospace", fontSize: '9px',
                                  color: helpfulA ? 'var(--rv)' : 'var(--tx3)',
                                  cursor: helpfulA ? 'default' : 'pointer', padding: 0,
                                }}
                              >
                                {helpfulA ? '\u2713 ' : ''}Helpful ({a.helpful_count})
                              </button>
                            </div>
                          </div>
                        )
                      })}

                      {/* Inline answer composer for unanswered
                          questions. We render it for answered ones
                          too — anyone can chip in additional context
                          — but the affordance is gentler. */}
                      <div style={{ marginTop: '8px' }}>
                        <textarea
                          value={qaAnswerDrafts[q.id] || ''}
                          onChange={e => setQaAnswerDrafts(prev => ({ ...prev, [q.id]: e.target.value }))}
                          placeholder={q.answered ? 'Add another answer…' : 'Answer this question…'}
                          rows={2}
                          style={{
                            width: '100%', boxSizing: 'border-box',
                            padding: '8px 10px',
                            fontFamily: 'Georgia, serif', fontSize: '12px',
                            border: '.5px solid var(--bd2)', borderRadius: 'var(--r)',
                            background: 'var(--bg)', color: 'var(--tx)',
                            resize: 'vertical',
                          }}
                        />
                        {qaAnswerError[q.id] && (
                          <div style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: '9px', color: 'var(--dg)', marginTop: '4px' }}>
                            {qaAnswerError[q.id]}
                          </div>
                        )}
                        {(qaAnswerDrafts[q.id] || '').trim().length > 0 && (
                          <button
                            type="button"
                            onClick={() => submitAnswer(q.id)}
                            disabled={qaAnswerSubmitting === q.id}
                            style={{
                              marginTop: '6px',
                              fontFamily: "'IBM Plex Mono', monospace", fontSize: '10px',
                              padding: '6px 14px', borderRadius: 'var(--r)',
                              background: 'var(--rv)', color: '#fff', border: 'none',
                              cursor: qaAnswerSubmitting === q.id ? 'wait' : 'pointer',
                            }}
                          >
                            {qaAnswerSubmitting === q.id ? 'Posting…' : 'Post answer'}
                          </button>
                        )}
                      </div>
                    </div>
                  )
                })}
              </div>
            )}

            {/* Ask-question modal. Inline overlay rather than a
                portal — keeps the focus management simple and the
                Q&A tab is the only mount site so we don't need to
                share it. */}
            {qaModalOpen && (
              <div
                onClick={() => setQaModalOpen(false)}
                style={{
                  position: 'fixed', inset: 0, background: 'rgba(0,0,0,.45)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  zIndex: 1000, padding: '20px',
                }}
              >
                <div
                  onClick={e => e.stopPropagation()}
                  style={{
                    background: 'var(--bg)', borderRadius: 'var(--rlg)',
                    border: '.5px solid var(--bd2)',
                    padding: '20px 22px', maxWidth: '480px', width: '100%',
                    maxHeight: '90vh', overflowY: 'auto',
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: '14px' }}>
                    <h3 style={{ fontFamily: "'Playfair Display', serif", fontSize: '17px', fontWeight: 700, color: 'var(--rvdk)', margin: 0 }}>
                      Ask the {river.n} community
                    </h3>
                    <button
                      type="button"
                      onClick={() => setQaModalOpen(false)}
                      style={{ background: 'none', border: 'none', fontSize: '18px', color: 'var(--tx3)', cursor: 'pointer', padding: 0, lineHeight: 1 }}
                      aria-label="Close"
                    >
                      ×
                    </button>
                  </div>
                  <form onSubmit={submitQuestion}>
                    <label style={{ display: 'block', marginBottom: '12px' }}>
                      <span style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: '9px', color: 'var(--tx3)', textTransform: 'uppercase', letterSpacing: '.5px', display: 'block', marginBottom: '4px' }}>
                        Your question (max 280 chars)
                      </span>
                      <textarea
                        value={qaAskForm.question}
                        onChange={e => setQaAskForm(f => ({ ...f, question: e.target.value }))}
                        placeholder="Ask something a local paddler would know — access, parking, shuttle, water quality, seasonal tips…"
                        rows={4}
                        maxLength={280}
                        required
                        style={{
                          width: '100%', boxSizing: 'border-box',
                          padding: '8px 10px',
                          fontFamily: 'Georgia, serif', fontSize: '13px',
                          border: '.5px solid var(--bd2)', borderRadius: 'var(--r)',
                          background: 'var(--bg)', color: 'var(--tx)',
                          resize: 'vertical', lineHeight: 1.55,
                        }}
                      />
                      <div style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: '9px', color: 'var(--tx3)', textAlign: 'right', marginTop: '2px' }}>
                        {qaAskForm.question.length}/280
                      </div>
                    </label>

                    <label style={{ display: 'block', marginBottom: '12px' }}>
                      <span style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: '9px', color: 'var(--tx3)', textTransform: 'uppercase', letterSpacing: '.5px', display: 'block', marginBottom: '4px' }}>
                        Display name
                      </span>
                      <input
                        type="text"
                        value={qaAskForm.name}
                        onChange={e => setQaAskForm(f => ({ ...f, name: e.target.value }))}
                        placeholder="What should we call you?"
                        required
                        style={{
                          width: '100%', boxSizing: 'border-box',
                          padding: '8px 10px',
                          fontFamily: "'IBM Plex Mono', monospace", fontSize: '12px',
                          border: '.5px solid var(--bd2)', borderRadius: 'var(--r)',
                          background: 'var(--bg)', color: 'var(--tx)',
                        }}
                      />
                    </label>

                    <label style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: qaAskForm.notify ? '8px' : '14px', cursor: 'pointer' }}>
                      <input
                        type="checkbox"
                        checked={qaAskForm.notify}
                        onChange={e => setQaAskForm(f => ({ ...f, notify: e.target.checked }))}
                        style={{ width: '14px', height: '14px', accentColor: 'var(--rv)' }}
                      />
                      <span style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: '11px', color: 'var(--tx)' }}>
                        Email me when someone answers
                      </span>
                    </label>
                    {qaAskForm.notify && (
                      <input
                        type="email"
                        value={qaAskForm.notifyEmail}
                        onChange={e => setQaAskForm(f => ({ ...f, notifyEmail: e.target.value }))}
                        placeholder="you@example.com"
                        required
                        style={{
                          width: '100%', boxSizing: 'border-box',
                          padding: '8px 10px', marginBottom: '14px',
                          fontFamily: "'IBM Plex Mono', monospace", fontSize: '12px',
                          border: '.5px solid var(--bd2)', borderRadius: 'var(--r)',
                          background: 'var(--bg)', color: 'var(--tx)',
                        }}
                      />
                    )}

                    {qaAskError && (
                      <div style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: '10px', color: 'var(--dg)', marginBottom: '8px' }}>
                        {qaAskError}
                      </div>
                    )}

                    <button
                      type="submit"
                      disabled={qaAskSubmitting}
                      style={{
                        fontFamily: "'IBM Plex Mono', monospace", fontSize: '11px',
                        padding: '9px 20px', borderRadius: 'var(--r)',
                        background: 'var(--rv)', color: '#fff', border: 'none',
                        cursor: qaAskSubmitting ? 'wait' : 'pointer',
                      }}
                    >
                      {qaAskSubmitting ? 'Posting…' : 'Post question'}
                    </button>
                  </form>
                </div>
              </div>
            )}

            <TabInviteBar riverName={river.n} />
          </div>
        )}

        {/* ── FISHING ────────────────────────────────────────── */}
        {tab === 'Fishing' && (() => {
          // Wait for the lazy fisheries dataset to finish loading.
          if (!fisheries) return (
            <div style={{ padding: '20px', textAlign: 'center', fontFamily: "'IBM Plex Mono', monospace", fontSize: '10px', color: 'var(--tx3)' }}>Loading fisheries data...</div>
          )
          // Apply any approved fisheries overrides from the
          // server-prefetched fieldOverrides payload. Currently
          // supported: `species` (JSON-encoded FishSpecies[]).
          // Future: hatches, runs, spawning — same pattern but
          // requires a per-field schema validator since they're
          // not just string lists. The render layer falls back
          // to the static fisheries entry if the override JSON
          // is malformed.
          const fishStatic = fisheries[river.id]
          let fish = fishStatic
          const speciesOverrideRaw = initialData?.fieldOverrides?.species
          if (fishStatic && speciesOverrideRaw) {
            try {
              const parsed = JSON.parse(speciesOverrideRaw)
              if (Array.isArray(parsed)) {
                fish = { ...fishStatic, species: parsed }
              }
            } catch {
              // Fall through to static
            }
          }
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
                      ) : stockingAlertEmail && SHOW_PRO_TIER ? (
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', alignItems: 'flex-start' }}>
                          <span style={{ fontFamily: mono, fontSize: '10px', color: 'var(--rvmd)', lineHeight: 1.5 }}>
                            We&apos;ll email you when water temp hits the Hex trigger &mdash; hatch alerts are a Pro feature.
                          </span>
                          <a href="/pro" style={{
                            display: 'inline-block', fontFamily: mono, fontSize: '11px', fontWeight: 500,
                            padding: '9px 20px', borderRadius: 'var(--r)',
                            background: '#fff', color: 'var(--rvdk)', textDecoration: 'none',
                            letterSpacing: '.3px',
                          }}>
                            Upgrade to Pro &rarr;
                          </a>
                        </div>
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
                              ) : stockingAlertEmail ? (
                                <button onClick={() => setHatchAlertExpanded(isExpanded ? null : h.name)} style={{
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

                          {/* Expanded alert settings — visible to everyone,
                              but the save button becomes a Pro upsell for
                              free users (hatch alert emails stay Pro). */}
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
                              {userIsPro ? (
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
                              ) : SHOW_PRO_TIER ? (
                                <div style={{
                                  padding: '10px 12px', borderRadius: 'var(--r)',
                                  background: 'var(--bg)', border: '.5px solid var(--bd)',
                                }}>
                                  <div style={{ fontFamily: mono, fontSize: '10px', color: 'var(--tx2)', lineHeight: 1.55, marginBottom: '8px' }}>
                                    We&apos;ll email you when water temp hits the trigger &mdash; hatch alerts are a Pro feature.
                                  </div>
                                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
                                    <a href="/pro" style={{
                                      fontFamily: mono, fontSize: '10px', fontWeight: 500,
                                      padding: '6px 14px', borderRadius: 'var(--r)',
                                      background: 'var(--rvdk)', color: '#fff', textDecoration: 'none',
                                    }}>
                                      Upgrade to Pro &rarr;
                                    </a>
                                    <span style={{ fontFamily: mono, fontSize: '9px', color: 'var(--tx3)' }}>
                                      $4.99/month &middot; cancel anytime
                                    </span>
                                  </div>
                                </div>
                              ) : null}
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
                  // Michigan: official DNR Fish Stocking Database dashboard
                  // (the same ArcGIS dashboard our scraper pulls from). The
                  // earlier www.michigan.gov/dnr/fishing/reports/stocking
                  // path 404'd after a state site reorg.
                  mi: 'https://midnr.maps.arcgis.com/apps/dashboards/77581b13c6984b919ab8ed927496a31f',
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

                          {stockingAlertDone ? (
                            <div style={{ textAlign: 'center', padding: '12px 0' }}>
                              <div style={{ fontSize: '20px', marginBottom: '6px' }}>&#10003;</div>
                              <div style={{ fontFamily: mono, fontSize: '11px', color: 'var(--rv)', marginBottom: '8px' }}>
                                Stocking alert set! We&apos;ll email you when this river is stocked.
                              </div>
                              <div style={{ fontFamily: mono, fontSize: '9px', color: 'var(--tx3)' }}>
                                Thanks for supporting RiverScout Pro and independent river data.
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

                              {userIsPro ? (
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
                              ) : SHOW_PRO_TIER ? (
                                <div style={{
                                  padding: '12px 14px', borderRadius: 'var(--r)',
                                  background: 'var(--bg2)', border: '.5px solid var(--bd)',
                                }}>
                                  <div style={{ fontFamily: mono, fontSize: '11px', color: 'var(--tx2)', lineHeight: 1.55, marginBottom: '10px' }}>
                                    Get an email the moment this river is stocked &mdash; stocking alerts are a Pro feature.
                                  </div>
                                  <a href="/pro" style={{
                                    display: 'block', width: '100%', textAlign: 'center',
                                    padding: '10px', fontFamily: mono, fontSize: '11px', fontWeight: 500,
                                    background: 'var(--rvdk)', color: '#fff',
                                    borderRadius: 'var(--r)', textDecoration: 'none',
                                    letterSpacing: '.3px', boxSizing: 'border-box',
                                  }}>
                                    Upgrade to Pro &rarr;
                                  </a>
                                  <div style={{ fontFamily: mono, fontSize: '9px', color: 'var(--tx3)', textAlign: 'center', marginTop: '6px' }}>
                                    $4.99/month &middot; cancel anytime
                                  </div>
                                </div>
                              ) : null}
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

              <TabInviteBar riverName={river.n} />
            </div>
          )
        })()}

        {/* ── MAPS & GUIDES ──────────────────────────────────── */}
        {tab === 'Maps & Guides' && (
          <div>
            <div style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: '9px', color: 'var(--tx3)', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '12px' }}>
              Maps & Guides for {river.n}
            </div>

            {/* Interactive River Map — auto-loads when the Maps tab
                becomes active (via the useEffect above). While
                the data is loading, a gray placeholder with a
                spinner holds the space so there's no jarring
                white flash. Mapbox GL JS itself is still lazy-
                loaded via next/dynamic. */}
            {riverHasMap && (
              <div style={{ marginBottom: '16px' }}>
                {!riverMapData ? (
                  // Placeholder: same dimensions as the rendered map
                  // (aspect ratio ~16:9 via padding hack) with a
                  // centered spinner. The background matches the
                  // Mapbox canvas background so the transition from
                  // placeholder → map is seamless.
                  <div style={{
                    width: '100%',
                    paddingBottom: '56.25%', // 16:9 aspect ratio
                    position: 'relative',
                    background: '#f0efec', // Mapbox's default canvas bg
                    borderRadius: 'var(--rlg)',
                    border: '.5px solid var(--bd)',
                    overflow: 'hidden',
                  }}>
                    <div style={{
                      position: 'absolute', inset: 0,
                      display: 'flex', flexDirection: 'column',
                      alignItems: 'center', justifyContent: 'center',
                      gap: '10px',
                    }}>
                      {/* CSS spinner — no external assets needed. The
                          keyframes are scoped inline via style tag so
                          they don't leak outside this component. */}
                      <style>{`
                        @keyframes river-map-spin {
                          to { transform: rotate(360deg); }
                        }
                      `}</style>
                      <div style={{
                        width: '24px', height: '24px',
                        border: '2.5px solid var(--bd2)',
                        borderTopColor: 'var(--rv)',
                        borderRadius: '50%',
                        animation: 'river-map-spin .8s linear infinite',
                      }} />
                      <span style={{
                        fontFamily: "'IBM Plex Mono', monospace",
                        fontSize: '10px', color: 'var(--tx3)',
                        letterSpacing: '.5px',
                      }}>
                        Loading map…
                      </span>
                    </div>
                  </div>
                ) : (
                  <RiverMap
                    riverName={river.n}
                    accessPoints={[
                      ...riverMapData.accessPoints,
                      ...(initialData?.campgrounds ?? [])
                        .filter(c => c.lat && c.lng)
                        .map(c => ({
                          name: c.name,
                          lat: c.lat,
                          lng: c.lng,
                          type: 'campsite' as const,
                          description: [
                            c.parent_name,
                            c.reservable ? 'Reservable' : null,
                            c.distance_miles != null ? `${c.distance_miles.toFixed(1)} mi from river` : null,
                          ].filter(Boolean).join(' · '),
                        })),
                    ]}
                    sections={riverMapData.sections}
                    riverPath={riverMapData.riverPath}
                  />
                )}
              </div>
            )}

            {/* ── Access Points timeline ─────────────────────────
                User-editable list of put-ins/take-outs. Sorted by
                river_mile (asc, nulls last) so the render runs
                upstream → downstream when milepost data exists,
                falling back to creation order otherwise. Float
                segment summary cards render between consecutive
                points using distance + time fields. */}
            <div style={{ marginBottom: '20px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: '12px', gap: '12px', flexWrap: 'wrap' }}>
                <div>
                  <div style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: '9px', color: 'var(--tx3)', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '4px' }}>
                    Access Points — {river.n}
                  </div>
                  <div style={{ fontSize: '11px', color: 'var(--tx2)', lineHeight: 1.55 }}>
                    Crowdsourced put-ins, take-outs, and float segments. Verified by community confirmations.
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setApModalOpen(true)}
                  style={{
                    fontFamily: "'IBM Plex Mono', monospace", fontSize: '10px', fontWeight: 500,
                    padding: '8px 16px', borderRadius: 'var(--r)',
                    background: 'var(--rv)', color: '#fff', border: 'none',
                    cursor: 'pointer', flexShrink: 0,
                  }}
                >
                  + Add access point
                </button>
              </div>

              {accessPoints.length === 0 ? (
                <div style={{
                  padding: '20px', textAlign: 'center', borderRadius: 'var(--r)',
                  background: 'var(--bg2)', border: '.5px dashed var(--bd2)',
                  fontFamily: "'IBM Plex Mono', monospace", fontSize: '11px', color: 'var(--tx3)',
                  lineHeight: 1.6,
                }}>
                  No access points yet. Be the first to add one — the put-in or take-out you launched from counts.
                </div>
              ) : (
                <div>
                  {accessPoints.map((ap, idx) => {
                    const next = idx < accessPoints.length - 1 ? accessPoints[idx + 1] : null
                    return (
                      <AccessPointRow
                        key={ap.id}
                        ap={ap}
                        next={next}
                        busy={apBusyId === ap.id}
                        helpfulMarked={apHelpfulMarked.has(ap.id)}
                        reportOpen={apReportOpen === ap.id}
                        reportForm={apReportForm}
                        reportSubmitting={apReportSubmitting}
                        onEdit={() => openEditForAccessPoint(ap)}
                        onConfirm={() => confirmAccessPoint(ap.id)}
                        onReport={() => setApReportOpen(prev => prev === ap.id ? null : ap.id)}
                        onReportFormChange={setApReportForm}
                        onSubmitReport={() => submitAccessPointReport(ap.id)}
                        onMarkHelpful={() => markAccessPointHelpful(ap.id)}
                      />
                    )
                  })}
                </div>
              )}
            </div>

            {/* Add / Edit access point modal */}
            {apModalOpen && (
              <div
                onClick={closeAccessPointModal}
                style={{
                  position: 'fixed', inset: 0, background: 'rgba(0,0,0,.45)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  zIndex: 1000, padding: '20px',
                }}
              >
                <div
                  onClick={e => e.stopPropagation()}
                  style={{
                    background: 'var(--bg)', borderRadius: 'var(--rlg)',
                    border: '.5px solid var(--bd2)',
                    padding: '20px 22px', maxWidth: '560px', width: '100%',
                    maxHeight: '90vh', overflowY: 'auto',
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: '14px' }}>
                    <h3 style={{ fontFamily: "'Playfair Display', serif", fontSize: '17px', fontWeight: 700, color: 'var(--rvdk)', margin: 0 }}>
                      {apEditingId ? `Edit access point — ${river.n}` : `Add an access point — ${river.n}`}
                    </h3>
                    <button
                      type="button"
                      onClick={closeAccessPointModal}
                      style={{ background: 'none', border: 'none', fontSize: '18px', color: 'var(--tx3)', cursor: 'pointer', padding: 0, lineHeight: 1 }}
                      aria-label="Close"
                    >
                      ×
                    </button>
                  </div>
                  <form onSubmit={submitAccessPoint}>
                    {/* Section 1 — Location */}
                    <ApSection title="Location">
                      <ApField label="Access point name *">
                        <input type="text" value={apForm.name} required maxLength={120}
                          onChange={e => setApForm(f => ({ ...f, name: e.target.value }))}
                          placeholder="e.g. Peterson Bridge"
                          style={apInputStyle} />
                      </ApField>
                      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
                        <ApField label="Latitude">
                          <input type="number" step="any" value={apForm.lat}
                            onChange={e => setApForm(f => ({ ...f, lat: e.target.value }))}
                            placeholder="44.0123" style={apInputStyle} />
                        </ApField>
                        <ApField label="Longitude">
                          <input type="number" step="any" value={apForm.lng}
                            onChange={e => setApForm(f => ({ ...f, lng: e.target.value }))}
                            placeholder="-85.7234" style={apInputStyle} />
                        </ApField>
                      </div>
                      <div style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: '9px', color: 'var(--tx3)', marginBottom: '8px', lineHeight: 1.5 }}>
                        Tip: drop a pin on Google Maps, right-click, copy coordinates. Map picker coming soon.
                      </div>
                      <ApField label="River mile (optional)">
                        <input type="number" step="any" value={apForm.riverMile}
                          onChange={e => setApForm(f => ({ ...f, riverMile: e.target.value }))}
                          placeholder="If you know it" style={apInputStyle} />
                      </ApField>
                    </ApSection>

                    {/* Section 2 — Access type */}
                    <ApSection title="Access type">
                      <ApField label="Type">
                        <select value={apForm.accessType}
                          onChange={e => setApForm(f => ({ ...f, accessType: e.target.value }))}
                          style={apInputStyle}>
                          <option value="">Select…</option>
                          <option value="boat_ramp">Boat ramp</option>
                          <option value="carry_in">Carry-in</option>
                          <option value="beach_launch">Beach launch</option>
                          <option value="dock">Dock</option>
                          <option value="steps">Steps</option>
                          <option value="primitive">Primitive</option>
                        </select>
                      </ApField>
                      <ApField label="Ramp surface">
                        <select value={apForm.rampSurface}
                          onChange={e => setApForm(f => ({ ...f, rampSurface: e.target.value }))}
                          style={apInputStyle}>
                          <option value="">Select…</option>
                          <option value="paved">Paved</option>
                          <option value="gravel">Gravel</option>
                          <option value="dirt">Dirt</option>
                          <option value="concrete">Concrete</option>
                          <option value="sand">Sand</option>
                          <option value="none">None</option>
                        </select>
                      </ApField>
                      <label style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px', cursor: 'pointer' }}>
                        <input type="checkbox" checked={apForm.trailerAccess}
                          onChange={e => setApForm(f => ({ ...f, trailerAccess: e.target.checked }))} />
                        <span style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: '11px', color: 'var(--tx)' }}>
                          Trailer access available
                        </span>
                      </label>
                      {apForm.trailerAccess && (
                        <ApField label="Maximum trailer length (ft) — optional">
                          <input type="number" value={apForm.maxTrailerLengthFt}
                            onChange={e => setApForm(f => ({ ...f, maxTrailerLengthFt: e.target.value }))}
                            placeholder="e.g. 24" style={apInputStyle} />
                        </ApField>
                      )}
                    </ApSection>

                    {/* Section 3 — Facilities */}
                    <ApSection title="Facilities">
                      <ApField label="Parking capacity">
                        <select value={apForm.parkingCapacity}
                          onChange={e => setApForm(f => ({ ...f, parkingCapacity: e.target.value }))}
                          style={apInputStyle}>
                          <option value="">Select…</option>
                          <option value="limited_under_5">Under 5 vehicles</option>
                          <option value="small_5_to_15">5–15 vehicles</option>
                          <option value="medium_15_to_30">15–30 vehicles</option>
                          <option value="large_over_30">30+ vehicles</option>
                        </select>
                      </ApField>
                      <label style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px', cursor: 'pointer' }}>
                        <input type="checkbox" checked={apForm.parkingFee}
                          onChange={e => setApForm(f => ({ ...f, parkingFee: e.target.checked }))} />
                        <span style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: '11px', color: 'var(--tx)' }}>
                          Parking fee
                        </span>
                      </label>
                      {apForm.parkingFee && (
                        <ApField label="How much?">
                          <input type="text" value={apForm.feeAmount}
                            onChange={e => setApForm(f => ({ ...f, feeAmount: e.target.value }))}
                            placeholder="e.g. $5/day" style={apInputStyle} />
                        </ApField>
                      )}
                      <div style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: '9px', color: 'var(--tx3)', marginBottom: '6px', textTransform: 'uppercase', letterSpacing: '.5px' }}>
                        Facilities (check all that apply)
                      </div>
                      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '4px 12px', marginBottom: '12px' }}>
                        {['Restroom', 'Port-a-john', 'Picnic tables', 'Fire rings', 'Camping', 'Drinking water', 'Boat blower', 'Dumpster'].map(f => (
                          <label key={f} style={{ display: 'flex', alignItems: 'center', gap: '6px', cursor: 'pointer' }}>
                            <input type="checkbox" checked={apForm.facilities.includes(f)}
                              onChange={e => setApForm(prev => ({
                                ...prev,
                                facilities: e.target.checked
                                  ? [...prev.facilities, f]
                                  : prev.facilities.filter(x => x !== f),
                              }))} />
                            <span style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: '10px', color: 'var(--tx)' }}>{f}</span>
                          </label>
                        ))}
                      </div>
                    </ApSection>

                    {/* Section 4 — Float segment */}
                    <ApSection title="Float segment to next access">
                      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
                        <ApField label="Distance (miles)">
                          <input type="number" step="any" value={apForm.distanceToNextAccessMiles}
                            onChange={e => setApForm(f => ({ ...f, distanceToNextAccessMiles: e.target.value }))}
                            placeholder="4.2" style={apInputStyle} />
                        </ApField>
                        <ApField label="Next access name">
                          <input type="text" value={apForm.nextAccessName}
                            onChange={e => setApForm(f => ({ ...f, nextAccessName: e.target.value }))}
                            placeholder="e.g. Elm Flats" style={apInputStyle} />
                        </ApField>
                      </div>
                      <ApField label="Estimated float time">
                        <input type="text" value={apForm.floatTimeToNext}
                          onChange={e => setApForm(f => ({ ...f, floatTimeToNext: e.target.value }))}
                          placeholder="e.g. about 2 hours at normal flows" style={apInputStyle} />
                      </ApField>
                    </ApSection>

                    {/* Section 5 — Local knowledge */}
                    <ApSection title="Local knowledge">
                      <ApField label="Description (max 280 chars)">
                        <textarea value={apForm.description} maxLength={280} rows={3}
                          onChange={e => setApForm(f => ({ ...f, description: e.target.value }))}
                          placeholder="What should a first-timer know? Parking tips, ramp quirks, seasonal changes, local knowledge…"
                          style={{ ...apInputStyle, resize: 'vertical', fontFamily: 'Georgia, serif', fontSize: '12px', lineHeight: 1.55 }} />
                      </ApField>
                      <ApField label="Seasonal notes (optional)">
                        <textarea value={apForm.seasonalNotes} rows={2}
                          onChange={e => setApForm(f => ({ ...f, seasonalNotes: e.target.value }))}
                          placeholder="Any seasonal closures or changes?"
                          style={{ ...apInputStyle, resize: 'vertical', fontFamily: 'Georgia, serif', fontSize: '12px', lineHeight: 1.55 }} />
                      </ApField>
                    </ApSection>

                    {/* Section 6 — Your name (only on create; edits
                        keep the original submitter's name) */}
                    {!apEditingId && (
                      <ApSection title="Your name">
                        <ApField label="Display name *">
                          <input type="text" value={apForm.displayName} required maxLength={60}
                            onChange={e => setApForm(f => ({ ...f, displayName: e.target.value }))}
                            placeholder="What should we call you?" style={apInputStyle} />
                        </ApField>
                        <div style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: '9px', color: 'var(--tx3)', lineHeight: 1.5 }}>
                          Your name appears publicly with your submission. Sign in is required so we can credit your contributor tier.
                        </div>
                      </ApSection>
                    )}

                    {apSubmitError && (
                      <div style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: '10px', color: 'var(--dg)', marginBottom: '10px' }}>
                        {apSubmitError}
                      </div>
                    )}
                    <button type="submit" disabled={apSubmitting}
                      style={{
                        width: '100%',
                        fontFamily: "'IBM Plex Mono', monospace", fontSize: '11px',
                        padding: '10px', borderRadius: 'var(--r)',
                        background: 'var(--rv)', color: '#fff', border: 'none',
                        cursor: apSubmitting ? 'wait' : 'pointer',
                      }}>
                      {apSubmitting
                        ? (apEditingId ? 'Saving…' : 'Submitting…')
                        : (apEditingId ? 'Save changes' : 'Submit access point')}
                    </button>
                  </form>
                </div>
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

            <TabInviteBar riverName={river.n} />
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

// ── Access points helpers ───────────────────────────────────

const apMono = "'IBM Plex Mono', monospace"
const apSerif = "'Playfair Display', serif"

const apInputStyle: React.CSSProperties = {
  width: '100%', boxSizing: 'border-box',
  padding: '8px 10px',
  fontFamily: apMono, fontSize: '12px',
  border: '.5px solid var(--bd2)', borderRadius: 'var(--r)',
  background: 'var(--bg)', color: 'var(--tx)',
}

function ApSection({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div style={{ marginBottom: '14px', paddingBottom: '12px', borderBottom: '.5px dashed var(--bd)' }}>
      <div style={{ fontFamily: apMono, fontSize: '9px', color: 'var(--tx3)', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '8px', fontWeight: 600 }}>
        {title}
      </div>
      {children}
    </div>
  )
}

function ApField({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label style={{ display: 'block', marginBottom: '8px' }}>
      <span style={{ fontFamily: apMono, fontSize: '9px', color: 'var(--tx3)', textTransform: 'uppercase', letterSpacing: '.5px', display: 'block', marginBottom: '4px' }}>
        {label}
      </span>
      {children}
    </label>
  )
}

// Friendly labels for the enum columns. The DB stores
// machine-friendly values; the render shows human ones.
const ACCESS_TYPE_LABELS: Record<string, string> = {
  boat_ramp: 'Boat ramp',
  carry_in: 'Carry-in',
  beach_launch: 'Beach launch',
  dock: 'Dock',
  steps: 'Steps',
  primitive: 'Primitive',
}
const RAMP_SURFACE_LABELS: Record<string, string> = {
  paved: 'Paved', gravel: 'Gravel', dirt: 'Dirt',
  concrete: 'Concrete', sand: 'Sand', none: 'None',
}
const PARKING_LABELS: Record<string, string> = {
  limited_under_5: 'Under 5 vehicles',
  small_5_to_15: '5–15 vehicles',
  medium_15_to_30: '15–30 vehicles',
  large_over_30: '30+ vehicles',
}
const CHANGE_TYPE_LABELS: Record<string, string> = {
  ramp_damaged: 'Ramp damaged',
  parking_reduced: 'Parking reduced',
  access_closed: 'Access closed',
  facilities_changed: 'Facilities changed',
  other: 'Other',
}

// Freshness indicator: green for <60d, amber for <365d, red beyond.
// Drives the user's confidence in the data and prompts re-verify.
function freshnessLabel(lastVerifiedAt: string | null): { text: string; color: string } | null {
  if (!lastVerifiedAt) return null
  const ms = Date.now() - new Date(lastVerifiedAt).getTime()
  const days = Math.floor(ms / 86_400_000)
  if (days < 7) return { text: `Verified ${days <= 1 ? 'this week' : days + ' days ago'}`, color: '#1D9E75' }
  if (days < 30) return { text: `Verified ${Math.floor(days / 7)} week${Math.floor(days / 7) === 1 ? '' : 's'} ago`, color: '#1D9E75' }
  if (days < 60) return { text: `Verified ${Math.floor(days / 30)} month${Math.floor(days / 30) === 1 ? '' : 's'} ago`, color: '#1D9E75' }
  if (days < 365) return { text: `Last verified ${Math.floor(days / 30)} months ago`, color: '#BA7517' }
  return { text: `Last verified over ${Math.floor(days / 365)} year${Math.floor(days / 365) === 1 ? '' : 's'} ago`, color: '#A32D2D' }
}

interface AccessPointRowProps {
  ap: AccessPointLite
  next: AccessPointLite | null
  busy: boolean
  helpfulMarked: boolean
  reportOpen: boolean
  reportForm: { changeType: string; notes: string }
  reportSubmitting: boolean
  // Click-to-edit. Fires when the user clicks the body of the
  // card (anywhere except an action button or the inline report
  // form). Opens the create modal in edit mode pre-filled with
  // this row's values — much faster than the report-change cycle
  // for users who can edit directly (admins always; submitters
  // while their row is still pending).
  onEdit: () => void
  onConfirm: () => void
  onReport: () => void
  onReportFormChange: (f: { changeType: string; notes: string }) => void
  onSubmitReport: () => void
  onMarkHelpful: () => void
}

function AccessPointRow({
  ap, next, busy, helpfulMarked, reportOpen, reportForm, reportSubmitting,
  onEdit, onConfirm, onReport, onReportFormChange, onSubmitReport, onMarkHelpful,
}: AccessPointRowProps) {
  // Helper that wraps an event handler so it doesn't bubble up
  // to the row's onEdit click handler. Used on every action
  // button + the inline report form so clicking those doesn't
  // accidentally open the edit modal.
  function noBubble(fn: () => void) {
    return (e: React.MouseEvent) => {
      e.stopPropagation()
      fn()
    }
  }
  // Color the timeline dot by verification state.
  const dotColor =
    ap.verification_status === 'verified' ? '#1D9E75' :
    ap.verification_status === 'needs_review' ? '#BA7517' :
    'var(--tx3)'

  const fresh = freshnessLabel(ap.last_verified_at)

  // Compute the float segment line. Prefer the explicit
  // distance/time fields the submitter provided. If only river_mile
  // is set on both this and the next point, derive distance from
  // that. Otherwise show nothing rather than fake data.
  let segmentDistance: number | null = null
  if (ap.distance_to_next_access_miles != null) {
    segmentDistance = ap.distance_to_next_access_miles
  } else if (ap.river_mile != null && next?.river_mile != null) {
    segmentDistance = Math.abs(next.river_mile - ap.river_mile)
  }

  return (
    <div style={{ position: 'relative' }}>
      {/* Vertical timeline dot + line */}
      <div style={{ display: 'flex', gap: '12px' }}>
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', flexShrink: 0, paddingTop: '4px' }}>
          <div style={{
            width: '12px', height: '12px', borderRadius: '50%',
            background: dotColor, border: '2px solid var(--bg)',
            boxShadow: '0 0 0 1px ' + dotColor,
          }} />
          {next && (
            <div style={{
              width: '2px', flex: 1, minHeight: '40px',
              background: 'var(--bd2)', marginTop: '4px',
            }} />
          )}
        </div>

        {/* Body — click anywhere on the card body (except an
            action button or the inline report form) to open the
            edit modal pre-filled with this row's values.
            Permissions are enforced server-side: admins can edit
            anything, submitters can edit their own pending rows. */}
        <div
          onClick={onEdit}
          role="button"
          tabIndex={0}
          onKeyDown={e => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); onEdit() } }}
          style={{
            flex: 1, minWidth: 0, paddingBottom: next ? '0' : '12px',
            cursor: 'pointer', borderRadius: 'var(--r)',
            transition: 'background .15s',
          }}
          onMouseEnter={e => (e.currentTarget.style.background = 'var(--bg2)')}
          onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}
        >
          {/* Heading row — name, badge */}
          <div style={{ display: 'flex', alignItems: 'baseline', gap: '8px', flexWrap: 'wrap', marginBottom: '4px' }}>
            <h3 style={{
              fontFamily: apSerif, fontSize: '15px', fontWeight: 600,
              color: 'var(--tx)', margin: 0, lineHeight: 1.3,
            }}>
              {ap.name}
            </h3>
            {ap.verification_status === 'verified' && (
              <span style={{
                fontFamily: apMono, fontSize: '8px', padding: '2px 7px', borderRadius: '8px',
                background: '#E1F5EE', color: '#1D9E75', border: '.5px solid #9FE1CB',
                textTransform: 'uppercase', letterSpacing: '.5px', fontWeight: 600,
              }}>
                ✓ Verified
              </span>
            )}
            {ap.verification_status === 'pending' && (
              <span style={{
                fontFamily: apMono, fontSize: '8px', padding: '2px 7px', borderRadius: '8px',
                background: 'var(--bg2)', color: 'var(--tx3)', border: '.5px solid var(--bd2)',
                textTransform: 'uppercase', letterSpacing: '.5px', fontWeight: 600,
              }}>
                Pending
              </span>
            )}
            {ap.verification_status === 'needs_review' && (
              <span style={{
                fontFamily: apMono, fontSize: '8px', padding: '2px 7px', borderRadius: '8px',
                background: '#FBF3E8', color: '#BA7517', border: '.5px solid #E8C54A',
                textTransform: 'uppercase', letterSpacing: '.5px', fontWeight: 600,
              }}>
                ⚠ Needs review
              </span>
            )}
          </div>

          {/* Type / surface / trailer line */}
          {(ap.access_type || ap.ramp_surface || ap.trailer_access) && (
            <div style={{ fontFamily: apMono, fontSize: '10px', color: 'var(--tx2)', marginBottom: '3px', lineHeight: 1.5 }}>
              {[
                ap.ramp_surface && RAMP_SURFACE_LABELS[ap.ramp_surface] + (ap.access_type === 'boat_ramp' ? ' ramp' : ''),
                ap.access_type && !ap.ramp_surface && ACCESS_TYPE_LABELS[ap.access_type],
                ap.trailer_access
                  ? `Trailer access${ap.max_trailer_length_ft ? ` (up to ${ap.max_trailer_length_ft}ft)` : ''}`
                  : null,
              ].filter(Boolean).join(' · ')}
            </div>
          )}

          {/* Parking + facilities line */}
          {(ap.parking_capacity || ap.facilities.length > 0) && (
            <div style={{ fontFamily: apMono, fontSize: '10px', color: 'var(--tx2)', marginBottom: '6px', lineHeight: 1.5 }}>
              {ap.parking_capacity && <>Parking: {PARKING_LABELS[ap.parking_capacity]}</>}
              {ap.parking_fee && ap.fee_amount && <> · {ap.fee_amount}</>}
              {ap.facilities.length > 0 && <> · {ap.facilities.join(', ')}</>}
            </div>
          )}

          {/* Description */}
          {ap.description && (
            <div style={{ fontSize: '12px', color: 'var(--tx)', lineHeight: 1.6, fontStyle: 'italic', marginBottom: '6px', paddingLeft: '8px', borderLeft: '2px solid var(--bd2)' }}>
              &ldquo;{ap.description}&rdquo;
            </div>
          )}

          {/* Seasonal notes */}
          {ap.seasonal_notes && (
            <div style={{ fontFamily: apMono, fontSize: '10px', color: 'var(--am)', marginBottom: '6px', lineHeight: 1.5 }}>
              ⚠ {ap.seasonal_notes}
            </div>
          )}

          {/* Submitter + freshness line */}
          <div style={{ fontFamily: apMono, fontSize: '9px', color: 'var(--tx3)', display: 'flex', gap: '10px', flexWrap: 'wrap', alignItems: 'center', marginBottom: '6px' }}>
            {ap.submitted_by_name && <span>— submitted by {ap.submitted_by_name}</span>}
            {fresh && <span style={{ color: fresh.color }}>{fresh.text}</span>}
            {ap.confirmation_count > 0 && <span>{ap.confirmation_count} confirmation{ap.confirmation_count === 1 ? '' : 's'}</span>}
          </div>

          {/* Action row. Each button uses noBubble() so clicking
              an action doesn't also fire the row's edit handler. */}
          <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap', marginBottom: '6px' }}>
            <button onClick={noBubble(onConfirm)} disabled={busy} style={apActionBtnStyle}>
              {busy ? 'Working…' : 'Mark still accurate'}
            </button>
            <button onClick={noBubble(onReport)} style={apActionBtnStyle}>
              Report change
            </button>
            <button onClick={noBubble(onMarkHelpful)} disabled={helpfulMarked} style={{ ...apActionBtnStyle, color: helpfulMarked ? 'var(--rv)' : 'var(--tx2)' }}>
              {helpfulMarked ? '✓ ' : ''}Helpful ({ap.helpful_count})
            </button>
            <span style={{
              marginLeft: 'auto',
              fontFamily: apMono, fontSize: '9px', color: 'var(--tx3)',
              padding: '4px 0',
            }}>
              click card to edit
            </span>
          </div>

          {/* Inline report-change form. The whole div stops
              propagation so typing/clicking inside it doesn't
              fire the row's edit handler. */}
          {reportOpen && (
            <div
              onClick={e => e.stopPropagation()}
              style={{ background: 'var(--bg2)', border: '.5px solid var(--bd)', borderRadius: 'var(--r)', padding: '10px 12px', marginBottom: '8px' }}
            >
              <div style={{ fontFamily: apMono, fontSize: '9px', color: 'var(--tx3)', marginBottom: '6px', textTransform: 'uppercase', letterSpacing: '.5px' }}>
                What changed?
              </div>
              <select value={reportForm.changeType}
                onChange={e => onReportFormChange({ ...reportForm, changeType: e.target.value })}
                style={{ ...apInputStyle, marginBottom: '6px' }}>
                <option value="">Select…</option>
                {Object.entries(CHANGE_TYPE_LABELS).map(([k, v]) => (
                  <option key={k} value={k}>{v}</option>
                ))}
              </select>
              <textarea value={reportForm.notes}
                onChange={e => onReportFormChange({ ...reportForm, notes: e.target.value })}
                placeholder="Anything else admins should know?"
                rows={2}
                style={{ ...apInputStyle, marginBottom: '6px', resize: 'vertical', fontFamily: 'Georgia, serif', fontSize: '12px' }} />
              <button
                onClick={noBubble(onSubmitReport)}
                disabled={reportSubmitting || !reportForm.changeType}
                style={{
                  fontFamily: apMono, fontSize: '10px', padding: '6px 12px', borderRadius: 'var(--r)',
                  background: 'var(--rv)', color: '#fff', border: 'none',
                  cursor: reportSubmitting ? 'wait' : 'pointer',
                }}>
                {reportSubmitting ? 'Submitting…' : 'Submit report'}
              </button>
            </div>
          )}

          {/* Float segment summary card to next access point. Renders
              only when we have at least a distance to show. */}
          {next && (segmentDistance != null || ap.float_time_to_next || ap.next_access_name) && (
            <div style={{
              marginTop: '10px', marginBottom: '10px', marginLeft: '0',
              padding: '10px 12px',
              background: 'var(--rvlt)', border: '.5px solid var(--rvmd)',
              borderRadius: 'var(--r)',
            }}>
              <div style={{ fontFamily: apMono, fontSize: '9px', color: 'var(--rv)', textTransform: 'uppercase', letterSpacing: '.5px', marginBottom: '4px', fontWeight: 600 }}>
                {ap.name} → {ap.next_access_name || next.name}
              </div>
              <div style={{ fontFamily: apMono, fontSize: '11px', color: 'var(--rvdk)', lineHeight: 1.55 }}>
                {segmentDistance != null && <>{segmentDistance.toFixed(1)} miles</>}
                {ap.float_time_to_next && <> · {ap.float_time_to_next}</>}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

const apActionBtnStyle: React.CSSProperties = {
  fontFamily: apMono, fontSize: '9px', padding: '4px 9px', borderRadius: 'var(--r)',
  background: 'var(--bg)', color: 'var(--tx2)', border: '.5px solid var(--bd2)',
  cursor: 'pointer',
}

// Slim invite bar at the bottom of every major tab (Overview,
// Q&A, Fishing, Maps). Makes every visitor feel personally
// invited to contribute rather than just aware that a button
// exists somewhere.
function TabInviteBar({ riverName }: { riverName: string }) {
  return (
    <div style={{
      marginTop: '20px', padding: '12px 14px',
      background: 'var(--rvlt)', border: '.5px solid var(--rvmd)',
      borderRadius: 'var(--r)',
      display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      gap: '12px', flexWrap: 'wrap',
    }}>
      <div style={{
        fontFamily: "'IBM Plex Mono', monospace", fontSize: '11px',
        color: 'var(--rvdk)', lineHeight: 1.55, flex: '1 1 250px',
      }}>
        Know the {riverName}? Your local knowledge makes this page better for every paddler, angler, and guide who comes after you.
      </div>
      <a
        href="#"
        onClick={(e) => {
          e.preventDefault()
          // Find and click the SuggestCorrection button on the page.
          // It's rendered in the contextual prompt bar above the tabs.
          const btn = document.querySelector<HTMLButtonElement>('[data-improve-river]')
          if (btn) btn.click()
        }}
        style={{
          fontFamily: "'IBM Plex Mono', monospace", fontSize: '10px',
          color: 'var(--rv)', textDecoration: 'none', fontWeight: 500,
          padding: '6px 14px', borderRadius: 'var(--r)',
          border: '.5px solid var(--rvmd)', background: 'var(--bg)',
          flexShrink: 0,
        }}
      >
        Improve This River &rarr;
      </a>
    </div>
  )
}
