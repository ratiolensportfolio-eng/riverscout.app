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
  // Defensive: caller should have filtered this out, but if a row
  // somehow has type=no_permit_required render nothing.
  if (permit.permit_type === 'no_permit_required') return null

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
        </div>
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
      </div>
    </div>
  )
}
