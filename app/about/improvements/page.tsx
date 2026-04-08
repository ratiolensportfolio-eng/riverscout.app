import Link from 'next/link'
import { createSupabaseClient } from '@/lib/supabase'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Community Improvements — RiverScout',
  description: 'See how the RiverScout community keeps river data accurate for paddlers and anglers across America.',
  openGraph: {
    title: 'Community Improvements — RiverScout',
    description: 'See how the RiverScout community keeps river data accurate for paddlers and anglers across America.',
    url: 'https://riverscout.app/about/improvements',
    siteName: 'RiverScout',
    type: 'website',
  },
}

export const revalidate = 300 // 5 min cache

const mono = "'IBM Plex Mono', monospace"
const serif = "'Playfair Display', serif"

const fieldLabels: Record<string, string> = {
  cls: 'Whitewater Class',
  opt: 'Optimal CFS Range',
  len: 'River Length',
  desc: 'Description',
  desig: 'Designations',
  species: 'Fish Species',
  hatches: 'Hatch Calendar',
  runs: 'Run Timing',
  spawning: 'Spawn Timing',
  access_points: 'Access Points',
  sections: 'River Sections',
  gauge: 'USGS Gauge',
  outfitters: 'Outfitter Information',
  history: 'Historical Information',
  other: 'Other',
}

function relativeDate(dateStr: string): string {
  const date = new Date(dateStr)
  const now = new Date()
  const diff = now.getTime() - date.getTime()
  const mins = Math.floor(diff / 60000)
  const hours = Math.floor(diff / 3600000)
  const days = Math.floor(diff / 86400000)
  const weeks = Math.floor(days / 7)
  const months = Math.floor(days / 30)

  if (mins < 1) return 'just now'
  if (mins < 60) return `${mins}m ago`
  if (hours < 24) return `${hours}h ago`
  if (days === 1) return 'yesterday'
  if (days < 7) return `${days}d ago`
  if (weeks < 5) return `${weeks}w ago`
  if (months < 12) return `${months}mo ago`
  return date.toLocaleDateString()
}

interface Props {
  searchParams: Promise<{ page?: string }>
}

export default async function ImprovementsPage({ searchParams }: Props) {
  const params = await searchParams
  const page = Math.max(1, parseInt(params.page || '1'))
  const perPage = 20
  const offset = (page - 1) * perPage

  const supabase = createSupabaseClient()

  // Fetch approved suggestions
  const { data: improvements, count } = await supabase
    .from('suggestions')
    .select('id, river_id, river_name, state_key, field, user_email, reviewed_at', { count: 'exact' })
    .eq('status', 'approved')
    .order('reviewed_at', { ascending: false })
    .range(offset, offset + perPage - 1)

  const totalPages = Math.ceil((count || 0) / perPage)

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
      </nav>

      <div style={{ maxWidth: '640px', margin: '0 auto', padding: '24px 28px' }}>
        {/* Header */}
        <div style={{ fontFamily: mono, fontSize: '9px', color: 'var(--rv)', textTransform: 'uppercase', letterSpacing: '1.5px', marginBottom: '6px' }}>
          Community
        </div>
        <h1 style={{ fontFamily: serif, fontSize: '24px', fontWeight: 700, color: 'var(--rvdk)', marginBottom: '6px' }}>
          River Improvements
        </h1>
        <p style={{ fontSize: '13px', color: 'var(--tx2)', lineHeight: 1.6, marginBottom: '24px' }}>
          RiverScout data is improved by paddlers and anglers who know these rivers.
          Every correction is reviewed before it goes live.
          {count ? ` ${count} improvements and counting.` : ''}
        </p>

        {/* Improvements list */}
        {(!improvements || improvements.length === 0) ? (
          <div style={{ fontFamily: mono, fontSize: '12px', color: 'var(--tx3)', textAlign: 'center', padding: '40px 0' }}>
            No improvements yet. Be the first — click &ldquo;Improve This River&rdquo; on any river page.
          </div>
        ) : (
          <div>
            {improvements.map(item => {
              const username = item.user_email
                ? item.user_email.split('@')[0]
                : 'A paddler'

              return (
                <div key={item.id} style={{
                  padding: '12px 0', borderBottom: '.5px solid var(--bd)',
                  display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start',
                }}>
                  <div>
                    <div style={{ fontSize: '13px', color: 'var(--tx)', lineHeight: 1.5 }}>
                      <span style={{ fontFamily: mono, fontSize: '11px', color: 'var(--rv)', fontWeight: 500 }}>{username}</span>
                      {' '}improved{' '}
                      <span style={{ fontFamily: mono, fontSize: '11px', fontWeight: 500 }}>
                        {fieldLabels[item.field] || item.field}
                      </span>
                      {' '}on{' '}
                      <Link href={`/state/${item.state_key}`} style={{ fontFamily: serif, fontWeight: 600, color: 'var(--rvdk)', textDecoration: 'none' }}>
                        {item.river_name}
                      </Link>
                    </div>
                    <div style={{ fontFamily: mono, fontSize: '9px', color: 'var(--tx3)', marginTop: '2px' }}>
                      {item.state_key.toUpperCase()}
                    </div>
                  </div>
                  <div style={{ fontFamily: mono, fontSize: '9px', color: 'var(--tx3)', flexShrink: 0, marginLeft: '12px' }}>
                    {item.reviewed_at ? relativeDate(item.reviewed_at) : ''}
                  </div>
                </div>
              )
            })}
          </div>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <div style={{ display: 'flex', justifyContent: 'center', gap: '8px', marginTop: '24px' }}>
            {page > 1 && (
              <Link href={`/about/improvements?page=${page - 1}`} style={{
                fontFamily: mono, fontSize: '11px', padding: '6px 16px', borderRadius: 'var(--r)',
                border: '.5px solid var(--bd2)', color: 'var(--tx2)', textDecoration: 'none',
              }}>
                Previous
              </Link>
            )}
            <span style={{ fontFamily: mono, fontSize: '10px', color: 'var(--tx3)', display: 'flex', alignItems: 'center' }}>
              Page {page} of {totalPages}
            </span>
            {page < totalPages && (
              <Link href={`/about/improvements?page=${page + 1}`} style={{
                fontFamily: mono, fontSize: '11px', padding: '6px 16px', borderRadius: 'var(--r)',
                border: '.5px solid var(--rvmd)', background: 'var(--rvlt)', color: 'var(--rvdk)', textDecoration: 'none',
              }}>
                Next
              </Link>
            )}
          </div>
        )}

        {/* CTA */}
        <div style={{ textAlign: 'center', marginTop: '32px', padding: '20px', background: 'var(--bg2)', borderRadius: 'var(--rlg)', border: '.5px solid var(--bd)' }}>
          <div style={{ fontFamily: serif, fontSize: '16px', fontWeight: 600, color: 'var(--rvdk)', marginBottom: '6px' }}>
            Know something we got wrong?
          </div>
          <div style={{ fontFamily: mono, fontSize: '11px', color: 'var(--tx2)', marginBottom: '12px' }}>
            Every river page has an &ldquo;Improve This River&rdquo; button. Your local knowledge makes RiverScout better for everyone.
          </div>
          <Link href="/" style={{
            fontFamily: mono, fontSize: '11px', padding: '8px 20px', borderRadius: 'var(--r)',
            background: 'var(--rv)', color: '#fff', textDecoration: 'none', display: 'inline-block',
          }}>
            Explore Rivers
          </Link>
        </div>
      </div>
    </main>
  )
}
