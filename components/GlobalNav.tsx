'use client'

// Site-wide top nav. Used to live inline on the homepage and was
// duplicated as a slim "logo + back link" bar on every other page,
// which meant most of the app had no way to jump to Map / Search /
// Hatches / Alerts / Community / Outfitters / Pro from wherever
// you were. Now it renders once from app/layout.tsx and uses
// usePathname() to highlight the matching pill on the current
// page. Per-page nav blocks have been removed.

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import AuthNav from './AuthNav'

const serif = "'Playfair Display', serif"

interface Pill {
  label: string
  href: string
  // Match the current pathname against this regex to decide
  // whether the pill should render in the highlighted-active
  // state. Each pattern is anchored to either the section root
  // or a specific subtree.
  match: RegExp
  // Pro is rendered as a permanent-highlight pill regardless of
  // the current path because it doubles as the upgrade CTA.
  alwaysHighlight?: boolean
}

const PILLS: Pill[] = [
  { label: 'Map',         href: '/',                    match: /^\/$|^\/state(\/|$)/ },
  { label: 'Rivers',      href: '/rivers',              match: /^\/rivers/ },
  { label: 'Search',      href: '/search',              match: /^\/search/ },
  { label: 'Hatches',     href: '/hatches',             match: /^\/hatches/ },
  { label: 'Alerts',      href: '/alerts',              match: /^\/alerts/ },
  { label: 'Community',   href: '/about/improvements',  match: /^\/about|^\/profile/ },
  { label: 'Outfitters',  href: '/outfitters',          match: /^\/outfitters/ },
  { label: 'Pro',         href: '/pro',                 match: /^\/pro/, alwaysHighlight: true },
]

export default function GlobalNav() {
  const pathname = usePathname() || '/'

  // Hide the nav on the auth flow and any embedded contexts where
  // a top bar would just be in the way.
  if (pathname.startsWith('/login') || pathname.startsWith('/signup') || pathname.startsWith('/auth')) {
    return null
  }

  return (
    <nav style={{
      display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      padding: '0 16px', height: '44px', borderBottom: '.5px solid var(--bd)',
      background: 'var(--bg)', flexShrink: 0,
    }}>
      <Link href="/" style={{
        fontFamily: serif, fontSize: '18px', fontWeight: 700,
        color: 'var(--rvdk)', letterSpacing: '-.3px', textDecoration: 'none',
      }}>
        River<span style={{ color: 'var(--wt)' }}>Scout</span>
      </Link>

      <div className="nav-pills">
        {PILLS.map(p => {
          const active = p.alwaysHighlight || p.match.test(pathname)
          return (
            <Link
              key={p.label}
              href={p.href}
              style={{
                padding: '5px 10px',
                borderRadius: '20px',
                border: active ? '.5px solid var(--rvmd)' : '.5px solid var(--bd2)',
                color: active ? 'var(--rvdk)' : 'var(--tx2)',
                background: active ? 'var(--rvlt)' : 'transparent',
                textDecoration: 'none',
                fontWeight: active ? 500 : 400,
                whiteSpace: 'nowrap',
              }}
            >
              {p.label}
            </Link>
          )
        })}
        <AuthNav />
      </div>
    </nav>
  )
}
