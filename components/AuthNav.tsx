'use client'

import { useEffect, useRef, useState } from 'react'
import Link from 'next/link'
import { supabase } from '@/lib/supabase'
import type { User } from '@supabase/supabase-js'

const mono = "'IBM Plex Mono', monospace"

export default function AuthNav() {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const [open, setOpen] = useState(false)
  const wrapperRef = useRef<HTMLDivElement | null>(null)

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

  // Close on outside click + escape key. We register both because
  // either one is a typical "I'm done with this menu" gesture and
  // it's annoying to be stuck with a dropdown the user can't close
  // without finding the exact button.
  useEffect(() => {
    if (!open) return
    function onClick(e: MouseEvent) {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target as Node)) {
        setOpen(false)
      }
    }
    function onKey(e: KeyboardEvent) {
      if (e.key === 'Escape') setOpen(false)
    }
    document.addEventListener('mousedown', onClick)
    document.addEventListener('keydown', onKey)
    return () => {
      document.removeEventListener('mousedown', onClick)
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

      {open && (
        <div
          role="menu"
          style={{
            position: 'absolute',
            top: 'calc(100% + 6px)',
            right: 0,
            minWidth: '200px',
            background: 'var(--bg)',
            border: '.5px solid var(--bd2)',
            borderRadius: 'var(--r)',
            boxShadow: '0 8px 24px rgba(0,0,0,.10)',
            overflow: 'hidden',
            zIndex: 200,
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
          <MenuLink href="/pro" onClick={() => setOpen(false)}>
            Upgrade to Pro
          </MenuLink>

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
