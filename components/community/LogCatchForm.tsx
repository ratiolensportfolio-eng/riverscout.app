'use client'

// Fish-catch submission modal. Opens from a "Log a catch" button on
// the river page. Extracts EXIF GPS + timestamp client-side via
// `exifr` so the server-side proximity check has something to verify
// against — photos with no EXIF fall through to 'flagged' for manual
// review.
//
// Flow:
//   1. User picks a photo → exifr parses GPS + timestamp → we show
//      the extracted coords so they can see what will be submitted.
//   2. On submit: POST the file to /api/catches/upload → get a
//      public URL → POST metadata + EXIF + URL to /api/catches.
//   3. Display the verification result inline (verified / flagged /
//      rejected) so the user sees why.
//
// Modern iPhones default to HEIC which exifr handles. We also allow
// JPEG/PNG/WebP.

import { useEffect, useState } from 'react'
import exifr from 'exifr'
import { supabase } from '@/lib/supabase'
import { LEADERBOARD_SPECIES, type VerificationStatus } from '@/types'

const mono = "'IBM Plex Mono', monospace"
const serif = "'Playfair Display', serif"

interface Props {
  riverId: string
  riverName: string
  open: boolean
  onClose: () => void
  onSubmitted?: () => void
}

interface ExifData {
  lat: number | null
  lng: number | null
  timestamp: string | null
}

interface SubmissionResult {
  status: VerificationStatus
  proximityReason: string
  visionNotes: string
  ceilingViolation: boolean
}

export default function LogCatchForm({ riverId, riverName, open, onClose, onSubmitted }: Props) {
  const [userId, setUserId] = useState<string | null>(null)
  const [authChecked, setAuthChecked] = useState(false)

  const [catchDate, setCatchDate] = useState(() => new Date().toISOString().slice(0, 10))
  const [species, setSpecies] = useState<string>(LEADERBOARD_SPECIES[0])
  const [weightLbs, setWeightLbs] = useState('')
  const [lengthInches, setLengthInches] = useState('')
  const [catchAndRelease, setCatchAndRelease] = useState(true)
  const [notes, setNotes] = useState('')

  const [photoFile, setPhotoFile] = useState<File | null>(null)
  const [photoPreview, setPhotoPreview] = useState<string | null>(null)
  const [exif, setExif] = useState<ExifData>({ lat: null, lng: null, timestamp: null })
  const [exifError, setExifError] = useState<string | null>(null)

  const [submitting, setSubmitting] = useState(false)
  const [progress, setProgress] = useState<string>('')
  const [result, setResult] = useState<SubmissionResult | null>(null)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!open) return
    supabase.auth.getUser().then(({ data }) => {
      setUserId(data.user?.id ?? null)
      setAuthChecked(true)
    })
  }, [open])

  // Clean up the object URL when photo changes or modal closes.
  useEffect(() => {
    return () => { if (photoPreview) URL.revokeObjectURL(photoPreview) }
  }, [photoPreview])

  if (!open) return null

  async function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0] ?? null
    if (!file) return
    setPhotoFile(file)
    setPhotoPreview(URL.createObjectURL(file))
    setExifError(null)
    try {
      // exifr auto-detects GPS + date. `gps: true` pulls the decoded
      // lat/lng (already in decimal degrees). DateTimeOriginal is the
      // capture timestamp from the camera.
      const parsed = await exifr.parse(file, { gps: true, pick: ['DateTimeOriginal', 'CreateDate'] })
      const lat = typeof parsed?.latitude === 'number' ? parsed.latitude : null
      const lng = typeof parsed?.longitude === 'number' ? parsed.longitude : null
      const rawTs = parsed?.DateTimeOriginal || parsed?.CreateDate
      const timestamp = rawTs instanceof Date ? rawTs.toISOString()
        : typeof rawTs === 'string' ? rawTs
        : null
      setExif({ lat, lng, timestamp })
      if (lat == null || lng == null) {
        setExifError('No GPS data in this photo. Catch will be flagged for manual review.')
      }
    } catch (err) {
      console.warn('[catch-form] exif parse failed:', err)
      setExif({ lat: null, lng: null, timestamp: null })
      setExifError('Could not read photo metadata. Catch will be flagged for manual review.')
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError(null)
    if (!userId) { setError('Please sign in to submit a catch.'); return }
    if (!photoFile) { setError('A photo is required for catch verification.'); return }

    setSubmitting(true)
    try {
      // Upload the photo first so the server has a URL to send to
      // Claude Vision. Upload route enforces the 10MB / type allowlist.
      setProgress('Uploading photo…')
      const form = new FormData()
      form.append('file', photoFile)
      form.append('riverId', riverId)
      form.append('userId', userId)
      const upRes = await fetch('/api/catches/upload', { method: 'POST', body: form })
      const upPayload = await upRes.json()
      if (!upRes.ok) throw new Error(upPayload.error || 'Photo upload failed')

      // Then POST the catch metadata. AI + proximity verification run
      // server-side; can take ~5-10s for the Vision call.
      setProgress('Verifying catch…')
      const res = await fetch('/api/catches', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId, riverId, species, catchDate,
          photoUrl: upPayload.url,
          weightLbs: weightLbs || null,
          lengthInches: lengthInches || null,
          photoExifLat: exif.lat,
          photoExifLng: exif.lng,
          photoExifTimestamp: exif.timestamp,
          catchAndRelease,
          notes: notes.trim() || null,
        }),
      })
      const payload = await res.json()
      if (!res.ok) throw new Error(payload.error || 'Submit failed')

      setResult({
        status: payload.verification.status,
        proximityReason: payload.verification.proximity?.reason ?? '',
        visionNotes: payload.verification.vision?.notes ?? '',
        ceilingViolation: !!payload.verification.ceilingViolation,
      })
      onSubmitted?.()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Submit failed')
    } finally {
      setSubmitting(false)
      setProgress('')
    }
  }

  return (
    <div
      role="dialog" aria-modal="true"
      onClick={onClose}
      style={{
        position: 'fixed', inset: 0, background: 'rgba(0,0,0,.5)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        zIndex: 1000, padding: '20px',
      }}
    >
      <div
        onClick={e => e.stopPropagation()}
        style={{
          background: 'var(--bg)', borderRadius: 'var(--r)',
          maxWidth: '560px', width: '100%', maxHeight: '90vh', overflow: 'auto',
          padding: '24px', border: '.5px solid var(--bd)',
        }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '14px' }}>
          <div>
            <h2 style={{ fontFamily: serif, fontSize: '20px', margin: '0 0 4px', color: '#042C53' }}>Log a catch</h2>
            <div style={{ fontFamily: mono, fontSize: '11px', color: 'var(--tx3)' }}>{riverName}</div>
          </div>
          <button
            type="button" onClick={onClose} aria-label="Close"
            style={{ background: 'transparent', border: 'none', fontSize: '24px', color: 'var(--tx3)', cursor: 'pointer', lineHeight: 1 }}
          >×</button>
        </div>

        {authChecked && !userId && (
          <div style={{ padding: '14px', background: 'var(--amlt)', borderRadius: 'var(--r)', marginBottom: '14px', fontFamily: mono, fontSize: '12px', color: '#7A4D0E' }}>
            Sign in required to log a catch.{' '}
            <a href="/login?next=/" style={{ color: 'var(--rvdk)' }}>Sign in →</a>
          </div>
        )}

        {result ? (
          <ResultPanel result={result} onClose={onClose} />
        ) : (
          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <Field label="Photo">
              <input
                type="file" accept="image/jpeg,image/png,image/webp,image/heic"
                onChange={handleFileChange} required
                style={{ ...inputStyle, padding: '6px' }}
              />
              {photoPreview && (
                <div style={{ marginTop: '8px' }}>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={photoPreview} alt="Catch preview" style={{ maxWidth: '100%', maxHeight: '200px', borderRadius: 'var(--r)', border: '.5px solid var(--bd)' }} />
                  <div style={{ fontFamily: mono, fontSize: '10px', color: exif.lat != null ? 'var(--rvdk)' : 'var(--tx3)', marginTop: '4px' }}>
                    {exif.lat != null && exif.lng != null
                      ? `GPS: ${exif.lat.toFixed(5)}, ${exif.lng.toFixed(5)}${exif.timestamp ? ' · ' + new Date(exif.timestamp).toLocaleString() : ''}`
                      : 'No GPS metadata'}
                  </div>
                  {exifError && (
                    <div style={{ fontFamily: mono, fontSize: '10px', color: '#7A4D0E', marginTop: '2px' }}>{exifError}</div>
                  )}
                </div>
              )}
            </Field>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
              <Field label="Species">
                <select value={species} onChange={e => setSpecies(e.target.value)} style={inputStyle}>
                  {LEADERBOARD_SPECIES.map(s => <option key={s} value={s}>{s}</option>)}
                </select>
              </Field>
              <Field label="Catch date">
                <input type="date" value={catchDate} onChange={e => setCatchDate(e.target.value)} required style={inputStyle} />
              </Field>
              <Field label="Weight (lbs)">
                <input type="number" step="0.01" min="0" value={weightLbs} onChange={e => setWeightLbs(e.target.value)} style={inputStyle} />
              </Field>
              <Field label="Length (in)">
                <input type="number" step="0.1" min="0" value={lengthInches} onChange={e => setLengthInches(e.target.value)} style={inputStyle} />
              </Field>
            </div>

            <label style={{ display: 'flex', alignItems: 'center', gap: '8px', fontFamily: mono, fontSize: '12px', color: 'var(--tx2)', cursor: 'pointer' }}>
              <input
                type="checkbox" checked={catchAndRelease}
                onChange={e => setCatchAndRelease(e.target.checked)}
              />
              Catch and release
            </label>

            <Field label="Notes (optional)">
              <textarea
                value={notes} onChange={e => setNotes(e.target.value)}
                maxLength={1000} rows={3}
                placeholder="Fly pattern, depth, time of day — anything memorable."
                style={{ ...inputStyle, resize: 'vertical', fontFamily: 'inherit' }}
              />
            </Field>

            {error && (
              <div style={{ padding: '10px', background: 'rgba(163,45,45,0.08)', color: '#A32D2D', borderRadius: 'var(--r)', fontFamily: mono, fontSize: '11px' }}>
                {error}
              </div>
            )}

            <div style={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'center', gap: '8px', marginTop: '4px' }}>
              {submitting && progress && (
                <span style={{ fontFamily: mono, fontSize: '10px', color: 'var(--tx3)', marginRight: 'auto' }}>{progress}</span>
              )}
              <button type="button" onClick={onClose} style={btnSecondary}>Cancel</button>
              <button type="submit" disabled={submitting || !userId || !photoFile} style={{ ...btnPrimary, opacity: submitting || !userId || !photoFile ? 0.6 : 1 }}>
                {submitting ? 'Submitting…' : 'Submit catch'}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  )
}

function ResultPanel({ result, onClose }: { result: SubmissionResult; onClose: () => void }) {
  const config = {
    verified: { color: '#1D9E75', bg: 'rgba(29,158,117,0.08)', title: 'Verified catch', blurb: 'Your catch is live on the leaderboard.' },
    flagged:  { color: '#BA7517', bg: 'rgba(186,117,23,0.08)', title: 'Submitted for review', blurb: 'A human will review shortly — it will appear on the leaderboard once approved.' },
    rejected: { color: '#A32D2D', bg: 'rgba(163,45,45,0.08)', title: 'Not verified', blurb: result.ceilingViolation ? 'The claimed weight exceeds the plausibility ceiling for this species.' : 'The catch did not pass verification.' },
    pending:  { color: '#7A8074', bg: 'rgba(122,128,116,0.08)', title: 'Queued', blurb: 'AI verification unavailable right now. A human will review shortly.' },
  }[result.status]

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
      <div style={{ padding: '14px', background: config.bg, color: config.color, borderRadius: 'var(--r)', border: `.5px solid ${config.color}44` }}>
        <div style={{ fontFamily: serif, fontSize: '16px', fontWeight: 600, marginBottom: '4px' }}>{config.title}</div>
        <div style={{ fontFamily: mono, fontSize: '11px', lineHeight: 1.5 }}>{config.blurb}</div>
        {(result.proximityReason || result.visionNotes) && (
          <div style={{ marginTop: '10px', paddingTop: '10px', borderTop: `.5px solid ${config.color}44`, fontFamily: mono, fontSize: '10px', opacity: 0.85, lineHeight: 1.5 }}>
            {result.proximityReason && <div>Proximity: {result.proximityReason}</div>}
            {result.visionNotes && <div>Vision: {result.visionNotes}</div>}
          </div>
        )}
      </div>
      <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
        <button type="button" onClick={onClose} style={btnPrimary}>Close</button>
      </div>
    </div>
  )
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '3px' }}>
      <label style={{ fontFamily: mono, fontSize: '10px', color: 'var(--tx3)', textTransform: 'uppercase', letterSpacing: '.3px' }}>{label}</label>
      {children}
    </div>
  )
}

const inputStyle: React.CSSProperties = {
  fontFamily: mono, fontSize: '12px',
  background: 'var(--bg)', color: 'var(--tx)',
  border: '.5px solid var(--bd)', borderRadius: 'var(--r)',
  padding: '7px 10px', width: '100%',
}

const btnPrimary: React.CSSProperties = {
  fontFamily: mono, fontSize: '11px',
  background: 'var(--rvdk)', color: '#fff',
  border: 'none', borderRadius: 'var(--r)',
  padding: '8px 16px', cursor: 'pointer',
}
const btnSecondary: React.CSSProperties = {
  fontFamily: mono, fontSize: '11px',
  background: 'transparent', color: 'var(--tx2)',
  border: '.5px solid var(--bd)', borderRadius: 'var(--r)',
  padding: '8px 16px', cursor: 'pointer',
}
