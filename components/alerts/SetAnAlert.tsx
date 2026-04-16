'use client'

// Three-card alert chooser with inline expanding forms. Replaces
// the old AlertSubscriber email box + green Pro upsell. Cards are:
//   1. Flow alert    — Pro, min/max CFS band
//   2. Hatch alert   — Pro, species dropdown
//   3. Release alert — free, dammed rivers only
//
// Selecting a card highlights it and slides the matching form open
// directly beneath the cards (not a modal). Pro gating surfaces as
// an inline note — form still fillable — and is enforced server-
// side on submit via HTTP 403.

import { useEffect, useMemo, useState } from 'react'
import Link from 'next/link'
import { supabase } from '@/lib/supabase'

const mono = "'IBM Plex Mono', monospace"
const serif = "'Playfair Display', serif"

// Short list of the most common mayfly/caddis hatches paddlers
// target. The server accepts any string in `hatch_name`, but
// constraining to a dropdown keeps the leaderboard/search clean.
const HATCH_SPECIES = [
  'Hex (Hexagenia)',
  'Sulphur',
  'Caddis',
  'PMD (Pale Morning Dun)',
  'BWO (Blue-Winged Olive)',
  'March Brown',
  'Isonychia',
  'Stonefly',
  'Tricos',
  'Terrestrials',
]

interface RiverOption {
  id: string
  name: string
  stateKey: string
  stateName: string
}

interface Props {
  rivers: RiverOption[]
  dammedRiverIds: string[]
}

type CardKey = 'flow' | 'hatch' | 'release'

export default function SetAnAlert({ rivers, dammedRiverIds }: Props) {
  const [userId, setUserId] = useState<string | null>(null)
  const [authedEmail, setAuthedEmail] = useState<string | null>(null)
  const [isPro, setIsPro] = useState(false)
  const [selected, setSelected] = useState<CardKey | null>(null)

  // On mount: look up the current auth state so forms can pre-fill
  // email and gate Pro features. We also hit user_profiles once for
  // is_pro — the client SDK has no direct access to that field.
  useEffect(() => {
    supabase.auth.getUser().then(async ({ data }) => {
      const u = data.user
      if (!u) return
      setUserId(u.id)
      setAuthedEmail(u.email ?? null)
      const { data: profile } = await supabase
        .from('user_profiles')
        .select('is_pro')
        .eq('id', u.id)
        .maybeSingle()
      setIsPro(!!profile?.is_pro)
    })
  }, [])

  const dammedRivers = useMemo(
    () => rivers.filter(r => dammedRiverIds.includes(r.id)),
    [rivers, dammedRiverIds],
  )

  return (
    <div style={{ padding: '24px 28px 8px' }}>
      <h2 style={{ fontFamily: serif, fontSize: '20px', fontWeight: 700, color: '#042C53', margin: '0 0 4px' }}>
        Set an alert
      </h2>
      <p style={{ fontFamily: mono, fontSize: '11px', color: 'var(--tx3)', margin: '0 0 16px' }}>
        Get notified when conditions change on your rivers.
      </p>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '12px', marginBottom: '14px' }}>
        <Card
          icon={FlowIcon}
          title="Flow alert"
          description="Get notified when a river hits your target CFS range"
          ctaLabel="Set flow alert →"
          active={selected === 'flow'}
          onClick={() => setSelected(selected === 'flow' ? null : 'flow')}
        />
        <Card
          icon={HatchIcon}
          title="Hatch alert"
          description="Get notified when water temperature triggers a hatch on your river"
          ctaLabel="Set hatch alert →"
          active={selected === 'hatch'}
          onClick={() => setSelected(selected === 'hatch' ? null : 'hatch')}
        />
        <Card
          icon={ReleaseIcon}
          title="Dam release alert"
          description="Get notified when a scheduled dam release is posted for your river"
          ctaLabel="Set release alert →"
          active={selected === 'release'}
          onClick={() => setSelected(selected === 'release' ? null : 'release')}
        />
      </div>

      {/* Expanding form area. max-height trick animates the height
          from 0 to a generous ceiling without measuring content. */}
      <div
        style={{
          maxHeight: selected ? '620px' : '0px',
          overflow: 'hidden',
          transition: 'max-height 300ms ease-in-out',
        }}
      >
        {selected === 'flow' && (
          <FlowForm rivers={rivers} userId={userId} authedEmail={authedEmail} isPro={isPro} />
        )}
        {selected === 'hatch' && (
          <HatchForm rivers={rivers} userId={userId} authedEmail={authedEmail} isPro={isPro} />
        )}
        {selected === 'release' && (
          <ReleaseForm rivers={dammedRivers} userId={userId} authedEmail={authedEmail} />
        )}
      </div>
    </div>
  )
}

// ── Cards ──────────────────────────────────────────────────────────

function Card({ icon: Icon, title, description, ctaLabel, active, onClick }: {
  icon: React.ComponentType<{ size?: number; color?: string }>
  title: string
  description: string
  ctaLabel: string
  active: boolean
  onClick: () => void
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      style={{
        textAlign: 'left', cursor: 'pointer',
        background: 'var(--bg)',
        border: `1px solid ${active ? 'var(--rvdk)' : 'var(--bd)'}`,
        boxShadow: active ? '0 0 0 3px rgba(8,80,65,.08)' : 'none',
        borderRadius: 'var(--rlg)',
        padding: '16px',
        display: 'flex', flexDirection: 'column', gap: '8px',
        transition: 'border-color 150ms, box-shadow 150ms',
      }}
    >
      <Icon size={24} color={active ? 'var(--rvdk)' : '#042C53'} />
      <div style={{ fontFamily: serif, fontSize: '16px', fontWeight: 700, color: '#042C53' }}>{title}</div>
      <div style={{ fontFamily: mono, fontSize: '11px', color: 'var(--tx2)', lineHeight: 1.5, flex: 1 }}>{description}</div>
      <div style={{ fontFamily: mono, fontSize: '11px', color: active ? 'var(--rvdk)' : 'var(--tx2)', fontWeight: 500, marginTop: '4px' }}>
        {ctaLabel}
      </div>
    </button>
  )
}

// ── Forms ──────────────────────────────────────────────────────────

interface FormProps {
  rivers: RiverOption[]
  userId: string | null
  authedEmail: string | null
}
interface ProFormProps extends FormProps {
  isPro: boolean
}

function FlowForm({ rivers, userId, authedEmail, isPro }: ProFormProps) {
  const [riverId, setRiverId] = useState('')
  const [minCfs, setMinCfs] = useState('')
  const [maxCfs, setMaxCfs] = useState('')
  const [email, setEmail] = useState(authedEmail ?? '')
  useEffect(() => { if (authedEmail) setEmail(authedEmail) }, [authedEmail])

  return (
    <FormShell proNote={!isPro} proFeature="Flow alerts">
      <FormRow>
        <RiverSelect value={riverId} onChange={setRiverId} rivers={rivers} />
      </FormRow>
      <FormRow cols={2}>
        <Field label="Min CFS">
          <input type="number" min={0} value={minCfs} onChange={e => setMinCfs(e.target.value)} style={inputStyle} />
        </Field>
        <Field label="Max CFS">
          <input type="number" min={0} value={maxCfs} onChange={e => setMaxCfs(e.target.value)} style={inputStyle} />
        </Field>
      </FormRow>
      <FormRow>
        <EmailField value={email} onChange={setEmail} authed={!!authedEmail} />
      </FormRow>
      <SubmitButton
        label="Set flow alert"
        disabled={!riverId || !email.includes('@') || (!minCfs && !maxCfs)}
        onSubmit={async () => {
          const river = rivers.find(r => r.id === riverId)!
          const res = await fetch('/api/alerts', {
            method: 'POST', headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              userId, email, riverId,
              riverName: river.name, stateKey: river.stateKey,
              minCfs: minCfs || null, maxCfs: maxCfs || null,
            }),
          })
          return res
        }}
      />
    </FormShell>
  )
}

function HatchForm({ rivers, userId, authedEmail, isPro }: ProFormProps) {
  const [riverId, setRiverId] = useState('')
  const [species, setSpecies] = useState(HATCH_SPECIES[0])
  const [email, setEmail] = useState(authedEmail ?? '')
  useEffect(() => { if (authedEmail) setEmail(authedEmail) }, [authedEmail])

  return (
    <FormShell proNote={!isPro} proFeature="Hatch alerts">
      <FormRow>
        <RiverSelect value={riverId} onChange={setRiverId} rivers={rivers} />
      </FormRow>
      <FormRow>
        <Field label="Species">
          <select value={species} onChange={e => setSpecies(e.target.value)} style={inputStyle}>
            {HATCH_SPECIES.map(s => <option key={s} value={s}>{s}</option>)}
          </select>
        </Field>
      </FormRow>
      <FormRow>
        <EmailField value={email} onChange={setEmail} authed={!!authedEmail} />
      </FormRow>
      <SubmitButton
        label="Set hatch alert"
        disabled={!riverId || !email.includes('@')}
        onSubmit={async () => {
          const river = rivers.find(r => r.id === riverId)!
          const res = await fetch('/api/hatch-alerts', {
            method: 'POST', headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              userId, email, riverId,
              riverName: river.name, stateKey: river.stateKey,
              hatchName: species, species,
            }),
          })
          return res
        }}
      />
    </FormShell>
  )
}

function ReleaseForm({ rivers, userId, authedEmail }: FormProps) {
  const [riverId, setRiverId] = useState('')
  const [email, setEmail] = useState(authedEmail ?? '')
  useEffect(() => { if (authedEmail) setEmail(authedEmail) }, [authedEmail])

  if (rivers.length === 0) {
    return (
      <FormShell>
        <div style={{ fontFamily: mono, fontSize: '11px', color: 'var(--tx3)' }}>
          No dammed rivers in the catalog with scheduled releases.
        </div>
      </FormShell>
    )
  }

  return (
    <FormShell>
      <FormRow>
        <RiverSelect value={riverId} onChange={setRiverId} rivers={rivers} labelOverride="Dammed river" />
      </FormRow>
      <FormRow>
        <EmailField value={email} onChange={setEmail} authed={!!authedEmail} />
      </FormRow>
      <SubmitButton
        label="Set release alert"
        disabled={!riverId || !email.includes('@')}
        onSubmit={async () => {
          const res = await fetch('/api/releases/subscribe', {
            method: 'POST', headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ userId, email, riverId }),
          })
          return res
        }}
      />
    </FormShell>
  )
}

// ── Shared form primitives ────────────────────────────────────────

function FormShell({ proNote, proFeature, children }: {
  proNote?: boolean; proFeature?: string; children: React.ReactNode;
}) {
  return (
    <div style={{
      marginTop: '4px',
      border: '.5px solid var(--bd)', borderRadius: 'var(--rlg)',
      background: 'var(--bg2)', padding: '18px',
      display: 'flex', flexDirection: 'column', gap: '12px',
    }}>
      {proNote && (
        <div style={{
          fontFamily: mono, fontSize: '10px',
          color: '#7A4D0E', background: 'var(--amlt)',
          border: '.5px solid var(--am)', borderRadius: 'var(--r)',
          padding: '8px 10px',
        }}>
          {proFeature} are a Pro feature — $1.99/month.{' '}
          <Link href="/pro" style={{ color: 'var(--rvdk)', fontWeight: 600 }}>Upgrade →</Link>
        </div>
      )}
      {children}
    </div>
  )
}

function FormRow({ cols = 1, children }: { cols?: number; children: React.ReactNode }) {
  return (
    <div style={{ display: 'grid', gridTemplateColumns: `repeat(${cols}, 1fr)`, gap: '10px' }}>
      {children}
    </div>
  )
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '3px' }}>
      <label style={{ fontFamily: mono, fontSize: '9px', color: 'var(--tx3)', textTransform: 'uppercase', letterSpacing: '.3px' }}>{label}</label>
      {children}
    </div>
  )
}

function RiverSelect({ value, onChange, rivers, labelOverride }: {
  value: string; onChange: (v: string) => void; rivers: RiverOption[]; labelOverride?: string;
}) {
  // Group by state for easier scanning when the list is long.
  const byState = useMemo(() => {
    const map = new Map<string, RiverOption[]>()
    for (const r of rivers) {
      const list = map.get(r.stateName) ?? []
      list.push(r)
      map.set(r.stateName, list)
    }
    return Array.from(map.entries()).sort(([a], [b]) => a.localeCompare(b))
  }, [rivers])

  return (
    <Field label={labelOverride ?? 'River'}>
      <select value={value} onChange={e => onChange(e.target.value)} style={inputStyle}>
        <option value="">— Choose a river —</option>
        {byState.map(([state, list]) => (
          <optgroup key={state} label={state}>
            {list.map(r => <option key={r.id} value={r.id}>{r.name}</option>)}
          </optgroup>
        ))}
      </select>
    </Field>
  )
}

function EmailField({ value, onChange, authed }: { value: string; onChange: (v: string) => void; authed: boolean }) {
  return (
    <Field label="Email">
      <input
        type="email" required value={value} onChange={e => onChange(e.target.value)}
        placeholder="your@email.com"
        style={{ ...inputStyle, opacity: authed ? 0.7 : 1 }}
        readOnly={authed}
      />
    </Field>
  )
}

function SubmitButton({ label, disabled, onSubmit }: {
  label: string; disabled: boolean;
  onSubmit: () => Promise<Response>;
}) {
  const [submitting, setSubmitting] = useState(false)
  const [result, setResult] = useState<{ ok: boolean; msg: string; upgrade?: boolean } | null>(null)

  async function handleClick() {
    setSubmitting(true)
    setResult(null)
    try {
      const res = await onSubmit()
      const payload = await res.json().catch(() => ({}))
      if (res.ok) {
        setResult({ ok: true, msg: 'Alert set — we\'ll email you when it triggers.' })
      } else if (payload.error === 'pro_required') {
        setResult({ ok: false, msg: payload.message || 'Pro required.', upgrade: true })
      } else {
        setResult({ ok: false, msg: payload.error || 'Could not create alert.' })
      }
    } catch {
      setResult({ ok: false, msg: 'Network error. Try again.' })
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
      <button
        type="button" disabled={disabled || submitting} onClick={handleClick}
        style={{
          fontFamily: mono, fontSize: '12px', fontWeight: 500,
          background: 'var(--rvdk)', color: '#fff',
          border: 'none', borderRadius: 'var(--r)',
          padding: '10px 18px', cursor: disabled || submitting ? 'not-allowed' : 'pointer',
          opacity: disabled || submitting ? 0.55 : 1,
          alignSelf: 'flex-start',
        }}
      >{submitting ? 'Saving…' : label}</button>
      {result && (
        <div style={{
          fontFamily: mono, fontSize: '11px', lineHeight: 1.5,
          color: result.ok ? '#085041' : '#A32D2D',
          background: result.ok ? 'rgba(29,158,117,0.08)' : 'rgba(163,45,45,0.08)',
          padding: '8px 12px', borderRadius: 'var(--r)',
          border: `.5px solid ${result.ok ? 'rgba(29,158,117,0.3)' : 'rgba(163,45,45,0.3)'}`,
        }}>
          {result.msg}
          {result.upgrade && (
            <> <Link href="/pro" style={{ color: 'var(--rvdk)', fontWeight: 600 }}>Upgrade to Pro →</Link></>
          )}
        </div>
      )}
    </div>
  )
}

const inputStyle: React.CSSProperties = {
  fontFamily: mono, fontSize: '12px',
  background: 'var(--bg)', color: 'var(--tx)',
  border: '.5px solid var(--bd)', borderRadius: 'var(--r)',
  padding: '8px 10px', width: '100%',
}

// ── Icons ──────────────────────────────────────────────────────────

function FlowIcon({ size = 24, color = '#042C53' }: { size?: number; color?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={1.6} strokeLinecap="round" strokeLinejoin="round">
      <path d="M3 9c3 0 3 2 6 2s3-2 6-2 3 2 6 2" />
      <path d="M3 14c3 0 3 2 6 2s3-2 6-2 3 2 6 2" />
      <path d="M3 19c3 0 3 2 6 2s3-2 6-2 3 2 6 2" />
    </svg>
  )
}
function HatchIcon({ size = 24, color = '#042C53' }: { size?: number; color?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={1.6} strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 3v6" />
      <path d="M12 15v6" />
      <path d="M4 12h16" />
      <path d="M5 7c2 2 5 2 7 0 2 2 5 2 7 0" />
      <path d="M5 17c2-2 5-2 7 0 2-2 5-2 7 0" />
      <circle cx="12" cy="12" r="1.5" fill={color} />
    </svg>
  )
}
function ReleaseIcon({ size = 24, color = '#042C53' }: { size?: number; color?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={1.6} strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="4" width="18" height="10" rx="1" />
      <path d="M7 4v10" />
      <path d="M12 4v10" />
      <path d="M17 4v10" />
      <path d="M3 14l3 6" />
      <path d="M21 14l-3 6" />
    </svg>
  )
}
