import Link from 'next/link'
import { FISHERIES } from '@/data/fisheries'
import { ALL_RIVERS, getRiverPath, STATES } from '@/data/rivers'
import { fetchGaugeData, formatCfs, celsiusToFahrenheit } from '@/lib/usgs'
import { getHatchTrigger } from '@/lib/hatch-triggers'
import { evaluateHatchConditions, parseTimingString } from '@/lib/hatch-conditions'
import type { Metadata } from 'next'
import type { HatchStatus } from '@/lib/hatch-conditions'

export const revalidate = 900

export const metadata: Metadata = {
  title: 'Live Hatch Conditions — RiverScout Fly Fishing Atlas',
  description: 'Real-time hatch conditions for 78 rivers across America. Water temperature triggers, seasonal calendars, and hatch alerts for fly fishers.',
  openGraph: {
    title: 'Live Hatch Conditions — RiverScout Fly Fishing Atlas',
    description: 'Real-time hatch conditions for 78 rivers across America. Water temperature triggers, seasonal calendars, and hatch alerts for fly fishers.',
    url: 'https://riverscout.app/hatches',
    siteName: 'RiverScout',
  },
}

const mono = "'IBM Plex Mono', monospace"
const serif = "'Playfair Display', serif"

interface HatchEntry {
  riverId: string
  riverName: string
  stateName: string
  stateKey: string
  riverPath: string
  hatchName: string
  timing: string
  notes: string | null
  status: HatchStatus
  message: string
  waterTempF: number | null
  cfs: number | null
  condition: string
  daysUntilPeak: number | null
  triggerTempF: number | null
}

const STATUS_ORDER: Record<HatchStatus, number> = {
  peak: 0, active: 1, imminent: 2, approaching: 3, fading: 4, off_season: 5,
}

const STATUS_DOT: Record<HatchStatus, string> = {
  peak: 'var(--rv)', active: 'var(--rv)', imminent: 'var(--am)',
  approaching: 'var(--wt)', fading: 'var(--tx3)', off_season: 'var(--bd)',
}

const STATUS_LABEL: Record<HatchStatus, string> = {
  peak: 'Peak conditions', active: 'Active', imminent: 'Imminent',
  approaching: 'Approaching', fading: 'Fading', off_season: 'Off season',
}

export default async function HatchesPage() {
  const now = new Date()

  // Get all rivers with fisheries data
  const riverIds = Object.keys(FISHERIES)
  const riverMap = new Map(ALL_RIVERS.map(r => [r.id, r]))

  // Fetch flow data for all rivers with hatches
  const flowResults = await Promise.allSettled(
    riverIds.map(id => {
      const river = riverMap.get(id)
      if (!river) return Promise.reject('no river')
      return fetchGaugeData(river.g, river.opt).then(flow => ({ id, flow }))
    })
  )

  const flowMap = new Map<string, Awaited<ReturnType<typeof fetchGaugeData>>>()
  for (const r of flowResults) {
    if (r.status === 'fulfilled') flowMap.set(r.value.id, r.value.flow)
  }

  // Evaluate all hatches
  const entries: HatchEntry[] = []

  for (const [riverId, fishData] of Object.entries(FISHERIES)) {
    const river = riverMap.get(riverId)
    if (!river) continue
    const flow = flowMap.get(riverId)
    const tempF = flow?.tempC != null ? celsiusToFahrenheit(flow.tempC) : null

    for (const hatch of fishData.hatches) {
      const trigger = getHatchTrigger(hatch.name)
      const parsed = parseTimingString(hatch.timing)
      if (!parsed) continue

      const evaluation = evaluateHatchConditions(
        {
          riverId,
          hatchName: hatch.name,
          species: hatch.name,
          tempTriggerF: trigger?.tempMinF ?? null,
          tempTriggerMaxF: trigger?.tempMaxF ?? null,
          peakStartMonth: parsed.startMonth,
          peakStartDay: parsed.startDay,
          peakEndMonth: parsed.endMonth,
          peakEndDay: parsed.endDay,
          conditionsDescription: trigger?.description ?? '',
        },
        tempF,
        now,
      )

      // Only include non-off-season hatches (unless we want a full list)
      if (evaluation.status === 'off_season') continue

      entries.push({
        riverId,
        riverName: river.n,
        stateName: river.stateName as string,
        stateKey: river.stateKey as string,
        riverPath: getRiverPath(river),
        hatchName: hatch.name,
        timing: hatch.timing,
        notes: hatch.notes ?? null,
        status: evaluation.status,
        message: evaluation.message,
        waterTempF: tempF,
        cfs: flow?.cfs ?? null,
        condition: flow?.condition ?? 'loading',
        daysUntilPeak: evaluation.daysUntilPeak,
        triggerTempF: trigger?.tempMinF ?? null,
      })
    }
  }

  // Sort by status priority then by river name
  entries.sort((a, b) => {
    const so = STATUS_ORDER[a.status] - STATUS_ORDER[b.status]
    if (so !== 0) return so
    if (a.daysUntilPeak !== null && b.daysUntilPeak !== null) return a.daysUntilPeak - b.daysUntilPeak
    return a.riverName.localeCompare(b.riverName)
  })

  // Group by status
  const groups: Record<string, HatchEntry[]> = {}
  for (const e of entries) {
    const key = e.status === 'peak' ? 'active' : e.status // Merge peak into active
    if (!groups[key]) groups[key] = []
    groups[key].push(e)
  }

  // Collect unique states for filter display
  const stateCount = new Set(entries.map(e => e.stateKey)).size
  const totalActive = (groups['active']?.length ?? 0)
  const totalImminent = (groups['imminent']?.length ?? 0)
  const totalApproaching = (groups['approaching']?.length ?? 0)

  const GROUP_TITLES: Record<string, { label: string; color: string }> = {
    active: { label: 'Active Now', color: 'var(--rv)' },
    imminent: { label: 'Imminent (within 7 days)', color: 'var(--am)' },
    approaching: { label: 'Approaching (within 30 days)', color: 'var(--wt)' },
    fading: { label: 'Fading', color: 'var(--tx3)' },
  }

  return (
    <main style={{ minHeight: '100vh', background: 'var(--bg)', color: 'var(--tx)' }}>
      {/* Nav */}
      <nav style={{
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        padding: '0 16px', height: '44px', borderBottom: '.5px solid var(--bd)',
      }}>
        <Link href="/" style={{ fontFamily: serif, fontSize: '18px', fontWeight: 700, color: 'var(--rvdk)', letterSpacing: '-.3px', textDecoration: 'none' }}>
          River<span style={{ color: 'var(--wt)' }}>Scout</span>
        </Link>
        <div style={{ display: 'flex', gap: '6px', fontFamily: mono, fontSize: '10px' }}>
          <Link href="/" style={{ padding: '5px 10px', borderRadius: '20px', border: '.5px solid var(--bd2)', color: 'var(--tx2)', textDecoration: 'none' }}>Map</Link>
          <Link href="/search" style={{ padding: '5px 10px', borderRadius: '20px', border: '.5px solid var(--bd2)', color: 'var(--tx2)', textDecoration: 'none' }}>Search</Link>
          <span style={{ padding: '5px 10px', borderRadius: '20px', border: '.5px solid var(--rvmd)', color: 'var(--rvdk)', background: 'var(--rvlt)' }}>Hatches</span>
          <Link href="/alerts" style={{ padding: '5px 10px', borderRadius: '20px', border: '.5px solid var(--bd2)', color: 'var(--tx2)', textDecoration: 'none' }}>Alerts</Link>
        </div>
      </nav>

      {/* Header */}
      <div style={{ padding: '24px 28px 16px', maxWidth: '900px', margin: '0 auto' }}>
        <div style={{ fontFamily: mono, fontSize: '9px', color: 'var(--rv)', textTransform: 'uppercase', letterSpacing: '2px', marginBottom: '6px' }}>
          Live Fly Fishing Conditions
        </div>
        <h1 style={{ fontFamily: serif, fontSize: '26px', fontWeight: 700, color: 'var(--rvdk)', marginBottom: '8px' }}>
          Current Hatch Conditions
        </h1>
        <p style={{ fontFamily: mono, fontSize: '11px', color: 'var(--tx2)', lineHeight: 1.6, marginBottom: '12px' }}>
          Real-time hatch status across {Object.keys(FISHERIES).length} rivers in {stateCount} states. Based on live USGS water temperature and seasonal timing.
        </p>

        {/* Summary stats */}
        <div style={{ display: 'flex', gap: '16px', fontFamily: mono, fontSize: '10px', marginBottom: '16px' }}>
          {totalActive > 0 && (
            <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
              <span style={{ width: 7, height: 7, borderRadius: '50%', background: 'var(--rv)', display: 'inline-block' }} />
              <span style={{ color: 'var(--rv)' }}>{totalActive} active</span>
            </span>
          )}
          {totalImminent > 0 && (
            <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
              <span style={{ width: 7, height: 7, borderRadius: '50%', background: 'var(--am)', display: 'inline-block' }} />
              <span style={{ color: 'var(--am)' }}>{totalImminent} imminent</span>
            </span>
          )}
          {totalApproaching > 0 && (
            <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
              <span style={{ width: 7, height: 7, borderRadius: '50%', background: 'var(--wt)', display: 'inline-block' }} />
              <span style={{ color: 'var(--wt)' }}>{totalApproaching} approaching</span>
            </span>
          )}
        </div>
      </div>

      {/* Hatch list */}
      <div style={{ maxWidth: '900px', margin: '0 auto', padding: '0 28px 40px' }}>
        {entries.length === 0 && (
          <div style={{ textAlign: 'center', padding: '40px 0', fontFamily: mono, fontSize: '12px', color: 'var(--tx3)' }}>
            No active or approaching hatches right now. Check back as conditions change.
          </div>
        )}

        {(['active', 'imminent', 'approaching', 'fading'] as const).map(groupKey => {
          const group = groups[groupKey]
          if (!group || group.length === 0) return null
          const { label, color } = GROUP_TITLES[groupKey]

          return (
            <div key={groupKey} style={{ marginBottom: '24px' }}>
              <div style={{
                fontFamily: mono, fontSize: '10px', color, textTransform: 'uppercase',
                letterSpacing: '1px', marginBottom: '10px', fontWeight: 500,
                display: 'flex', alignItems: 'center', gap: '6px',
              }}>
                <span style={{ width: 8, height: 8, borderRadius: '50%', background: color, display: 'inline-block' }} />
                {label}
                <span style={{ fontWeight: 400, color: 'var(--tx3)' }}>({group.length})</span>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                {group.map((e, i) => (
                  <div key={`${e.riverId}-${e.hatchName}-${i}`} style={{
                    border: `.5px solid ${e.status === 'peak' ? 'var(--rvmd)' : 'var(--bd)'}`,
                    borderRadius: 'var(--r)', padding: '12px 14px',
                    background: e.status === 'peak' ? 'var(--rvlt)' : 'var(--bg)',
                  }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '8px' }}>
                      <div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '3px' }}>
                          <span style={{ width: 7, height: 7, borderRadius: '50%', background: STATUS_DOT[e.status], display: 'inline-block', flexShrink: 0 }} />
                          <span style={{ fontFamily: serif, fontSize: '14px', fontWeight: 600 }}>
                            {e.riverName}
                          </span>
                          <span style={{ fontFamily: mono, fontSize: '9px', color: 'var(--tx3)' }}>{String(e.stateKey).toUpperCase()}</span>
                          <span style={{ fontFamily: mono, fontSize: '10px', color: 'var(--tx3)' }}>—</span>
                          <span style={{ fontFamily: mono, fontSize: '11px', fontWeight: 500 }}>{e.hatchName}</span>
                        </div>
                        <div style={{ fontFamily: mono, fontSize: '10px', color: 'var(--tx2)', display: 'flex', gap: '10px', flexWrap: 'wrap', marginLeft: '13px' }}>
                          {e.waterTempF !== null && (
                            <span>Water: {e.waterTempF}°F{e.triggerTempF ? (e.waterTempF >= e.triggerTempF ? ' ✓' : ` (need ${e.triggerTempF}°F)`) : ''}</span>
                          )}
                          {e.cfs !== null && (
                            <span>Flow: {formatCfs(e.cfs)} cfs <span style={{ color: e.condition === 'optimal' ? 'var(--rv)' : e.condition === 'high' ? 'var(--am)' : 'var(--tx3)' }}>{e.condition}</span></span>
                          )}
                          {e.daysUntilPeak !== null && e.daysUntilPeak > 0 && (
                            <span>{e.daysUntilPeak} days until peak</span>
                          )}
                          {(e.status === 'peak' || e.status === 'active') && (
                            <span style={{ color: 'var(--rv)', fontWeight: e.status === 'peak' ? 500 : 400 }}>{STATUS_LABEL[e.status]}</span>
                          )}
                        </div>
                        {e.notes && (
                          <div style={{ fontFamily: mono, fontSize: '9px', color: 'var(--tx3)', marginLeft: '13px', marginTop: '2px', fontStyle: 'italic' }}>
                            {e.notes}
                          </div>
                        )}
                      </div>
                      <div style={{ display: 'flex', gap: '6px', flexShrink: 0 }}>
                        <Link href={e.riverPath} style={{
                          fontFamily: mono, fontSize: '9px', color: 'var(--rv)',
                          textDecoration: 'none', padding: '4px 8px',
                          border: '.5px solid var(--rvmd)', borderRadius: '4px',
                          background: 'var(--rvlt)',
                        }}>
                          View river
                        </Link>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )
        })}
      </div>
    </main>
  )
}
