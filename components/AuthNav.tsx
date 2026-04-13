'use client'

import { useEffect, useRef, useState } from 'react'
import Link from 'next/link'
import { supabase } from '@/lib/supabase'
import type { User } from '@supabase/supabase-js'
import ContributorBadge from '@/components/ContributorBadge'
import { SHOW_PRO_TIER } from '@/lib/features'

const mono = "'IBM Plex Mono', monospace"

export default function AuthNav() {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const [open, setOpen] = useState(false)
  // Signed-in user's contributor count (approved suggestions +
  // helpful answers). Drives the inline tier badge in the dropdown
  // header. Null until the count fetch completes; the badge
  // component renders nothing for the empty 'none' tier so the
  // header gracefully shows just the email until then.
  const [contributorCount, setContributorCount] = useState<number | null>(null)
  const wrapperRef = useRef<HTMLDivElement | null>(null)
  const buttonRef = useRef<HTMLButtonElement | null>(null)
  // Dropdown position is measured from the button when the menu opens
  // so it can render with position:fixed and escape the nav-pills
  // `overflow-x: auto` scroll container on mobile (which was clipping
  // the dropdown and making it unreachable).
  const [menuPos, setMenuPos] = useState<{ top: number; right: number } | null>(null)

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      setUser(data.user)
      setLoading(false)
    })

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null)
    })

    return () => subscription.unsubscribe()
  }, [])

  // Fetch the user's contributor count whenever the user changes.
  // Same dual-source calculation as /account: approved suggestions
  // plus Q&A answers with helpful_count >= 1. Best-effort — errors
  // leave the count null and the badge simply doesn't render.
  useEffect(() => {
    if (!user) {
      setContributorCount(null)
      return
    }
    let cancelled = false
    Promise.all([
      supabase
        .from('suggestions')
        .select('*', { count: 'exact', head: true })
        .eq('user_id', user.id)
        .eq('status', 'approved'),
      supabase
        .from('river_answers')
        .select('*', { count: 'exact', head: true })
        .eq('user_id', user.id)
        .eq('status', 'active')
        .gte('helpful_count', 1),
    ]).then(([approved, helpful]) => {
      if (cancelled) return
      const total = (approved.count ?? 0) + (helpful.count ?? 0)
      setContributorCount(total)
    }).catch(() => {
      if (!cancelled) setContributorCount(null)
    })
    return () => { cancelled = true }
  }, [user])

  // Measure button position whenever the menu opens so the dropdown
  // can render with position:fixed at the right spot. Also re-measure
  // on resize / scroll so the menu doesn't float out of place.
  useEffect(() => {
    if (!open) return
    function measure() {
      const btn = buttonRef.current
      if (!btn) return
      const rect = btn.getBoundingClientRect()
      setMenuPos({
        top: rect.bottom + 6,
        right: window.innerWidth - rect.right,
      })
    }
    measure()
    window.addEventListener('resize', measure)
    window.addEventListener('scroll', measure, true)
    return () => {
      window.removeEventListener('resize', measure)
      window.removeEventListener('scroll', measure, true)
    }
  }, [open])

  // Close on outside click/tap + escape key. Uses pointerdown so it
  // fires on both mouse and touch without the legacy mobile tap-delay.
  useEffect(() => {
    if (!open) return
    function onPointer(e: PointerEvent | MouseEvent) {
      const target = e.target as Node
      if (wrapperRef.current?.contains(target)) return
      // Menu is now portaled via fixed position, so also check menu itself.
      if ((target as HTMLElement).closest?.('[data-auth-menu]')) return
      setOpen(false)
    }
    function onKey(e: KeyboardEvent) {
      if (e.key === 'Escape') setOpen(false)
    }
    document.addEventListener('pointerdown', onPointer as EventListener)
    document.addEventListener('keydown', onKey)
    return () => {
      document.removeEventListener('pointerdown', onPointer as EventListener)
      document.removeEventListener('keydown', onKey)
    }
  }, [open])

  if (loading) return null

  if (!user) {
    return (
      <Link href="/login" style={{
        fontFamily: mono, fontSize: '10px',
        padding: '5px 10px', borderRadius: '20px',
        border: '.5px solid var(--bd2)', color: 'var(--tx2)',
        textDecoration: 'none',
      }}>
        Sign In
      </Link>
    )
  }

  const avatar = user.user_metadata?.avatar_url
  const name = user.user_metadata?.full_name || user.email?.split('@')[0] || 'User'
  const profileUsername = user.email?.split('@')[0] || 'user'

  return (
    <div ref={wrapperRef} style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
      <button
        ref={buttonRef}
        type="button"
        onClick={() => setOpen(o => !o)}
        aria-haspopup="menu"
        aria-expanded={open}
        aria-label="Account menu"
        style={{
          display: 'flex', alignItems: 'center', gap: '6px',
          background: 'none', border: 'none', cursor: 'pointer',
          padding: '4px 4px', borderRadius: '20px',
        }}
      >
        {avatar ? (
          <img src={avatar} alt={name} style={{ width: 22, height: 22, borderRadius: '50%', border: '.5px solid var(--bd2)' }} />
        ) : (
          <div style={{
            width: 22, height: 22, borderRadius: '50%',
            background: 'var(--rvlt)', border: '.5px solid var(--rvmd)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontFamily: mono, fontSize: '9px', fontWeight: 600, color: 'var(--rvdk)',
          }}>
            {name[0].toUpperCase()}
          </div>
        )}
        <span style={{ fontFamily: mono, fontSize: '10px', color: 'var(--tx2)', maxWidth: '120px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
          {name}
        </span>
        {contributorCount != null && <ContributorBadge count={contributorCount} />}
        {/* Tiny chevron — visual hint that this opens a menu. */}
        <span aria-hidden="true" style={{
          fontFamily: mono, fontSize: '9px', color: 'var(--tx3)',
          transform: open ? 'rotate(180deg)' : 'rotate(0deg)',
          transition: 'transform .18s ease',
          lineHeight: 1,
        }}>
          ▾
        </span>
      </button>

      {open && menuPos && (
        <div
          role="menu"
          data-auth-menu
          style={{
            position: 'fixed',
            top: menuPos.top,
            right: menuPos.right,
            minWidth: '200px',
            maxWidth: 'calc(100vw - 16px)',
            background: 'var(--bg)',
            border: '.5px solid var(--bd2)',
            borderRadius: 'var(--r)',
            boxShadow: '0 8px 24px rgba(0,0,0,.10)',
            overflow: 'hidden',
            zIndex: 1000,
          }}
        >
          {/* Header — show full email so the user can confirm which
              account they're signed in as before clicking anything
              destructive (or noticing they're on the wrong account). */}
          <div style={{
            padding: '10px 14px',
            borderBottom: '.5px solid var(--bd)',
            background: 'var(--bg2)',
          }}>
            <div style={{ fontFamily: mono, fontSize: '9px', color: 'var(--tx3)', textTransform: 'uppercase', letterSpacing: '.5px', marginBottom: '2px' }}>
              Signed in as
            </div>
            <div style={{ fontFamily: mono, fontSize: '11px', color: 'var(--tx)', wordBreak: 'break-all', lineHeight: 1.3 }}>
              {user.email}
            </div>
            {contributorCount != null && contributorCount > 0 && (
              <div style={{ marginTop: '6px' }}>
                <ContributorBadge count={contributorCount} size="md" showLabel />
              </div>
            )}
          </div>

          <MenuLink href={`/profile/${profileUsername}`} onClick={() => setOpen(false)}>
            Your profile
          </MenuLink>
          <MenuLink href="/account" onClick={() => setOpen(false)}>
            Account &amp; settings
          </MenuLink>
          <MenuLink href="/account#saved" onClick={() => setOpen(false)}>
            Saved rivers
          </MenuLink>
          {/* Single "Alerts" link — all three alert types (flow,
              dam release, hatch) live under the same My Alerts
              section on /account, so listing them separately just
              meant three menu items leading to the same page. */}
          <MenuLink href="/account#alerts" onClick={() => setOpen(false)}>
            Alerts
          </MenuLink>
          <MenuLink href="/outfitters/dashboard" onClick={() => setOpen(false)}>
            Outfitter dashboard
          </MenuLink>
          {SHOW_PRO_TIER && (
            <MenuLink href="/pro" onClick={() => setOpen(false)}>
              Upgrade to Pro
            </MenuLink>
          )}

          {/* Sign out — separated visually because it's a different
              kind of action (destructive-ish, ends the session). */}
          <div style={{ borderTop: '.5px solid var(--bd)' }}>
            <form action="/auth/signout" method="POST">
              <button
                type="submit"
                role="menuitem"
                style={{
                  width: '100%',
                  padding: '10px 14px',
                  fontFamily: mono, fontSize: '11px',
                  color: 'var(--dg)', textAlign: 'left',
                  background: 'none', border: 'none', cursor: 'pointer',
                }}
              >
                Sign out
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}

// Single menu item — Link styled as a row that fills the dropdown
// width and highlights on hover. Closes the menu after click via the
// onClick handler passed in.
function MenuLink({ href, children, onClick }: { href: string; children: React.ReactNode; onClick: () => void }) {
  return (
    <Link
      href={href}
      onClick={onClick}
      role="menuitem"
      style={{
        display: 'block',
        padding: '10px 14px',
        fontFamily: mono, fontSize: '11px',
        color: 'var(--tx)', textDecoration: 'none',
        borderTop: '.5px solid var(--bd)',
      }}
      onMouseEnter={e => (e.currentTarget.style.background = 'var(--bg2)')}
      onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}
    >
      {children}
    </Link>
  )
}
