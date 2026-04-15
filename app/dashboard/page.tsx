import { redirect } from 'next/navigation'
import Link from 'next/link'
import { cookies } from 'next/headers'
import { createServerClient } from '@supabase/ssr'
import { ALL_RIVERS, getRiverPath, STATES } from '@/data/rivers'
import { fetchGaugeDataBatch } from '@/lib/usgs'
import { RIVER_COORDS } from '@/data/river-coordinates'
import { STATE_MAP_CONFIG } from '@/data/state-centers'
import StateRiverMap from '@/components/maps/StateRiverMap'
import type { FlowData, FlowCondition } from '@/types'

export const dynamic = 'force-dynamic'

const COND_COLOR: Record<FlowCondition, string> = {
  optimal: '#1D9E75',
  low:     '#3F77E0',
  high:    '#BA7517',
  flood:   '#A32D2D',
  loading: '#aaa99a',
}

const COND_LABEL: Record<FlowCondition, string> = {
  optimal: 'Optimal',
  low:     'Below Optimal',
  high:    'Above Optimal',
  flood:   'Flood',
  loading: 'Loading…',
}

function timeBasedGreeting(): string {
  const h = new Date().getHours()
  if (h < 12) return 'Good morning.'
  if (h < 18) return 'Good afternoon.'
  return 'Good evening.'
}

export default async function DashboardPage() {
  // Server-side auth via the Supabase SSR helper. If we don't have a
  // session, bounce to /login.
  const cookieStore = await cookies()
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll: () => cookieStore.getAll(),
        setAll: () => { /* read-only in a server component */ },
      },
    },
  )

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login?next=/dashboard')

  // Profile + saved rivers, in parallel.
  const [profileRes, savedRes] = await Promise.all([
    supabase.from('profiles').select('home_state, weekly_digest_opted_in').eq('id', user.id).maybeSingle(),
    supabase.from('saved_rivers').select('river_id, created_at').eq('user_id', user.id).order('created_at', { ascending: false }),
  ])
  const profile = profileRes.data
  const homeState = profile?.home_state ?? null
  const savedIds: string[] = (savedRes.data ?? []).map(r => r.river_id)
  const savedRivers = savedIds
    .map(id => ALL_RIVERS.find(r => r.id === id))
    .filter((r): r is NonNullable<typeof r> => !!r)

  // Live flow data for the saved rivers in one batched USGS call.
  const flowBatch = savedRivers.length
    ? await fetchGaugeDataBatch(savedRivers.map(r => ({ gaugeId: r.g, optRange: r.opt })))
    : new Map<string, FlowData>()

  const stateInfo = homeState ? STATES[homeState] : null
  const mapConfig = homeState ? STATE_MAP_CONFIG[homeState] : null

  // Build map dots: saved rivers prominent, all other state rivers muted.
  const savedIdSet = new Set(savedIds)
  const mapDots = stateInfo && mapConfig
    ? stateInfo.rivers
        .map(r => {
          const c = RIVER_COORDS[r.id]
          if (!c) return null
          const flow = flowBatch.get(r.g)
          return {
            id: r.id, name: r.n, lat: c[0], lng: c[1],
            condition: (flow?.condition ?? 'loading') as FlowCondition,
            cfs: flow?.cfs ?? null, cls: r.cls, stateKey: homeState,
            highlighted: savedIdSet.has(r.id),
          }
        })
        .filter((d): d is NonNullable<typeof d> => !!d)
    : []

  const optimalCount = savedRivers.filter(r => flowBatch.get(r.g)?.condition === 'optimal').length

  // Greeting line — keep simple. Hazard / weather logic deferred.
  const greetingPrefix = timeBasedGreeting()
  const greeting = savedRivers.length === 0
    ? `${greetingPrefix} Welcome to your dashboard.`
    : optimalCount > 0
      ? `${greetingPrefix} ${optimalCount} of your rivers ${optimalCount === 1 ? 'is' : 'are'} at optimal flow right now.`
      : `${greetingPrefix} Conditions across your saved rivers are below.`

  return (
    <main style={{ minHeight: '100vh', background: 'var(--bg)', color: 'var(--tx)' }}>
      <div style={{ padding: '20px 24px', borderBottom: '.5px solid var(--bd)', background: 'var(--wtlt)' }}>
        <h1 style={{ fontFamily: "'Playfair Display', serif", fontSize: '22px', margin: '0 0 4px', color: '#042C53' }}>
          Your dashboard
        </h1>
        <div style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: '12px', color: 'var(--tx2)' }}>
          {greeting}
        </div>
      </div>

      <div className="dashboard-grid">
        {/* Left — state map */}
        <div className="dashboard-map">
          {mapConfig && stateInfo ? (
            <>
              <StateRiverMap
                rivers={mapDots.map(d => ({ ...d, highlighted: undefined }))}
                stateName={stateInfo.name}
                stateCenter={mapConfig.center}
                stateZoom={mapConfig.zoom}
              />
              <div style={{ padding: '8px 14px', fontFamily: "'IBM Plex Mono', monospace", fontSize: '11px', color: 'var(--tx3)' }}>
                <Link href={`/state/${homeState}`} style={{ color: 'var(--rvdk)' }}>Explore {stateInfo.name} rivers →</Link>
              </div>
            </>
          ) : savedRivers.length === 0 ? (
            <EmptyState
              title="Welcome — let's set up your dashboard."
              body="Start by saving your home state and a few rivers."
              cta={<Link href="/" style={{ color: 'var(--rvdk)', textDecoration: 'underline' }}>Run the onboarding →</Link>}
            />
          ) : (
            <EmptyState
              title="Add your home state to see a conditions map"
              body="Visit your account settings to choose a home state."
              cta={<Link href="/account" style={{ color: 'var(--rvdk)', textDecoration: 'underline' }}>Account →</Link>}
            />
          )}
        </div>

        {/* Right — saved river cards */}
        <div className="dashboard-cards">
          {savedRivers.length === 0 ? (
            <EmptyState
              title="No saved rivers yet"
              body="Save rivers from any river page and they'll appear here with live conditions."
              cta={<Link href="/rivers" style={{ color: 'var(--rvdk)', textDecoration: 'underline' }}>Browse all rivers →</Link>}
            />
          ) : savedRivers.map(r => {
            const flow = flowBatch.get(r.g)
            const cond = (flow?.condition ?? 'loading') as FlowCondition
            const tempF = flow?.tempC != null ? Math.round(flow.tempC * 9 / 5 + 32) : null
            return (
              <div key={r.id} style={{
                border: '.5px solid var(--bd)', borderRadius: 'var(--r)',
                background: 'var(--bg)', padding: '14px 16px', marginBottom: '10px',
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '12px', flexWrap: 'wrap' }}>
                  <div>
                    <div style={{ fontFamily: "'Playfair Display', serif", fontSize: '17px', fontWeight: 600, color: '#042C53' }}>
                      <Link href={getRiverPath(r)} style={{ color: 'inherit', textDecoration: 'none' }}>{r.n}</Link>
                    </div>
                    <div style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: '10px', color: 'var(--tx3)', marginTop: '2px' }}>
                      {STATES[r.stateKey]?.name ?? r.abbr}{r.cls && ' · Class ' + r.cls}
                    </div>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <div style={{ fontFamily: "'Playfair Display', serif", fontSize: '26px', fontWeight: 700, color: '#0C447C', lineHeight: 1 }}>
                      {flow?.cfs != null ? flow.cfs.toLocaleString() : '—'}
                    </div>
                    <div style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: '10px', color: 'var(--wt)' }}>cfs</div>
                  </div>
                </div>

                <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', marginTop: '8px', alignItems: 'center', fontFamily: "'IBM Plex Mono', monospace", fontSize: '10px' }}>
                  <span style={{
                    padding: '2px 10px', borderRadius: '12px', fontWeight: 600,
                    background: COND_COLOR[cond] + '22', color: COND_COLOR[cond],
                    border: '.5px solid ' + COND_COLOR[cond] + '88',
                  }}>{COND_LABEL[cond]}</span>
                  {flow?.rateLabel && flow.rateLabel !== 'Rate unknown' && (
                    <span style={{ color: 'var(--tx2)' }}>
                      {flow.trend === 'up' ? '↑' : flow.trend === 'down' ? '↓' : '→'} {flow.rateLabel}
                    </span>
                  )}
                  {tempF != null && (
                    <span style={{ color: tempF < 50 ? 'var(--dg)' : 'var(--tx2)' }}>
                      {tempF}°F{tempF < 50 && ' · hypothermia risk'}
                    </span>
                  )}
                  {flow?.fetchedAt && (
                    <span style={{ color: 'var(--tx3)', marginLeft: 'auto' }}>
                      Updated {new Date(flow.fetchedAt).toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' })}
                    </span>
                  )}
                </div>

                <div style={{ display: 'flex', gap: '8px', marginTop: '10px' }}>
                  <Link href={getRiverPath(r)} style={{
                    fontFamily: "'IBM Plex Mono', monospace", fontSize: '10px',
                    background: 'var(--rvlt)', color: 'var(--rvdk)',
                    border: '.5px solid var(--rvmd)',
                    padding: '5px 12px', borderRadius: '12px', textDecoration: 'none',
                  }}>View full page</Link>
                  <Link href={`/rivers/${r.stateKey}/${r.id}#alerts`} style={{
                    fontFamily: "'IBM Plex Mono', monospace", fontSize: '10px',
                    background: 'transparent', color: 'var(--tx2)',
                    border: '.5px solid var(--bd)',
                    padding: '5px 12px', borderRadius: '12px', textDecoration: 'none',
                  }}>Set alert</Link>
                </div>
              </div>
            )
          })}
        </div>
      </div>

      <style>{`
        .dashboard-grid {
          display: grid; grid-template-columns: 1fr 460px; gap: 20px;
          padding: 20px 24px; min-height: calc(100vh - 88px);
        }
        .dashboard-map { position: relative; min-height: 500px; }
        .dashboard-cards { overflow-y: auto; max-height: calc(100vh - 130px); }
        @media (max-width: 900px) {
          .dashboard-grid { grid-template-columns: 1fr; }
          .dashboard-map { min-height: 320px; }
          .dashboard-cards { max-height: none; }
        }
      `}</style>
    </main>
  )
}

function EmptyState({ title, body, cta }: { title: string; body: string; cta: React.ReactNode }) {
  return (
    <div style={{
      padding: '40px 20px', textAlign: 'center',
      border: '.5px dashed var(--bd)', borderRadius: 'var(--r)',
      background: 'var(--bg2)',
    }}>
      <div style={{ fontFamily: "'Playfair Display', serif", fontSize: '17px', color: '#042C53', marginBottom: '6px' }}>{title}</div>
      <div style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: '11px', color: 'var(--tx3)', marginBottom: '14px', lineHeight: 1.5 }}>{body}</div>
      <div>{cta}</div>
    </div>
  )
}
