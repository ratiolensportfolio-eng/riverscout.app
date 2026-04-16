import Link from 'next/link'
import { createClient } from '@supabase/supabase-js'
import { ALL_RIVERS, STATES } from '@/data/rivers'
import { LEADERBOARD_SPECIES, type LeaderboardSpecies } from '@/types'

// Public leaderboard. No auth required to view; submissions are
// auth-gated and AI-verified before landing here.
//
// Three sections:
//   1. Top paddlers — ranked by total_verified_trips, with their
//      most-paddled river derived from trip_reports aggregation.
//   2. Top contributors by river — whichever paddler has the most
//      verified trips on each individual river (showing the top
//      8 rivers by contribution volume so the page stays compact).
//   3. Top catches per species — with photo thumbnails. Species
//      tabs use a `?species=` URL param so each tab is shareable
//      and the server can render only the selected slice.

export const revalidate = 300  // 5 min — verified data doesn't change fast

const mono = "'IBM Plex Mono', monospace"
const serif = "'Playfair Display', serif"

interface Props {
  searchParams: Promise<{ species?: string }>
}

interface PaddlerRow {
  id: string
  display_name: string | null
  username: string | null
  home_state: string | null
  total_verified_trips: number
  total_verified_catches: number
  contribution_score: number
}

interface TripRow {
  user_id: string
  river_id: string
}

interface CatchRow {
  id: string
  user_id: string | null
  river_id: string
  catch_date: string
  species: string
  weight_lbs: number | null
  length_inches: number | null
  photo_url: string | null
}

function client() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL
  // Anon key is enough — RLS is already set to public-read for
  // verified rows. Service role would skip RLS; we want RLS on.
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  if (!url || !key) return null
  return createClient(url, key, { auth: { persistSession: false } })
}

function slugifySpecies(s: string): string {
  return s.toLowerCase().replace(/\s+/g, '-')
}
function unslugifySpecies(slug: string): LeaderboardSpecies | null {
  const match = LEADERBOARD_SPECIES.find(s => slugifySpecies(s) === slug)
  return match ?? null
}

export default async function LeaderboardPage({ searchParams }: Props) {
  const sp = await searchParams
  const activeSpecies = sp.species ? unslugifySpecies(sp.species) : null
  const species: LeaderboardSpecies = activeSpecies ?? LEADERBOARD_SPECIES[0]

  const supabase = client()
  if (!supabase) {
    return (
      <main style={{ padding: '40px', fontFamily: mono, color: 'var(--tx2)' }}>
        Leaderboard unavailable — server misconfigured.
      </main>
    )
  }

  // Pull everything we need in parallel. The paddlers list and the
  // trip aggregation are capped at reasonable sizes — there's no
  // point ranking past the top 50 paddlers on the leaderboard MVP.
  const [paddlersRes, tripsRes, catchesRes, profilesRes] = await Promise.all([
    supabase
      .from('user_profiles')
      .select('id, display_name, home_state, total_verified_trips, total_verified_catches, contribution_score')
      .gt('total_verified_trips', 0)
      .order('total_verified_trips', { ascending: false })
      .limit(50),
    supabase
      .from('trip_reports')
      .select('user_id, river_id')
      .eq('status', 'verified')
      .not('user_id', 'is', null)
      .limit(2000),
    supabase
      .from('fish_catches')
      .select('id, user_id, river_id, catch_date, species, weight_lbs, length_inches, photo_url')
      .eq('verification_status', 'verified')
      .eq('species', species)
      .order('weight_lbs', { ascending: false, nullsFirst: false })
      .limit(10),
    // Usernames live on the separate `profiles` table (see mig 023).
    supabase.from('profiles').select('id, username'),
  ])

  const paddlers = (paddlersRes.data ?? []) as PaddlerRow[]
  const trips = (tripsRes.data ?? []) as TripRow[]
  const catches = (catchesRes.data ?? []) as CatchRow[]
  const usernameById = new Map<string, string>(
    (profilesRes.data ?? []).map(p => [p.id as string, p.username as string]),
  )
  // Backfill usernames into the paddler list.
  for (const p of paddlers) p.username = usernameById.get(p.id) ?? null

  // ── Aggregate: most-paddled river per user ──────────────────────
  // (userId → riverId → count), then pick the top river per user.
  const userRiverCounts = new Map<string, Map<string, number>>()
  for (const t of trips) {
    if (!t.user_id) continue
    const inner = userRiverCounts.get(t.user_id) ?? new Map<string, number>()
    inner.set(t.river_id, (inner.get(t.river_id) ?? 0) + 1)
    userRiverCounts.set(t.user_id, inner)
  }
  const mostPaddledByUser = new Map<string, string>()
  for (const [uid, inner] of userRiverCounts) {
    let best: string | null = null
    let bestCount = 0
    for (const [rid, count] of inner) {
      if (count > bestCount) { best = rid; bestCount = count }
    }
    if (best) mostPaddledByUser.set(uid, best)
  }

  // ── Aggregate: top contributor per river ─────────────────────────
  // (riverId → userId → count). Then for each river, find the user
  // with the most trips; sort rivers by that leader's contribution.
  const riverUserCounts = new Map<string, Map<string, number>>()
  for (const t of trips) {
    if (!t.user_id) continue
    const inner = riverUserCounts.get(t.river_id) ?? new Map<string, number>()
    inner.set(t.user_id, (inner.get(t.user_id) ?? 0) + 1)
    riverUserCounts.set(t.river_id, inner)
  }
  const riverLeaders: Array<{ riverId: string; userId: string; count: number }> = []
  for (const [rid, inner] of riverUserCounts) {
    let best: string | null = null
    let bestCount = 0
    for (const [uid, count] of inner) {
      if (count > bestCount) { best = uid; bestCount = count }
    }
    if (best) riverLeaders.push({ riverId: rid, userId: best, count: bestCount })
  }
  riverLeaders.sort((a, b) => b.count - a.count)
  const topRivers = riverLeaders.slice(0, 8)

  // Hydrate paddler display names for the per-river table.
  const paddlerById = new Map<string, PaddlerRow>(paddlers.map(p => [p.id, p]))

  return (
    <main style={{ minHeight: '100vh', background: 'var(--bg)', color: 'var(--tx)', padding: '20px 24px' }}>
      <div style={{ maxWidth: '1100px', margin: '0 auto' }}>
        <header style={{ marginBottom: '30px' }}>
          <h1 style={{ fontFamily: serif, fontSize: '28px', margin: '0 0 4px', color: '#042C53' }}>Leaderboard</h1>
          <div style={{ fontFamily: mono, fontSize: '11px', color: 'var(--tx3)' }}>
            Top paddlers, most active river contributors, and biggest verified catches.{' '}
            <Link href="/login?redirect=/" style={{ color: 'var(--rvdk)' }}>Sign in to log yours →</Link>
          </div>
        </header>

        {/* ── Section 1: Top paddlers ───────────────────────────── */}
        <section style={{ marginBottom: '34px' }}>
          <h2 style={sectionTitle}>Top paddlers</h2>
          {paddlers.length === 0 ? (
            <EmptyRow text="No verified trips yet. Be the first to log one on any river page." />
          ) : (
            <Table columns={['#', 'Paddler', 'Verified trips', 'Home state', 'Most paddled']}>
              {paddlers.slice(0, 20).map((p, i) => {
                const riverId = mostPaddledByUser.get(p.id)
                const river = riverId ? ALL_RIVERS.find(r => r.id === riverId) : null
                return (
                  <tr key={p.id}>
                    <Td><span style={{ fontFamily: mono, color: 'var(--tx3)' }}>{i + 1}</span></Td>
                    <Td>
                      {p.username ? (
                        <Link href={`/profile/${p.username}`} style={{ color: 'var(--rvdk)', textDecoration: 'none', fontWeight: 600 }}>
                          {p.display_name || p.username}
                        </Link>
                      ) : (
                        <span>{p.display_name || 'paddler'}</span>
                      )}
                    </Td>
                    <Td mono>{p.total_verified_trips}</Td>
                    <Td mono>{p.home_state ? (STATES[p.home_state]?.name ?? p.home_state) : '—'}</Td>
                    <Td>
                      {river ? (
                        <Link href={`/rivers/${river.stateKey}/${river.id}`} style={{ color: 'var(--tx2)', textDecoration: 'none' }}>
                          {river.n}
                        </Link>
                      ) : '—'}
                    </Td>
                  </tr>
                )
              })}
            </Table>
          )}
        </section>

        {/* ── Section 2: Top contributor per river ─────────────── */}
        <section style={{ marginBottom: '34px' }}>
          <h2 style={sectionTitle}>Most active contributors by river</h2>
          {topRivers.length === 0 ? (
            <EmptyRow text="No river leaders yet." />
          ) : (
            <Table columns={['River', 'Top contributor', 'Verified trips']}>
              {topRivers.map(({ riverId, userId, count }) => {
                const river = ALL_RIVERS.find(r => r.id === riverId)
                const paddler = paddlerById.get(userId)
                return (
                  <tr key={riverId}>
                    <Td>
                      {river ? (
                        <Link href={`/rivers/${river.stateKey}/${river.id}`} style={{ color: 'var(--rvdk)', textDecoration: 'none', fontWeight: 600 }}>
                          {river.n}
                        </Link>
                      ) : riverId}
                    </Td>
                    <Td>
                      {paddler?.username ? (
                        <Link href={`/profile/${paddler.username}`} style={{ color: 'var(--rvdk)', textDecoration: 'none' }}>
                          {paddler.display_name || paddler.username}
                        </Link>
                      ) : (
                        <span>{paddler?.display_name || 'paddler'}</span>
                      )}
                    </Td>
                    <Td mono>{count}</Td>
                  </tr>
                )
              })}
            </Table>
          )}
        </section>

        {/* ── Section 3: Top catches by species (tabs) ─────────── */}
        <section>
          <h2 style={sectionTitle}>Top catches by species</h2>

          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', marginBottom: '14px' }}>
            {LEADERBOARD_SPECIES.map(s => {
              const slug = slugifySpecies(s)
              const active = s === species
              return (
                <Link
                  key={s}
                  href={`/leaderboard?species=${slug}`}
                  style={{
                    fontFamily: mono, fontSize: '11px',
                    padding: '6px 12px', borderRadius: '14px',
                    background: active ? 'var(--rvdk)' : 'var(--bg2)',
                    color: active ? '#fff' : 'var(--tx2)',
                    border: '.5px solid ' + (active ? 'var(--rvdk)' : 'var(--bd)'),
                    textDecoration: 'none', whiteSpace: 'nowrap',
                  }}
                >{s}</Link>
              )
            })}
          </div>

          {catches.length === 0 ? (
            <EmptyRow text={`No verified ${species} catches yet.`} />
          ) : (
            <Table columns={['#', 'Photo', 'Angler', 'Weight', 'River', 'Date']}>
              {catches.map((c, i) => {
                const river = ALL_RIVERS.find(r => r.id === c.river_id)
                const paddler = c.user_id ? paddlerById.get(c.user_id) : null
                const username = c.user_id ? usernameById.get(c.user_id) : null
                return (
                  <tr key={c.id}>
                    <Td><span style={{ fontFamily: mono, color: 'var(--tx3)' }}>{i + 1}</span></Td>
                    <Td>
                      {c.photo_url ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img
                          src={c.photo_url} alt={`${c.species} catch`}
                          style={{ width: '60px', height: '60px', objectFit: 'cover', borderRadius: 'var(--r)', border: '.5px solid var(--bd)' }}
                        />
                      ) : <span style={{ fontFamily: mono, color: 'var(--tx3)' }}>—</span>}
                    </Td>
                    <Td>
                      {username ? (
                        <Link href={`/profile/${username}`} style={{ color: 'var(--rvdk)', textDecoration: 'none', fontWeight: 600 }}>
                          {paddler?.display_name || username}
                        </Link>
                      ) : (
                        <span>{paddler?.display_name || 'angler'}</span>
                      )}
                    </Td>
                    <Td mono>{c.weight_lbs != null ? `${c.weight_lbs} lb` : '—'}</Td>
                    <Td>
                      {river ? (
                        <Link href={`/rivers/${river.stateKey}/${river.id}`} style={{ color: 'var(--tx2)', textDecoration: 'none' }}>
                          {river.n}
                        </Link>
                      ) : c.river_id}
                    </Td>
                    <Td mono>{new Date(c.catch_date + 'T00:00:00').toLocaleDateString()}</Td>
                  </tr>
                )
              })}
            </Table>
          )}
        </section>
      </div>
    </main>
  )
}

const sectionTitle: React.CSSProperties = {
  fontFamily: serif, fontSize: '18px', fontWeight: 700,
  color: '#042C53', margin: '0 0 12px',
}

function Table({ columns, children }: { columns: string[]; children: React.ReactNode }) {
  return (
    <div style={{ border: '.5px solid var(--bd)', borderRadius: 'var(--r)', overflow: 'hidden', background: 'var(--bg)' }}>
      <table style={{ width: '100%', borderCollapse: 'collapse' }}>
        <thead>
          <tr>
            {columns.map((c, i) => (
              <th
                key={i}
                style={{
                  textAlign: 'left', padding: '10px 14px',
                  fontFamily: mono, fontSize: '10px', fontWeight: 500,
                  color: 'var(--tx3)', textTransform: 'uppercase', letterSpacing: '.3px',
                  borderBottom: '.5px solid var(--bd)', background: 'var(--bg2)',
                }}
              >{c}</th>
            ))}
          </tr>
        </thead>
        <tbody>{children}</tbody>
      </table>
    </div>
  )
}

function Td({ children, mono: isMono }: { children: React.ReactNode; mono?: boolean }) {
  return (
    <td
      style={{
        padding: '10px 14px',
        fontFamily: isMono ? mono : 'inherit',
        fontSize: isMono ? '12px' : '13px',
        color: 'var(--tx)',
        borderBottom: '.5px solid var(--bd)',
      }}
    >{children}</td>
  )
}

function EmptyRow({ text }: { text: string }) {
  return (
    <div style={{
      padding: '20px 14px', fontFamily: mono, fontSize: '11px', color: 'var(--tx3)',
      border: '.5px dashed var(--bd)', borderRadius: 'var(--r)', background: 'var(--bg2)',
      textAlign: 'center',
    }}>{text}</div>
  )
}
