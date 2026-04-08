'use client'

import Link from 'next/link'

const mono = "'IBM Plex Mono', monospace"

interface ProGateProps {
  message: string
  children: React.ReactNode
}

// Blurred content overlay with Pro upgrade prompt
export function ProGateBlur({ message, children }: ProGateProps) {
  return (
    <div style={{ position: 'relative', borderRadius: 'var(--r)', overflow: 'hidden' }}>
      <div style={{ filter: 'blur(6px)', pointerEvents: 'none', userSelect: 'none' }}>
        {children}
      </div>
      <div style={{
        position: 'absolute', inset: 0,
        display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
        background: 'rgba(255,255,255,.6)',
        borderRadius: 'var(--r)',
      }}>
        <div style={{ fontFamily: mono, fontSize: '11px', color: 'var(--rvdk)', marginBottom: '10px', textAlign: 'center', padding: '0 16px' }}>
          {message}
        </div>
        <Link href="/pro" style={{
          fontFamily: mono, fontSize: '11px', fontWeight: 500,
          padding: '8px 20px', borderRadius: 'var(--r)',
          background: 'var(--rvdk)', color: '#fff',
          textDecoration: 'none', letterSpacing: '.3px',
        }}>
          Upgrade to Pro
        </Link>
      </div>
    </div>
  )
}

// Inline upgrade prompt (no blur, just a message + button)
export function ProGateInline({ message }: { message: string }) {
  return (
    <div style={{
      display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      padding: '10px 14px', background: 'var(--rvlt)', border: '.5px solid var(--rvmd)',
      borderRadius: 'var(--r)', gap: '12px', flexWrap: 'wrap',
    }}>
      <span style={{ fontFamily: mono, fontSize: '11px', color: 'var(--rvdk)' }}>
        {message}
      </span>
      <Link href="/pro" style={{
        fontFamily: mono, fontSize: '10px', fontWeight: 500,
        padding: '5px 14px', borderRadius: 'var(--r)',
        background: 'var(--rvdk)', color: '#fff',
        textDecoration: 'none', letterSpacing: '.3px', flexShrink: 0,
      }}>
        Upgrade to Pro &rarr;
      </Link>
    </div>
  )
}
