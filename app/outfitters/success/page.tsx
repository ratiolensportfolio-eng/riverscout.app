'use client'

import Link from 'next/link'
import { useSearchParams } from 'next/navigation'
import { Suspense } from 'react'

const mono = "'IBM Plex Mono', monospace"
const serif = "'Playfair Display', serif"

function SuccessContent() {
  const params = useSearchParams()
  const tier = params.get('tier') || 'listed'
  const billing = params.get('billing')

  const tierNames: Record<string, string> = {
    listed: 'Listed',
    featured: 'Featured',
    sponsored: 'Sponsored',
    guide: 'Guide Profile',
    destination: 'Destination Sponsor',
  }

  return (
    <main style={{ minHeight: '100vh', background: 'var(--bg)', color: 'var(--tx)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div style={{ maxWidth: '480px', textAlign: 'center', padding: '40px 28px' }}>
        <div style={{ fontSize: '48px', marginBottom: '16px' }}>&#10003;</div>
        <h1 style={{ fontFamily: serif, fontSize: '24px', fontWeight: 700, color: 'var(--rvdk)', marginBottom: '8px' }}>
          {tier === 'listed' ? "You're listed!" : "Welcome aboard!"}
        </h1>
        <div style={{
          fontFamily: mono, fontSize: '10px', padding: '4px 12px', borderRadius: '12px',
          background: 'var(--rvlt)', color: 'var(--rvdk)', border: '.5px solid var(--rvmd)',
          display: 'inline-block', marginBottom: '16px',
        }}>
          {tierNames[tier] || tier} tier
          {billing === 'yearly' ? ' · Annual' : billing === 'monthly' ? ' · Monthly' : ''}
        </div>
        <p style={{ fontSize: '14px', color: 'var(--tx2)', lineHeight: 1.7, marginBottom: '24px' }}>
          {tier === 'listed'
            ? "Your free listing has been submitted. It will appear on your selected river once reviewed."
            : "Your subscription is active. Your listing will appear on your selected rivers within minutes."
          }
        </p>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', maxWidth: '280px', margin: '0 auto' }}>
          <Link href="/outfitters/dashboard" style={{
            display: 'block', padding: '12px', fontFamily: mono, fontSize: '12px', fontWeight: 500,
            background: 'var(--rv)', color: '#fff', border: 'none', borderRadius: 'var(--r)',
            textDecoration: 'none', textAlign: 'center',
          }}>
            Go to Dashboard
          </Link>
          <Link href="/" style={{
            display: 'block', padding: '12px', fontFamily: mono, fontSize: '12px',
            background: 'var(--bg)', color: 'var(--tx2)', border: '.5px solid var(--bd2)', borderRadius: 'var(--r)',
            textDecoration: 'none', textAlign: 'center',
          }}>
            Back to RiverScout
          </Link>
        </div>

        {tier !== 'listed' && (
          <div style={{ fontFamily: mono, fontSize: '9px', color: 'var(--tx3)', marginTop: '20px' }}>
            A confirmation email has been sent to your account. You can manage your subscription in the dashboard.
          </div>
        )}
      </div>
    </main>
  )
}

export default function SuccessPage() {
  return (
    <Suspense fallback={<div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>Loading...</div>}>
      <SuccessContent />
    </Suspense>
  )
}
