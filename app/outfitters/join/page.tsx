'use client'

import { useState, useMemo, useEffect } from 'react'
import Link from 'next/link'
import { ALL_RIVERS } from '@/data/rivers'
import { OUTFITTER_TIERS } from '@/types'
import type { OutfitterTier } from '@/types'
import { supabase } from '@/lib/supabase'

const mono = "'IBM Plex Mono', monospace"
const serif = "'Playfair Display', serif"

const tierColors: Record<string, string> = {
  listed: 'var(--tx2)',
  featured: 'var(--rv)',
  sponsored: 'var(--wt)',
  guide: 'var(--am)',
  destination: 'var(--lo)',
}

export default function OutfitterJoin() {
  const [step, setStep] = useState<1 | 2 | 3>(1)
  const [selectedTier, setSelectedTier] = useState<OutfitterTier>('listed')
  const [billingCycle, setBillingCycle] = useState<'monthly' | 'yearly'>('monthly')
  const [form, setForm] = useState({
    businessName: '',
    description: '',
    website: '',
    phone: '',
    email: '',
    specialtyTags: [] as string[],
  })
  const [selectedRivers, setSelectedRivers] = useState<string[]>([])
  const [riverSearch, setRiverSearch] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState('')
  // Auth state — required for the free-tier insert because the
  // outfitters table uses auth.users-backed user_id with an FK +
  // RLS policy that gates inserts on auth.uid() = user_id. Anonymous
  // submitters get bounced to /login on submit.
  const [userId, setUserId] = useState<string | null>(null)
  const [authLoaded, setAuthLoaded] = useState(false)

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      setUserId(data.user?.id ?? null)
      // Pre-fill email from auth if available
      if (data.user?.email) {
        setForm(f => ({ ...f, email: f.email || data.user!.email! }))
      }
      setAuthLoaded(true)
    })
  }, [])

  const tierConfig = OUTFITTER_TIERS.find(t => t.tier === selectedTier)!
  const maxRivers = tierConfig.maxRivers ?? 999

  const filteredRivers = useMemo(() => {
    if (!riverSearch.trim()) return []
    const q = riverSearch.toLowerCase()
    return ALL_RIVERS.filter(r =>
      r.n.toLowerCase().includes(q) || r.stateName.toLowerCase().includes(q)
    ).slice(0, 10)
  }, [riverSearch])

  const specialtyOptions = ['Canoe Rental', 'Kayak Rental', 'Rafting', 'Fly Fishing Guide', 'Kayak Instruction', 'Family Floats', 'Multi-Day Trips', 'Shuttles', 'Camping', 'Gear Shop']

  function toggleRiver(id: string) {
    setSelectedRivers(prev =>
      prev.includes(id) ? prev.filter(r => r !== id) : prev.length < maxRivers ? [...prev, id] : prev
    )
  }

  function toggleTag(tag: string) {
    setForm(f => ({
      ...f,
      specialtyTags: f.specialtyTags.includes(tag)
        ? f.specialtyTags.filter(t => t !== tag)
        : [...f.specialtyTags, tag],
    }))
  }

  async function handleSubmit() {
    if (!form.businessName.trim() || !form.email.trim() || selectedRivers.length === 0) {
      setError('Business name, email, and at least one river are required')
      return
    }
    // Validate the website looks like a URL/domain so it doesn't
    // 404 when rendered as a link on the river page. Owners
    // sometimes paste their business name in this field by mistake.
    // The check is intentionally lenient — we accept anything with
    // a dot and no spaces.
    const w = form.website.trim()
    if (w && (/\s/.test(w) || !/[a-z0-9-]+\.[a-z]{2,}/i.test(w))) {
      setError('Website doesn\u2019t look like a valid URL. Use something like thepineriver.com or https://thepineriver.com (or leave it blank).')
      return
    }
    setSubmitting(true)
    setError('')

    if (selectedTier === 'listed') {
      // Free tier requires a logged-in user — the outfitters table
      // FK + RLS both gate on auth.uid() = user_id. Anonymous
      // submitters get bounced to /login with a redirect back here.
      if (!userId) {
        setError('Please sign in to claim a free listing.')
        setSubmitting(false)
        // Give the user a moment to read the error before redirecting.
        setTimeout(() => {
          const redirect = encodeURIComponent('/outfitters/join')
          window.location.href = `/login?redirect=${redirect}`
        }, 1500)
        return
      }
      try {
        const res = await fetch('/api/outfitters', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            userId,
            businessName: form.businessName,
            description: form.description,
            riverId: selectedRivers[0],
            phone: form.phone,
            website: form.website,
            email: form.email,
          }),
        })
        const data = await res.json()
        if (data.ok) {
          window.location.href = '/outfitters/success?tier=listed'
        } else {
          setError(data.error || 'Failed to create listing')
        }
      } catch {
        setError('Network error')
      }
    } else if (selectedTier === 'destination') {
      // Destination — contact sales
      window.location.href = `mailto:outfitters@riverscout.app?subject=Destination Sponsor Inquiry — ${form.businessName}&body=Business: ${form.businessName}%0AEmail: ${form.email}%0APhone: ${form.phone}%0AStates of interest: ${selectedRivers.join(', ')}`
    } else {
      // Paid tier — create Stripe Checkout Session
      try {
        const res = await fetch('/api/stripe/checkout', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            tier: selectedTier,
            billing: billingCycle,
            businessName: form.businessName,
            email: form.email,
            riverIds: selectedRivers,
          }),
        })
        const data = await res.json()
        if (data.url) {
          window.location.href = data.url
        } else {
          setError(data.error || 'Failed to start checkout')
        }
      } catch {
        setError('Network error — please try again')
      }
    }
    setSubmitting(false)
  }

  return (
    <main style={{ minHeight: '100vh', background: 'var(--bg)', color: 'var(--tx)' }}>
      <div style={{ maxWidth: '640px', margin: '0 auto', padding: '24px 28px' }}>
        {/* Progress */}
        <div style={{ display: 'flex', gap: '4px', marginBottom: '24px' }}>
          {[1, 2, 3].map(s => (
            <div key={s} style={{
              flex: 1, height: '3px', borderRadius: '2px',
              background: s <= step ? 'var(--rv)' : 'var(--bd)',
              transition: 'background .2s',
            }} />
          ))}
        </div>

        {/* Sign-in nudge — shown only when auth has loaded and the
            user is anonymous. The free-tier insert requires a real
            auth.users row, so prompting up front saves the user
            from filling out the whole form before hitting an error. */}
        {authLoaded && !userId && (
          <div style={{
            padding: '12px 16px', marginBottom: '20px',
            background: 'var(--amlt)', border: '.5px solid var(--am)',
            borderRadius: 'var(--r)',
            display: 'flex', alignItems: 'center', justifyContent: 'space-between',
            gap: '12px', flexWrap: 'wrap',
          }}>
            <div style={{ fontFamily: mono, fontSize: '11px', color: '#7A4D0E', lineHeight: 1.55 }}>
              You&apos;ll need to sign in before claiming a free listing.
            </div>
            <Link
              href="/login?redirect=%2Foutfitters%2Fjoin"
              style={{
                fontFamily: mono, fontSize: '10px', fontWeight: 500,
                padding: '6px 14px', borderRadius: 'var(--r)',
                background: '#7A4D0E', color: '#fff', textDecoration: 'none',
                flexShrink: 0,
              }}>
              Sign in &rarr;
            </Link>
          </div>
        )}

        {/* Step 1: Choose tier */}
        {step === 1 && (
          <div>
            <div style={{ fontFamily: mono, fontSize: '9px', color: 'var(--rv)', textTransform: 'uppercase', letterSpacing: '1.5px', marginBottom: '6px' }}>
              Step 1 of 3
            </div>
            <h1 style={{ fontFamily: serif, fontSize: '22px', fontWeight: 700, color: 'var(--rvdk)', marginBottom: '16px' }}>
              Choose your plan
            </h1>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginBottom: '20px' }}>
              {OUTFITTER_TIERS.map(tier => (
                <button key={tier.tier} onClick={() => setSelectedTier(tier.tier)}
                  style={{
                    display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                    padding: '14px 16px', borderRadius: 'var(--r)', cursor: 'pointer',
                    border: selectedTier === tier.tier ? `2px solid ${tierColors[tier.tier]}` : '.5px solid var(--bd)',
                    background: selectedTier === tier.tier ? 'var(--bg2)' : 'var(--bg)',
                    textAlign: 'left',
                  }}>
                  <div>
                    <div style={{ fontFamily: serif, fontSize: '15px', fontWeight: 600, color: tierColors[tier.tier] }}>
                      {tier.name}
                    </div>
                    <div style={{ fontFamily: mono, fontSize: '10px', color: 'var(--tx3)', marginTop: '2px' }}>
                      {tier.maxRivers ? `Up to ${tier.maxRivers} river${tier.maxRivers > 1 ? 's' : ''}` : 'Entire state'}
                    </div>
                  </div>
                  <div style={{ fontFamily: serif, fontSize: '18px', fontWeight: 700, color: tierColors[tier.tier] }}>
                    {tier.monthlyPrice === 0 ? 'Free' : `$${tier.monthlyPrice}/mo`}
                  </div>
                </button>
              ))}
            </div>

            {/* Billing cycle for paid tiers */}
            {selectedTier !== 'listed' && tierConfig.yearlyPrice !== null && (
              <div style={{ display: 'flex', gap: '8px', marginBottom: '20px' }}>
                <button onClick={() => setBillingCycle('monthly')}
                  style={{
                    flex: 1, padding: '10px', borderRadius: 'var(--r)', cursor: 'pointer',
                    border: billingCycle === 'monthly' ? '2px solid var(--rv)' : '.5px solid var(--bd)',
                    background: billingCycle === 'monthly' ? 'var(--rvlt)' : 'var(--bg)',
                    fontFamily: mono, fontSize: '11px', color: 'var(--tx)',
                  }}>
                  Monthly — ${tierConfig.monthlyPrice}/mo
                </button>
                <button onClick={() => setBillingCycle('yearly')}
                  style={{
                    flex: 1, padding: '10px', borderRadius: 'var(--r)', cursor: 'pointer',
                    border: billingCycle === 'yearly' ? '2px solid var(--rv)' : '.5px solid var(--bd)',
                    background: billingCycle === 'yearly' ? 'var(--rvlt)' : 'var(--bg)',
                    fontFamily: mono, fontSize: '11px', color: 'var(--tx)',
                  }}>
                  Annual — ${tierConfig.yearlyPrice}/yr
                  <span style={{ color: 'var(--rv)', marginLeft: '4px' }}>
                    save {Math.round((1 - tierConfig.yearlyPrice! / (tierConfig.monthlyPrice * 12)) * 100)}%
                  </span>
                </button>
              </div>
            )}

            <button onClick={() => setStep(2)} style={{
              width: '100%', padding: '12px', fontFamily: mono, fontSize: '12px', fontWeight: 500,
              background: 'var(--rv)', color: '#fff', border: 'none', borderRadius: 'var(--r)', cursor: 'pointer',
            }}>
              Continue
            </button>
          </div>
        )}

        {/* Step 2: Business profile */}
        {step === 2 && (
          <div>
            <div style={{ fontFamily: mono, fontSize: '9px', color: 'var(--rv)', textTransform: 'uppercase', letterSpacing: '1.5px', marginBottom: '6px' }}>
              Step 2 of 3
            </div>
            <h1 style={{ fontFamily: serif, fontSize: '22px', fontWeight: 700, color: 'var(--rvdk)', marginBottom: '16px' }}>
              {selectedTier === 'guide' ? 'Your guide profile' : 'Your business'}
            </h1>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginBottom: '20px' }}>
              <label style={{ fontFamily: mono, fontSize: '10px', color: 'var(--tx2)' }}>
                {selectedTier === 'guide' ? 'Your name' : 'Business name'} *
                <input type="text" value={form.businessName}
                  onChange={e => setForm(f => ({ ...f, businessName: e.target.value }))}
                  style={{ display: 'block', width: '100%', padding: '8px 12px', marginTop: '4px', border: '.5px solid var(--bd2)', borderRadius: 'var(--r)', fontFamily: mono, fontSize: '12px', background: 'var(--bg)', color: 'var(--tx)' }}
                />
              </label>
              <label style={{ fontFamily: mono, fontSize: '10px', color: 'var(--tx2)' }}>
                Email *
                <input type="email" value={form.email}
                  onChange={e => setForm(f => ({ ...f, email: e.target.value }))}
                  style={{ display: 'block', width: '100%', padding: '8px 12px', marginTop: '4px', border: '.5px solid var(--bd2)', borderRadius: 'var(--r)', fontFamily: mono, fontSize: '12px', background: 'var(--bg)', color: 'var(--tx)' }}
                />
              </label>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                <label style={{ fontFamily: mono, fontSize: '10px', color: 'var(--tx2)' }}>
                  Phone
                  <input type="tel" value={form.phone}
                    onChange={e => setForm(f => ({ ...f, phone: e.target.value }))}
                    style={{ display: 'block', width: '100%', padding: '8px 12px', marginTop: '4px', border: '.5px solid var(--bd2)', borderRadius: 'var(--r)', fontFamily: mono, fontSize: '12px', background: 'var(--bg)', color: 'var(--tx)' }}
                  />
                </label>
                <label style={{ fontFamily: mono, fontSize: '10px', color: 'var(--tx2)' }}>
                  Website
                  <input type="text" value={form.website} placeholder="yourbusiness.com"
                    onChange={e => setForm(f => ({ ...f, website: e.target.value }))}
                    style={{ display: 'block', width: '100%', padding: '8px 12px', marginTop: '4px', border: '.5px solid var(--bd2)', borderRadius: 'var(--r)', fontFamily: mono, fontSize: '12px', background: 'var(--bg)', color: 'var(--tx)' }}
                  />
                </label>
              </div>
              <label style={{ fontFamily: mono, fontSize: '10px', color: 'var(--tx2)' }}>
                Description
                <textarea value={form.description}
                  onChange={e => setForm(f => ({ ...f, description: e.target.value }))}
                  placeholder="Tell paddlers about your business..."
                  rows={3}
                  style={{ display: 'block', width: '100%', padding: '8px 12px', marginTop: '4px', border: '.5px solid var(--bd2)', borderRadius: 'var(--r)', fontFamily: mono, fontSize: '12px', background: 'var(--bg)', color: 'var(--tx)', resize: 'vertical' }}
                />
              </label>

              {/* Specialty tags for guides */}
              {selectedTier === 'guide' && (
                <div>
                  <div style={{ fontFamily: mono, fontSize: '10px', color: 'var(--tx2)', marginBottom: '6px' }}>Specialties</div>
                  <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
                    {specialtyOptions.map(tag => (
                      <button key={tag} type="button" onClick={() => toggleTag(tag)}
                        style={{
                          fontFamily: mono, fontSize: '9px', padding: '4px 10px', borderRadius: '12px', cursor: 'pointer',
                          border: form.specialtyTags.includes(tag) ? '.5px solid var(--am)' : '.5px solid var(--bd2)',
                          background: form.specialtyTags.includes(tag) ? 'var(--amlt)' : 'var(--bg)',
                          color: form.specialtyTags.includes(tag) ? 'var(--am)' : 'var(--tx3)',
                        }}>
                        {tag}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <div style={{ display: 'flex', gap: '8px' }}>
              <button onClick={() => setStep(1)} style={{
                padding: '12px 20px', fontFamily: mono, fontSize: '12px',
                background: 'var(--bg)', color: 'var(--tx2)', border: '.5px solid var(--bd2)', borderRadius: 'var(--r)', cursor: 'pointer',
              }}>
                Back
              </button>
              <button onClick={() => { if (form.businessName && form.email) setStep(3); else setError('Name and email required') }}
                style={{
                  flex: 1, padding: '12px', fontFamily: mono, fontSize: '12px', fontWeight: 500,
                  background: 'var(--rv)', color: '#fff', border: 'none', borderRadius: 'var(--r)', cursor: 'pointer',
                }}>
                Continue — Select Rivers
              </button>
            </div>
          </div>
        )}

        {/* Step 3: Select rivers */}
        {step === 3 && (
          <div>
            <div style={{ fontFamily: mono, fontSize: '9px', color: 'var(--rv)', textTransform: 'uppercase', letterSpacing: '1.5px', marginBottom: '6px' }}>
              Step 3 of 3
            </div>
            <h1 style={{ fontFamily: serif, fontSize: '22px', fontWeight: 700, color: 'var(--rvdk)', marginBottom: '4px' }}>
              Select your rivers
            </h1>
            <div style={{ fontFamily: mono, fontSize: '10px', color: 'var(--tx3)', marginBottom: '16px' }}>
              {selectedRivers.length} of {maxRivers} rivers selected
            </div>

            {/* River search */}
            <input type="text" value={riverSearch}
              onChange={e => setRiverSearch(e.target.value)}
              placeholder="Search rivers by name or state..."
              style={{ width: '100%', padding: '10px 14px', border: '.5px solid var(--bd2)', borderRadius: 'var(--r)', fontFamily: mono, fontSize: '12px', background: 'var(--bg)', color: 'var(--tx)', marginBottom: '8px' }}
            />

            {/* Search results */}
            {filteredRivers.length > 0 && (
              <div style={{ border: '.5px solid var(--bd)', borderRadius: 'var(--r)', marginBottom: '12px', maxHeight: '200px', overflowY: 'auto' }}>
                {filteredRivers.map(r => {
                  const isSelected = selectedRivers.includes(r.id)
                  return (
                    <button key={r.id} onClick={() => toggleRiver(r.id)}
                      style={{
                        display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%',
                        padding: '8px 12px', border: 'none', borderBottom: '.5px solid var(--bd)',
                        background: isSelected ? 'var(--rvlt)' : 'var(--bg)', cursor: 'pointer', textAlign: 'left',
                      }}>
                      <div>
                        <span style={{ fontFamily: mono, fontSize: '12px', fontWeight: 500 }}>{r.n}</span>
                        <span style={{ fontFamily: mono, fontSize: '10px', color: 'var(--tx3)', marginLeft: '8px' }}>{r.stateName}</span>
                      </div>
                      <span style={{ fontFamily: mono, fontSize: '10px', color: isSelected ? 'var(--rv)' : 'var(--tx3)' }}>
                        {isSelected ? '✓ Selected' : 'Select'}
                      </span>
                    </button>
                  )
                })}
              </div>
            )}

            {/* Selected rivers */}
            {selectedRivers.length > 0 && (
              <div style={{ marginBottom: '16px' }}>
                <div style={{ fontFamily: mono, fontSize: '9px', color: 'var(--tx3)', textTransform: 'uppercase', letterSpacing: '.5px', marginBottom: '6px' }}>
                  Your rivers
                </div>
                <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
                  {selectedRivers.map(id => {
                    const river = ALL_RIVERS.find(r => r.id === id)
                    return (
                      <span key={id} style={{
                        fontFamily: mono, fontSize: '10px', padding: '4px 10px', borderRadius: '12px',
                        background: 'var(--rvlt)', color: 'var(--rvdk)', border: '.5px solid var(--rvmd)',
                        display: 'flex', alignItems: 'center', gap: '4px',
                      }}>
                        {river?.n || id}
                        <button onClick={() => toggleRiver(id)} style={{
                          background: 'none', border: 'none', color: 'var(--rv)', cursor: 'pointer', fontSize: '12px', lineHeight: 1, padding: 0,
                        }}>×</button>
                      </span>
                    )
                  })}
                </div>
              </div>
            )}

            {/* Summary */}
            <div style={{ background: 'var(--bg2)', border: '.5px solid var(--bd)', borderRadius: 'var(--r)', padding: '14px', marginBottom: '16px' }}>
              <div style={{ fontFamily: mono, fontSize: '9px', color: 'var(--tx3)', textTransform: 'uppercase', letterSpacing: '.5px', marginBottom: '8px' }}>
                Order Summary
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontFamily: mono, fontSize: '12px', marginBottom: '4px' }}>
                <span>{tierConfig.name} — {billingCycle}</span>
                <span style={{ fontWeight: 600, color: tierColors[selectedTier] }}>
                  {tierConfig.monthlyPrice === 0 ? 'Free' :
                   billingCycle === 'yearly' && tierConfig.yearlyPrice ? `$${tierConfig.yearlyPrice}/yr` :
                   `$${tierConfig.monthlyPrice}/mo`}
                </span>
              </div>
              <div style={{ fontFamily: mono, fontSize: '10px', color: 'var(--tx3)' }}>
                {form.businessName || 'Your business'} · {selectedRivers.length} river{selectedRivers.length !== 1 ? 's' : ''}
              </div>
            </div>

            {error && <div style={{ fontFamily: mono, fontSize: '10px', color: 'var(--dg)', marginBottom: '8px' }}>{error}</div>}

            <div style={{ display: 'flex', gap: '8px' }}>
              <button onClick={() => setStep(2)} style={{
                padding: '12px 20px', fontFamily: mono, fontSize: '12px',
                background: 'var(--bg)', color: 'var(--tx2)', border: '.5px solid var(--bd2)', borderRadius: 'var(--r)', cursor: 'pointer',
              }}>
                Back
              </button>
              <button onClick={handleSubmit} disabled={submitting || selectedRivers.length === 0}
                style={{
                  flex: 1, padding: '12px', fontFamily: mono, fontSize: '12px', fontWeight: 500,
                  background: selectedRivers.length > 0 ? 'var(--rv)' : 'var(--bg3)',
                  color: selectedRivers.length > 0 ? '#fff' : 'var(--tx3)',
                  border: 'none', borderRadius: 'var(--r)', cursor: selectedRivers.length > 0 ? 'pointer' : 'default',
                  opacity: submitting ? 0.6 : 1,
                }}>
                {submitting ? 'Processing...' :
                 selectedTier === 'listed' ? 'Claim Free Listing' :
                 selectedTier === 'destination' ? 'Contact Sales' :
                 `Continue to Payment — $${billingCycle === 'yearly' && tierConfig.yearlyPrice ? tierConfig.yearlyPrice : tierConfig.monthlyPrice}${billingCycle === 'yearly' ? '/yr' : '/mo'}`}
              </button>
            </div>
          </div>
        )}
      </div>
    </main>
  )
}
