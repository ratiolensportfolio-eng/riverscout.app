import { getContributorTier, type ContributorTier } from '@/lib/contributor-tiers'

// Inline contributor tier badge — renders next to a display name
// anywhere a contributor's content shows up (Q&A questions, Q&A
// answers, the AuthNav dropdown, future trip reports). Pass either
// `count` (and we'll resolve the tier) or a pre-resolved `tier`.
//
// Renders nothing for the empty 'none' tier so callers can drop
// it in unconditionally without juggling visibility checks.
//
// Two sizes:
//   sm  — for inline-with-display-name use (Q&A meta line, etc.)
//   md  — for the AuthNav dropdown header where the badge is more
//         prominent
//
// The visual identity (color, background, border, icon) comes from
// CONTRIBUTOR_TIERS in lib/contributor-tiers.ts so this stays in
// sync with the existing badges on /account and /profile.

export interface ContributorBadgeProps {
  count?: number
  tier?: ContributorTier
  size?: 'sm' | 'md'
  // When true, render the tier label after the icon. Default: icon
  // only (compact). Used for the AuthNav dropdown where there's
  // room to spell it out.
  showLabel?: boolean
}

export default function ContributorBadge({
  count, tier: tierProp, size = 'sm', showLabel = false,
}: ContributorBadgeProps) {
  const tier = tierProp ?? (count != null ? getContributorTier(count) : null)
  if (!tier || tier.key === 'none') return null

  const isSm = size === 'sm'
  return (
    <span
      title={`${tier.label} \u2014 ${tier.description}`}
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: isSm ? '3px' : '5px',
        fontFamily: "'IBM Plex Mono', monospace",
        fontSize: isSm ? '8px' : '10px',
        padding: isSm ? '1px 6px' : '3px 9px',
        borderRadius: isSm ? '6px' : '10px',
        background: tier.background,
        color: tier.color,
        border: `.5px solid ${tier.border}`,
        textTransform: 'uppercase',
        letterSpacing: '.4px',
        fontWeight: 600,
        verticalAlign: 'middle',
        whiteSpace: 'nowrap',
        lineHeight: 1.4,
        cursor: 'help',
      }}
    >
      <span aria-hidden="true" style={{ fontSize: isSm ? '9px' : '11px', lineHeight: 1 }}>{tier.icon}</span>
      {showLabel && <span>{tier.label}</span>}
    </span>
  )
}
