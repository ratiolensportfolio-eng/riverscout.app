'use client'

// River permit display block. Renders inside the Overview tab in
// RiverTabs above the Outfitters section. Receives the full permit row
// from the server prefetch (lib/river-page-data.ts), so this component
// is purely presentational and never fetches.
//
// Three render shapes:
//   - permit_type === 'self_issue'      → compact "free permit at kiosk" card
//   - permit_type === 'no_permit_required' → render nothing (defensive)
//   - everything else                   → full lottery / reservation card
//
// Absence of a permit row is handled by the parent (this component
// doesn't render at all when permit === null), per the spec: "Show
// nothing — do not display a 'no permit required' message."

import { useState } from 'react'
import type { RiverPermit } from '@/types'
import { PERMIT_TYPE_LABELS, PERMIT_REQUIRED_FOR_LABELS } from '@/types'

const mono = "'IBM Plex Mono', monospace"
const serif = "'Playfair Display', serif"

interface Props {
  permit: RiverPermit
}

// Format a numeric cost as "$100" or "$10/person/night" depending on
// which fields are populated. Returns null when there's no cost data
// at all so the caller can skip the line.
function formatCost(perPerson: number | null, perGroup: number | null): string | null {
  if (perPerson === null && perGroup === null) return null
  const parts: string[] = []
  if (perGroup !== null) parts.push(`$${perGroup} group fee`)
  if (perPerson !== null) parts.push(`$${perPerson}/person`)
  return parts.join(' + ')
}

// Format the permit season window. Both fields can be null, one, or both.
function formatSeason(start: string | null, end: string | null): string | null {
  if (!start && !end) return null
  if (start && end) return `${start} – ${end}`
  return start || end
}

// Format the group size range
function formatGroupSize(min: number | null, max: number | null): string | null {
  if (min === null && max === null) return null
  if (min !== null && max !== null) return `${min}–${max} people`
  if (max !== null) return `Up to ${max} people`
  return `${min}+ people`
}

export default function RiverPermits({ permit }: Props) {
  const [updateOpen, setUpdateOpen] = useState(false)

  // Defensive: caller should have filtered this out, but if a row
  // somehow has type=no_permit_required render nothing.
  if (permit.permit_type === 'no_permit_required') return null

  // Small helper to render the "Permit info outdated?" link consistently
  // at the bottom of both render shapes. Opens the inline modal.
  const outdatedLink = (
    <div style={{ marginTop: '10px', textAlign: 'right' }}>
      <button
        type="button"
        onClick={() => setUpdateOpen(true)}
        style={{
          background: 'none', border: 'none', padding: 0,
          fontFamily: mono, fontSize: '10px',
          color: 'var(--tx3)', cursor: 'pointer', textDecoration: 'underline',
        }}>
        Permit info outdated?
      </button>
    </div>
  )

  // Self-issue permits get a compact card — no application window,
  // no lottery dates, just the where-to-pick-it-up + cost line.
  if (permit.permit_type === 'self_issue') {
    return (
      <div style={{ marginBottom: '14px' }}>
        <div style={{ fontFamily: mono, fontSize: '9px', color: 'var(--am)', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '8px' }}>
          Self-Issue Permit Required
        </div>
        <div style={{
          border: '1px solid var(--am)',
          borderLeft: '4px solid var(--am)',
          borderRadius: 'var(--r)',
          background: 'var(--amlt)',
          padding: '12px 14px',
        }}>
          <div style={{ fontFamily: serif, fontSize: '14px', fontWeight: 600, color: '#7A4D0E', marginBottom: '6px' }}>
            {permit.permit_name}
          </div>
          <div style={{ fontSize: '12px', color: 'var(--tx)', lineHeight: 1.55, marginBottom: '8px' }}>
            A {permit.cost_per_person === 0 || permit.cost_per_person === null ? 'free ' : ''}self-issue permit is required for {(PERMIT_REQUIRED_FOR_LABELS[permit.required_for] || permit.required_for).toLowerCase()} on this section.
          </div>
          {permit.notes && (
            <div style={{ fontFamily: mono, fontSize: '11px', color: 'var(--tx2)', lineHeight: 1.55, marginBottom: '8px' }}>
              {permit.notes}
            </div>
          )}
          <div style={{ fontFamily: mono, fontSize: '11px', color: 'var(--tx2)', marginBottom: '4px' }}>
            <strong>Managed by:</strong> {permit.managing_agency}
          </div>
          {(permit.cost_per_person !== null || permit.cost_per_group !== null) && (
            <div style={{ fontFamily: mono, fontSize: '11px', color: 'var(--tx2)', marginBottom: '8px' }}>
              <strong>Cost:</strong> {formatCost(permit.cost_per_person, permit.cost_per_group) || 'Free'}
            </div>
          )}
          {permit.info_url && (
            <a href={permit.info_url} target="_blank" rel="noopener noreferrer" style={{
              fontFamily: mono, fontSize: '11px', color: '#7A4D0E', textDecoration: 'underline',
            }}>
              More information &#8599;
            </a>
          )}
          {permit.last_verified_year && (
            <div style={{ fontFamily: mono, fontSize: '9px', color: 'var(--tx3)', marginTop: '8px', fontStyle: 'italic' }}>
              Last verified: {permit.last_verified_year} · Always confirm with the managing agency before your trip.
            </div>
          )}
          {outdatedLink}
        </div>
        {updateOpen && (
          <PermitUpdateModal
            permit={permit}
            onClose={() => setUpdateOpen(false)}
          />
        )}
      </div>
    )
  }

  // Full lottery / reservation card for everything else.
  const cost = formatCost(permit.cost_per_person, permit.cost_per_group)
  const season = formatSeason(permit.permit_season_start, permit.permit_season_end)
  const groupSize = formatGroupSize(permit.group_size_min, permit.group_size_max)
  const hasApplicationWindow = !!(permit.application_opens || permit.application_closes || permit.results_date)

  return (
    <div style={{ marginBottom: '14px' }}>
      <div style={{ fontFamily: mono, fontSize: '9px', color: 'var(--dg)', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '8px' }}>
        Permit Required
      </div>
      <div style={{
        border: '1px solid var(--dg)',
        borderLeft: '4px solid var(--dg)',
        borderRadius: 'var(--r)',
        background: 'var(--dglt)',
        padding: '14px 16px',
      }}>
        {/* Warning line */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '10px' }}>
          <span style={{ fontSize: '14px', color: 'var(--dg)' }}>&#9888;</span>
          <span style={{ fontFamily: mono, fontSize: '11px', color: 'var(--dg)', fontWeight: 600 }}>
            This river requires a permit for {(PERMIT_REQUIRED_FOR_LABELS[permit.required_for] || permit.required_for).toLowerCase()}
          </span>
        </div>

        {/* Permit name + agency */}
        <div style={{ fontFamily: serif, fontSize: '17px', fontWeight: 700, color: '#5C1A1A', lineHeight: 1.3, marginBottom: '4px' }}>
          {permit.permit_name}
        </div>
        <div style={{ fontFamily: mono, fontSize: '11px', color: 'var(--tx2)', marginBottom: '4px' }}>
          <strong>Managed by:</strong> {permit.managing_agency}
        </div>
        <div style={{ fontFamily: mono, fontSize: '11px', color: 'var(--tx2)', marginBottom: '4px' }}>
          <strong>Type:</strong> {PERMIT_TYPE_LABELS[permit.permit_type]}
        </div>
        <div style={{ fontFamily: mono, fontSize: '11px', color: 'var(--tx2)', marginBottom: '14px' }}>
          <strong>Required for:</strong> {PERMIT_REQUIRED_FOR_LABELS[permit.required_for] || permit.required_for}
        </div>

        {/* Application window — only when populated */}
        {hasApplicationWindow && (
          <div style={{ marginBottom: '14px' }}>
            <div style={{ fontFamily: mono, fontSize: '9px', color: 'var(--tx3)', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '6px' }}>
              Application Window
            </div>
            {permit.application_opens && (
              <div style={{ fontFamily: mono, fontSize: '11px', color: 'var(--tx)', marginBottom: '2px' }}>
                <strong>Opens:</strong> {permit.application_opens}
              </div>
            )}
            {permit.application_closes && (
              <div style={{ fontFamily: mono, fontSize: '11px', color: 'var(--tx)', marginBottom: '2px' }}>
                <strong>Closes:</strong> {permit.application_closes}
              </div>
            )}
            {permit.results_date && (
              <div style={{ fontFamily: mono, fontSize: '11px', color: 'var(--tx)' }}>
                <strong>Results announced:</strong> {permit.results_date}
              </div>
            )}
          </div>
        )}

        {/* Season + group + cost */}
        {(season || groupSize || cost) && (
          <div style={{ marginBottom: '14px' }}>
            <div style={{ fontFamily: mono, fontSize: '9px', color: 'var(--tx3)', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '6px' }}>
              Season &amp; Logistics
            </div>
            {season && (
              <div style={{ fontFamily: mono, fontSize: '11px', color: 'var(--tx)', marginBottom: '2px' }}>
                {season}
              </div>
            )}
            {groupSize && (
              <div style={{ fontFamily: mono, fontSize: '11px', color: 'var(--tx)', marginBottom: '2px' }}>
                <strong>Group size:</strong> {groupSize}
              </div>
            )}
            {cost && (
              <div style={{ fontFamily: mono, fontSize: '11px', color: 'var(--tx)' }}>
                <strong>Cost:</strong> {cost}
              </div>
            )}
          </div>
        )}

        {/* Notes — agency-specific tips, e.g. trip-leader limits */}
        {permit.notes && (
          <div style={{
            padding: '10px 12px',
            background: 'var(--bg)',
            border: '.5px solid var(--bd)',
            borderRadius: 'var(--r)',
            marginBottom: '14px',
          }}>
            <div style={{ fontFamily: mono, fontSize: '11px', color: 'var(--tx)', lineHeight: 1.55 }}>
              {permit.notes}
            </div>
          </div>
        )}

        {/* Commercial alternative tip — nudge users who didn't win
            the lottery toward the outfitters list further down the
            same Overview tab. */}
        {permit.commercial_available && (
          <div style={{
            padding: '10px 12px',
            background: 'var(--rvlt)',
            border: '.5px solid var(--rvmd)',
            borderRadius: 'var(--r)',
            marginBottom: '14px',
            display: 'flex', alignItems: 'flex-start', gap: '8px',
          }}>
            <span style={{ fontSize: '14px', color: 'var(--rvdk)', flexShrink: 0 }}>&#9889;</span>
            <div>
              <div style={{ fontFamily: mono, fontSize: '11px', color: 'var(--rvdk)', fontWeight: 600, marginBottom: '2px' }}>
                Commercial trips available
              </div>
              <div style={{ fontFamily: mono, fontSize: '11px', color: 'var(--tx2)', lineHeight: 1.55 }}>
                {permit.commercial_notes || 'Licensed outfitters offer guided trips if you miss the lottery. See outfitters below for options.'}
              </div>
            </div>
          </div>
        )}

        {/* Action buttons */}
        <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', marginBottom: permit.last_verified_year ? '14px' : 0 }}>
          {permit.apply_url && (
            <a
              href={permit.apply_url}
              target="_blank"
              rel="noopener noreferrer"
              style={{
                fontFamily: mono, fontSize: '11px', fontWeight: 500,
                padding: '8px 16px', borderRadius: 'var(--r)',
                background: 'var(--dg)', color: '#fff',
                textDecoration: 'none',
              }}>
              Apply for permit &#8599;
            </a>
          )}
          {permit.info_url && (
            <a
              href={permit.info_url}
              target="_blank"
              rel="noopener noreferrer"
              style={{
                fontFamily: mono, fontSize: '11px', fontWeight: 500,
                padding: '8px 16px', borderRadius: 'var(--r)',
                border: '.5px solid var(--dg)',
                background: 'var(--bg)', color: 'var(--dg)',
                textDecoration: 'none',
              }}>
              Permit information &#8599;
            </a>
          )}
          {permit.phone && (
            <a
              href={`tel:${permit.phone.replace(/[^0-9+]/g, '')}`}
              style={{
                fontFamily: mono, fontSize: '11px',
                padding: '8px 16px', borderRadius: 'var(--r)',
                border: '.5px solid var(--bd2)',
                background: 'var(--bg)', color: 'var(--tx2)',
                textDecoration: 'none',
              }}>
              Call: {permit.phone}
            </a>
          )}
        </div>

        {permit.last_verified_year && (
          <div style={{ fontFamily: mono, fontSize: '9px', color: 'var(--tx3)', fontStyle: 'italic', lineHeight: 1.5 }}>
            Last verified: {permit.last_verified_year} &middot; Permit rules change annually — always confirm with the managing agency before applying.
          </div>
        )}
        {outdatedLink}
      </div>
      {updateOpen && (
        <PermitUpdateModal
          permit={permit}
          onClose={() => setUpdateOpen(false)}
        />
      )}
    </div>
  )
}

// ── Permit update submission modal ────────────────────────────────
// Free-form report for outdated permit info. Routes through the
// existing /api/suggestions POST with field='permit_update', which
// tags ai_category='permit_update' and fires an admin email blast
// (defined in app/api/suggestions/route.ts).
//
// We deliberately don't try to AI-validate this category — permit
// rule changes are too narrow for the existing river-data Claude
// prompt to give a useful confidence rating, and they're high-priority
// enough that admin review is the right path regardless.

interface ModalProps {
  permit: RiverPermit
  onClose: () => void
}

function PermitUpdateModal({ permit, onClose }: ModalProps) {
  const [whatChanged, setWhatChanged] = useState('')
  const [sourceUrl, setSourceUrl] = useState('')
  const [submitterEmail, setSubmitterEmail] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [done, setDone] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleSubmit = async () => {
    if (!whatChanged.trim()) {
      setError('Please describe what changed')
      return
    }
    setSubmitting(true)
    setError(null)
    try {
      const res = await fetch('/api/suggestions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          riverId: permit.river_id,
          riverName: permit.river_name,
          stateKey: permit.state_key,
          userEmail: submitterEmail.trim() || null,
          field: 'permit_update',
          // The suggestions schema expects a single suggestedValue
          // string. For permit updates we put the user's "what
          // changed" description here so it surfaces directly in the
          // admin queue without needing a new column.
          suggestedValue: whatChanged.trim(),
          // currentValue is optional for permit_update (handled in
          // the POST route), but we send the permit name + verified
          // year so admins have context at a glance.
          currentValue: `${permit.permit_name} (last verified ${permit.last_verified_year ?? 'never'})`,
          reason: `Permit info outdated for ${permit.river_name}.`,
          sourceUrl: sourceUrl.trim() || null,
        }),
      })
      const data = await res.json()
      if (!res.ok || !data.ok) {
        setError(data.error || 'Failed to submit')
        setSubmitting(false)
        return
      }
      setDone(true)
      setSubmitting(false)
    } catch {
      setError('Network error')
      setSubmitting(false)
    }
  }

  return (
    <div onClick={onClose} style={{
      position: 'fixed', inset: 0, background: 'rgba(0,0,0,.45)',
      zIndex: 200, display: 'flex', alignItems: 'center', justifyContent: 'center',
      padding: '16px',
    }}>
      <div onClick={e => e.stopPropagation()} style={{
        background: 'var(--bg)', borderRadius: 'var(--rlg)',
        padding: '22px 24px', maxWidth: '440px', width: '100%',
        maxHeight: '90vh', overflowY: 'auto',
        boxShadow: '0 12px 48px rgba(0,0,0,.25)',
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '6px' }}>
          <div>
            <div style={{ fontFamily: mono, fontSize: '9px', color: '#BA7517', textTransform: 'uppercase', letterSpacing: '1.5px', marginBottom: '4px' }}>
              Permit info outdated?
            </div>
            <div style={{ fontFamily: serif, fontSize: '17px', fontWeight: 700, color: 'var(--tx)', lineHeight: 1.3 }}>
              {permit.river_name}
            </div>
          </div>
          <button onClick={onClose} style={{
            background: 'none', border: 'none', fontSize: '18px',
            color: 'var(--tx3)', cursor: 'pointer', padding: '4px 8px',
          }}>&#10005;</button>
        </div>

        {done ? (
          <div style={{ textAlign: 'center', padding: '20px 0' }}>
            <div style={{ fontSize: '28px', marginBottom: '8px' }}>&#10003;</div>
            <div style={{ fontFamily: mono, fontSize: '12px', color: 'var(--rv)', marginBottom: '8px', fontWeight: 500 }}>
              Thank you — admin notified.
            </div>
            <div style={{ fontFamily: mono, fontSize: '10px', color: 'var(--tx3)', lineHeight: 1.55 }}>
              Permit-update reports are reviewed quickly because outdated info can cause paddlers to miss a lottery window.
            </div>
          </div>
        ) : (
          <>
            <div style={{ fontFamily: mono, fontSize: '10px', color: 'var(--tx3)', marginBottom: '14px', lineHeight: 1.55 }}>
              Spotted outdated permit info? Tell us what changed so we can update the row. Your report goes directly to the admin queue.
            </div>

            <label style={{ display: 'block', marginBottom: '12px' }}>
              <span style={{ fontFamily: mono, fontSize: '10px', color: 'var(--tx2)', display: 'block', marginBottom: '4px' }}>
                What changed
              </span>
              <textarea
                value={whatChanged}
                onChange={e => setWhatChanged(e.target.value)}
                rows={4}
                maxLength={1500}
                placeholder="e.g. Application window now closes Feb 15 instead of Jan 31. Per-person fee raised to $12."
                style={{
                  width: '100%', padding: '8px 10px', fontFamily: mono, fontSize: '12px',
                  border: '.5px solid var(--bd2)', borderRadius: 'var(--r)',
                  background: 'var(--bg)', color: 'var(--tx)', boxSizing: 'border-box',
                  resize: 'vertical', lineHeight: 1.5,
                }} />
            </label>

            <label style={{ display: 'block', marginBottom: '12px' }}>
              <span style={{ fontFamily: mono, fontSize: '10px', color: 'var(--tx2)', display: 'block', marginBottom: '4px' }}>
                Source URL <span style={{ color: 'var(--tx3)' }}>(agency announcement, recreation.gov page)</span>
              </span>
              <input
                type="url"
                value={sourceUrl}
                onChange={e => setSourceUrl(e.target.value)}
                placeholder="https://..."
                style={{
                  width: '100%', padding: '8px 10px', fontFamily: mono, fontSize: '12px',
                  border: '.5px solid var(--bd2)', borderRadius: 'var(--r)',
                  background: 'var(--bg)', color: 'var(--tx)', boxSizing: 'border-box',
                }} />
            </label>

            <label style={{ display: 'block', marginBottom: '14px' }}>
              <span style={{ fontFamily: mono, fontSize: '10px', color: 'var(--tx2)', display: 'block', marginBottom: '4px' }}>
                Your email <span style={{ color: 'var(--tx3)' }}>(optional, for follow-up)</span>
              </span>
              <input
                type="email"
                value={submitterEmail}
                onChange={e => setSubmitterEmail(e.target.value)}
                placeholder="you@email.com"
                style={{
                  width: '100%', padding: '8px 10px', fontFamily: mono, fontSize: '12px',
                  border: '.5px solid var(--bd2)', borderRadius: 'var(--r)',
                  background: 'var(--bg)', color: 'var(--tx)', boxSizing: 'border-box',
                }} />
            </label>

            {error && (
              <div style={{ fontFamily: mono, fontSize: '10px', color: 'var(--dg)', marginBottom: '10px' }}>
                &#9888; {error}
              </div>
            )}

            <button
              onClick={handleSubmit}
              disabled={submitting || !whatChanged.trim()}
              style={{
                width: '100%', padding: '11px',
                fontFamily: mono, fontSize: '11px', fontWeight: 500,
                background: '#BA7517', color: '#fff', border: 'none',
                borderRadius: 'var(--r)',
                cursor: submitting ? 'wait' : 'pointer',
                opacity: (submitting || !whatChanged.trim()) ? 0.5 : 1,
                letterSpacing: '.3px',
              }}>
              {submitting ? 'Submitting…' : 'Submit permit update'}
            </button>
          </>
        )}
      </div>
    </div>
  )
}
