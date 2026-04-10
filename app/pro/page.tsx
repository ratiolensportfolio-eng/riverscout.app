'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { supabase } from '@/lib/supabase'
import { PRO_FEATURES, PRO_PRICE } from '@/types'
import { ALL_RIVERS } from '@/data/rivers'

const mono = "'IBM Plex Mono', monospace"
const serif = "'Playfair Display', serif"

// Everything available in the free tier. This list mirrors what free
// users actually get on riverscout.app today and is the counterpart to
// PRO_FEATURES in types/index.ts. Keep them in sync with the real
// gating logic in components/rivers/RiverTabs.tsx.
const FREE_FEATURES: string[] = [
  `Live CFS conditions on ${ALL_RIVERS.length}+ rivers \u2014 updated every 15 min`,
  '7-day flow forecasts',
  'Unlimited flow alert subscriptions',
  'Stocking reports and hatch calendars',
  '7-day weather forecast with lightning risk',
  'Cold water safety alerts',
  'River history, fisheries data, named rapids',
  'Trip reports and community corrections',
  'Outfitter listings',
]

const FAQ = [
  {
    q: 'Is RiverScout really free?',
    a: `Yes. All ${ALL_RIVERS.length}+ rivers, live conditions, forecasts, hatch and stocking data, trip reports, weather, and alerts are completely free. Pro is for paddlers and anglers who want the site to come to them \u2014 push notifications, deeper analytics, offline access.`,
  },
  {
    q: 'Can I cancel anytime?',
    a: 'Yes, cancel from your account settings. Your Pro access continues until the end of your billing period.',
  },
  {
    q: 'What exactly do I lose if I don\u2019t upgrade?',
    a: "Nothing about discovering, planning, or tracking rivers. You can see every river, every forecast, every hatch and stocking report. You just don't get automatic email notifications, offline access, or historical/AI analysis.",
  },
  {
    q: 'Is this separate from outfitter listings?',
    a: 'Yes. Pro is for individual paddlers and anglers. Outfitter listings are a separate product for businesses.',
  },
  {
    q: 'What payment methods are accepted?',
    a: 'All major credit and debit cards via Stripe. Apple Pay and Google Pay where available.',
  },
]

export default function ProPage() {
  const [userId, setUserId] = useState<string | null>(null)
  const [userEmail, setUserEmail] = useState<string | null>(null)
  const [isPro, setIsPro] = useState(false)
  const [loadingMonthly, setLoadingMonthly] = useState(false)
  const [loadingYearly, setLoadingYearly] = useState(false)

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      setUserId(data.user?.id ?? null)
      setUserEmail(data.user?.email ?? null)
      if (data.user?.id) {
        fetch(`/api/pro/status?userId=${data.user.id}`)
          .then(r => r.json())
          .then(d => setIsPro(d.isPro))
          .catch(() => {})
      }
    })
  }, [])

  async function handleCheckout(billing: 'monthly' | 'yearly') {
    if (!userId || !userEmail) return
    if (billing === 'monthly') setLoadingMonthly(true)
    else setLoadingYearly(true)
    try {
      const res = await fetch('/api/stripe/pro-checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId, email: userEmail, tier: billing }),
      })
      const data = await res.json()
      if (data.url) {
        window.location.href = data.url
      }
    } catch {
      setLoadingMonthly(false)
      setLoadingYearly(false)
    }
  }

  const savePct = Math.round((1 - PRO_PRICE.yearly / (PRO_PRICE.monthly * 12)) * 100)
  const monthlyEquiv = (PRO_PRICE.yearly / 12).toFixed(2)

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
          <Link href="/alerts" style={{ padding: '5px 10px', borderRadius: '20px', border: '.5px solid var(--bd2)', color: 'var(--tx2)', textDecoration: 'none' }}>Alerts</Link>
          <span style={{ padding: '5px 10px', borderRadius: '20px', border: '.5px solid var(--rvmd)', color: 'var(--rvdk)', background: 'var(--rvlt)' }}>Pro</span>
        </div>
      </nav>

      <div style={{ maxWidth: '800px', margin: '0 auto', padding: '40px 28px' }}>
        {/* Hero */}
        <div style={{ textAlign: 'center', marginBottom: '40px' }}>
          <div style={{ fontFamily: mono, fontSize: '9px', color: 'var(--rv)', textTransform: 'uppercase', letterSpacing: '2px', marginBottom: '10px' }}>
            The site works for you, not the other way around
          </div>
          <h1 style={{ fontFamily: serif, fontSize: '36px', fontWeight: 700, color: 'var(--rvdk)', lineHeight: 1.2, marginBottom: '14px' }}>
            RiverScout Pro
          </h1>
          <p style={{ fontFamily: mono, fontSize: '13px', color: 'var(--tx)', lineHeight: 1.7, maxWidth: '560px', margin: '0 auto 10px' }}>
            RiverScout is completely free. Pro is for paddlers and anglers who want the site to come to them.
          </p>
          <p style={{ fontFamily: mono, fontSize: '11px', color: 'var(--tx2)', lineHeight: 1.7, maxWidth: '560px', margin: '0 auto' }}>
            Get notified automatically when your rivers hit optimal conditions, when they&apos;re stocked, and when the hatch is about to start. Plus offline access, historical flow data, and AI-powered forecasts.
          </p>
        </div>

        {/* Already Pro */}
        {isPro && (
          <div style={{
            textAlign: 'center', padding: '28px', background: 'var(--rvlt)',
            borderRadius: 'var(--rlg)', border: '.5px solid var(--rvmd)', marginBottom: '32px',
          }}>
            <div style={{ fontSize: '28px', marginBottom: '8px' }}>&#10003;</div>
            <div style={{ fontFamily: serif, fontSize: '20px', fontWeight: 700, color: 'var(--rvdk)' }}>
              You're a Pro member
            </div>
            <div style={{ fontFamily: mono, fontSize: '11px', color: 'var(--rv)', marginTop: '6px' }}>
              Thank you for supporting RiverScout and independent river data
            </div>
          </div>
        )}

        {/* Pricing cards — side by side */}
        {!isPro && (
          <div className="pro-pricing-grid" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '40px' }}>
            {/* Monthly card */}
            <div style={{
              border: '.5px solid var(--bd)', borderRadius: 'var(--rlg)',
              padding: '24px', background: 'var(--bg)',
              display: 'flex', flexDirection: 'column',
            }}>
              <div style={{ fontFamily: mono, fontSize: '10px', color: 'var(--tx3)', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '12px' }}>
                Monthly
              </div>
              <div style={{ marginBottom: '16px' }}>
                <span style={{ fontFamily: serif, fontSize: '36px', fontWeight: 700, color: 'var(--rvdk)' }}>
                  ${PRO_PRICE.monthly}
                </span>
                <span style={{ fontFamily: mono, fontSize: '13px', color: 'var(--tx3)' }}> / month</span>
              </div>
              <div style={{ flex: 1 }} />
              {userId ? (
                <button onClick={() => handleCheckout('monthly')} disabled={loadingMonthly} style={{
                  width: '100%', padding: '12px', fontFamily: mono, fontSize: '12px', fontWeight: 500,
                  background: 'var(--bg)', color: 'var(--rvdk)', border: '.5px solid var(--rvmd)',
                  borderRadius: 'var(--r)', cursor: loadingMonthly ? 'wait' : 'pointer',
                  opacity: loadingMonthly ? 0.6 : 1, letterSpacing: '.3px',
                }}>
                  {loadingMonthly ? 'Redirecting...' : 'Upgrade to Pro'}
                </button>
              ) : (
                <Link href="/login" style={{
                  display: 'block', width: '100%', padding: '12px', fontFamily: mono, fontSize: '12px', fontWeight: 500,
                  background: 'var(--bg)', color: 'var(--rvdk)', border: '.5px solid var(--rvmd)',
                  borderRadius: 'var(--r)', textDecoration: 'none', textAlign: 'center',
                  letterSpacing: '.3px', boxSizing: 'border-box',
                }}>
                  Sign in to upgrade
                </Link>
              )}
              <div style={{ fontFamily: mono, fontSize: '9px', color: 'var(--tx3)', textAlign: 'center', marginTop: '8px' }}>
                Cancel anytime
              </div>
            </div>

            {/* Annual card — highlighted */}
            <div style={{
              border: '.5px solid var(--rvmd)', borderRadius: 'var(--rlg)',
              padding: '24px', background: 'var(--rvlt)',
              position: 'relative', display: 'flex', flexDirection: 'column',
              boxShadow: '0 4px 20px rgba(29,158,117,.12)',
            }}>
              <div style={{
                position: 'absolute', top: '-10px', right: '16px',
                fontFamily: mono, fontSize: '9px', padding: '3px 12px', borderRadius: '12px',
                background: 'var(--rv)', color: '#fff', textTransform: 'uppercase', letterSpacing: '1px',
              }}>
                Most Popular
              </div>
              <div style={{ fontFamily: mono, fontSize: '10px', color: 'var(--rv)', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '12px' }}>
                Annual
              </div>
              <div style={{ marginBottom: '4px' }}>
                <span style={{ fontFamily: serif, fontSize: '36px', fontWeight: 700, color: 'var(--rvdk)' }}>
                  ${PRO_PRICE.yearly}
                </span>
                <span style={{ fontFamily: mono, fontSize: '13px', color: 'var(--tx3)' }}> / year</span>
              </div>
              <div style={{ fontFamily: mono, fontSize: '11px', color: 'var(--rv)', marginBottom: '16px' }}>
                Save {savePct}% — ${monthlyEquiv}/month
              </div>
              <div style={{ flex: 1 }} />
              {userId ? (
                <button onClick={() => handleCheckout('yearly')} disabled={loadingYearly} style={{
                  width: '100%', padding: '12px', fontFamily: mono, fontSize: '12px', fontWeight: 500,
                  background: 'var(--rvdk)', color: '#fff', border: 'none',
                  borderRadius: 'var(--r)', cursor: loadingYearly ? 'wait' : 'pointer',
                  opacity: loadingYearly ? 0.6 : 1, letterSpacing: '.3px',
                }}>
                  {loadingYearly ? 'Redirecting...' : 'Get Pro Annual'}
                </button>
              ) : (
                <Link href="/login" style={{
                  display: 'block', width: '100%', padding: '12px', fontFamily: mono, fontSize: '12px', fontWeight: 500,
                  background: 'var(--rvdk)', color: '#fff', border: 'none',
                  borderRadius: 'var(--r)', textDecoration: 'none', textAlign: 'center',
                  letterSpacing: '.3px', boxSizing: 'border-box',
                }}>
                  Sign in to upgrade
                </Link>
              )}
              <div style={{ fontFamily: mono, fontSize: '9px', color: 'var(--rv)', textAlign: 'center', marginTop: '8px' }}>
                Best value
              </div>
            </div>
          </div>
        )}

        {/* FREE feature list */}
        <div style={{ marginBottom: '32px' }}>
          <div style={{
            display: 'flex', alignItems: 'baseline', gap: '10px', marginBottom: '8px',
          }}>
            <div style={{ fontFamily: mono, fontSize: '10px', color: 'var(--rv)', textTransform: 'uppercase', letterSpacing: '1.5px', fontWeight: 600 }}>
              Free
            </div>
            <div style={{ fontFamily: mono, fontSize: '11px', color: 'var(--tx2)' }}>
              Everything you need to plan every trip
            </div>
          </div>
          <div style={{
            border: '.5px solid var(--bd)', borderRadius: 'var(--rlg)',
            overflow: 'hidden',
          }}>
            {FREE_FEATURES.map((title, i) => (
              <div key={i} style={{
                display: 'flex', alignItems: 'flex-start', gap: '12px',
                padding: '11px 18px',
                borderBottom: i < FREE_FEATURES.length - 1 ? '.5px solid var(--bd)' : 'none',
                background: i % 2 === 0 ? 'var(--bg)' : 'var(--bg2)',
              }}>
                <span style={{ color: 'var(--rv)', fontSize: '12px', flexShrink: 0, marginTop: '1px', fontWeight: 700 }}>&#10003;</span>
                <div style={{ fontFamily: mono, fontSize: '12px', color: 'var(--tx)', lineHeight: 1.5 }}>
                  {title}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* PRO feature list */}
        <div style={{ marginBottom: '40px' }}>
          <div style={{
            display: 'flex', alignItems: 'baseline', gap: '10px', marginBottom: '8px',
          }}>
            <div style={{ fontFamily: mono, fontSize: '10px', color: 'var(--rvdk)', textTransform: 'uppercase', letterSpacing: '1.5px', fontWeight: 600 }}>
              RiverScout Pro
            </div>
            <div style={{ fontFamily: mono, fontSize: '11px', color: 'var(--tx2)' }}>
              ${PRO_PRICE.monthly}/month &middot; ${PRO_PRICE.yearly}/year
            </div>
          </div>
          <div style={{ fontFamily: mono, fontSize: '11px', color: 'var(--tx3)', marginBottom: '10px', fontStyle: 'italic' }}>
            Everything in the free tier, plus:
          </div>
          <div style={{
            border: '.5px solid var(--rvmd)', borderRadius: 'var(--rlg)',
            overflow: 'hidden', background: 'var(--rvlt)',
          }}>
            {PRO_FEATURES.map((f, i) => (
              <div key={i} style={{
                display: 'flex', alignItems: 'flex-start', gap: '12px',
                padding: '13px 18px',
                borderBottom: i < PRO_FEATURES.length - 1 ? '.5px solid var(--rvmd)' : 'none',
              }}>
                <span style={{ color: 'var(--rvdk)', fontSize: '13px', flexShrink: 0, marginTop: '1px', fontWeight: 700 }}>{f.icon}</span>
                <div>
                  <div style={{
                    fontFamily: mono, fontSize: '12px', fontWeight: 500, color: 'var(--rvdk)',
                    display: 'flex', alignItems: 'center', gap: '8px',
                  }}>
                    {f.title}
                    {!f.available && (
                      <span style={{ fontFamily: mono, fontSize: '9px', color: 'var(--tx3)', padding: '1px 6px', borderRadius: '4px', background: 'var(--bg)' }}>
                        coming soon
                      </span>
                    )}
                  </div>
                  <div style={{ fontFamily: mono, fontSize: '11px', color: 'var(--tx2)', marginTop: '2px', lineHeight: 1.5 }}>
                    {f.description}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* FAQ */}
        <div style={{ marginBottom: '40px' }}>
          <h2 style={{ fontFamily: serif, fontSize: '20px', fontWeight: 700, color: 'var(--rvdk)', marginBottom: '16px', textAlign: 'center' }}>
            Questions
          </h2>
          {FAQ.map((faq, i) => (
            <div key={i} style={{
              marginBottom: '12px', padding: '14px 16px',
              background: 'var(--bg2)', borderRadius: 'var(--r)',
              border: '.5px solid var(--bd)',
            }}>
              <div style={{ fontFamily: serif, fontSize: '13px', fontWeight: 600, marginBottom: '4px' }}>
                {faq.q}
              </div>
              <div style={{ fontFamily: mono, fontSize: '11px', color: 'var(--tx2)', lineHeight: 1.6 }}>
                {faq.a}
              </div>
            </div>
          ))}
        </div>

        {/* Bottom CTA */}
        {!isPro && (
          <div style={{ textAlign: 'center', padding: '20px 0 10px' }}>
            {userId ? (
              <button onClick={() => handleCheckout('yearly')} disabled={loadingYearly} style={{
                fontFamily: mono, fontSize: '13px', fontWeight: 500,
                padding: '13px 36px', borderRadius: 'var(--r)',
                background: 'var(--rvdk)', color: '#fff', border: 'none',
                cursor: loadingYearly ? 'wait' : 'pointer', opacity: loadingYearly ? 0.6 : 1,
                letterSpacing: '.3px',
              }}>
                {loadingYearly ? 'Redirecting...' : `Get Pro Annual — $${PRO_PRICE.yearly}/yr`}
              </button>
            ) : (
              <Link href="/login" style={{
                display: 'inline-block', fontFamily: mono, fontSize: '13px', fontWeight: 500,
                padding: '13px 36px', borderRadius: 'var(--r)',
                background: 'var(--rvdk)', color: '#fff', textDecoration: 'none',
                letterSpacing: '.3px',
              }}>
                Sign in to get Pro
              </Link>
            )}
            <div style={{ fontFamily: mono, fontSize: '10px', color: 'var(--tx3)', marginTop: '10px' }}>
              Cancel anytime &middot; Every river stays free forever
            </div>
          </div>
        )}
      </div>
    </main>
  )
}
