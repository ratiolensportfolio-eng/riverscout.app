// Inline SVG fish species icons — single-color silhouettes
// Used in stocking reports, fishing tab, and species lists

import React from 'react'

const S = 20 // default size

interface IconProps {
  size?: number
  color?: string
}

function Trout({ size = S, color = 'currentColor' }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill={color} style={{ flexShrink: 0 }}>
      <path d="M2 12c0 0 2.5-5 8-5.5c1-.1 2.2.1 3.2.5c1.5.6 2.8 1.5 4.3 1.8c1.2.2 2.5.1 3.5-.3l1 1.5l-1 1.5c-1 .4-2.3.5-3.5.3c-1.5-.3-2.8-1.2-4.3-1.8c-1-.4-2.2-.6-3.2-.5C4.5 17 2 12 2 12z" />
      <circle cx="17.5" cy="11" r=".8" fill="var(--bg, #fff)" />
      <circle cx="8" cy="10.5" r=".5" />
      <circle cx="9.5" cy="11.5" r=".4" />
      <circle cx="7.5" cy="12.5" r=".4" />
      <circle cx="10.5" cy="10" r=".35" />
      <circle cx="9" cy="13" r=".35" />
    </svg>
  )
}

function TroutClean({ size = S, color = 'currentColor' }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill={color} style={{ flexShrink: 0 }}>
      <path d="M2 12c0 0 2.5-5 8-5.5c1-.1 2.2.1 3.2.5c1.5.6 2.8 1.5 4.3 1.8c1.2.2 2.5.1 3.5-.3l1 1.5l-1 1.5c-1 .4-2.3.5-3.5.3c-1.5-.3-2.8-1.2-4.3-1.8c-1-.4-2.2-.6-3.2-.5C4.5 17 2 12 2 12z" />
      <circle cx="17.5" cy="11" r=".8" fill="var(--bg, #fff)" />
    </svg>
  )
}

function SmallTrout({ size = S, color = 'currentColor' }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill={color} style={{ flexShrink: 0 }}>
      <path d="M4 12c0 0 2-4 6.5-4.2c.8-.05 1.8.1 2.6.4c1.2.5 2.2 1.2 3.4 1.4c1 .2 2 .1 2.8-.2l.7 1.1l-.7 1.1c-.8.3-1.8.4-2.8.2c-1.2-.2-2.2-1-3.4-1.4c-.8-.3-1.8-.45-2.6-.4C6 16.2 4 12 4 12z" />
      <circle cx="16" cy="11.2" r=".7" fill="var(--bg, #fff)" />
      <circle cx="8.5" cy="10.8" r=".35" />
      <circle cx="9.8" cy="11.6" r=".3" />
      <circle cx="8" cy="12.2" r=".3" />
    </svg>
  )
}

function Salmon({ size = S, color = 'currentColor' }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill={color} style={{ flexShrink: 0 }}>
      <path d="M1.5 12c0 0 2-6 8.5-6c1.2 0 2.5.2 3.6.7c1.6.7 3 1.6 4.6 2c1.3.3 2.6.1 3.8-.3l1 1.8l-1 1.8c-1.2.4-2.5.6-3.8.3c-1.6-.4-3-1.3-4.6-2c-1.1-.5-2.4-.7-3.6-.7C3.5 18 1.5 12 1.5 12z" />
      <circle cx="18.5" cy="11" r=".9" fill="var(--bg, #fff)" />
    </svg>
  )
}

function Steelhead({ size = S, color = 'currentColor' }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill={color} style={{ flexShrink: 0 }}>
      <path d="M1 12c0 0 2-4.5 8.5-4.8c1.1-.05 2.4.1 3.4.5c1.5.6 2.8 1.3 4.5 1.6c1.3.2 2.6.1 3.8-.3l1.2 1.3l-1.2 1.3c-1.2.4-2.5.5-3.8.3c-1.7-.3-3-1-4.5-1.6c-1-.4-2.3-.55-3.4-.5C3 16.8 1 12 1 12z" />
      <circle cx="18.8" cy="11.2" r=".8" fill="var(--bg, #fff)" />
    </svg>
  )
}

function LakeTrout({ size = S, color = 'currentColor' }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill={color} style={{ flexShrink: 0 }}>
      <path d="M2 12c0 0 2-5.8 8-6c1.1 0 2.3.2 3.3.6c1.5.6 2.8 1.5 4.3 1.8c1.2.2 2.4.1 3.5-.3l.9 1.7l-.9 1.7c-1.1.4-2.3.5-3.5.3c-1.5-.3-2.8-1.2-4.3-1.8c-1-.4-2.2-.6-3.3-.6C4 17.8 2 12 2 12z" />
      <circle cx="17.5" cy="11" r=".85" fill="var(--bg, #fff)" />
      <circle cx="7" cy="10.5" r=".3" />
      <circle cx="8.5" cy="11.5" r=".25" />
      <circle cx="6.5" cy="12" r=".25" />
      <circle cx="9" cy="10" r=".25" />
      <circle cx="10" cy="12" r=".25" />
      <circle cx="8" cy="13" r=".2" />
      <circle cx="10.5" cy="11" r=".2" />
    </svg>
  )
}

function Walleye({ size = S, color = 'currentColor' }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill={color} style={{ flexShrink: 0 }}>
      <path d="M1 12c0 0 1.5-4.5 7-5c1-.1 2 .05 3 .3c1.5.5 3 1.3 4.5 1.6c1.2.2 2.5.15 3.6-.15l1.4.6l.5.8l-1.5 1.5l-.5.3c-1.1.3-2.4.35-3.6.15c-1.5-.3-3-1.1-4.5-1.6c-1-.25-2-.4-3-.3C2.5 16.5 1 12 1 12z" />
      <circle cx="17" cy="11" r="1" fill="var(--bg, #fff)" />
      <circle cx="17" cy="11" r=".4" />
    </svg>
  )
}

function Bass({ size = S, color = 'currentColor' }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill={color} style={{ flexShrink: 0 }}>
      <path d="M3 12c0 0 1.5-5.5 7-5.8c1-.05 2.2.15 3.2.5c1.4.6 2.6 1.4 4 1.7c1.1.2 2.3.1 3.3-.2l1.5 1l-1 2l-.5.2c-1 .3-2.2.4-3.3.2c-1.4-.3-2.6-1.1-4-1.7c-1-.35-2.2-.55-3.2-.5C4.5 17.8 3 12 3 12z" />
      <path d="M5 8.5c.5-1 1.5-1.8 2.5-2c0 0-.3 1.2-.5 2" opacity=".6" />
      <circle cx="16.5" cy="11" r=".9" fill="var(--bg, #fff)" />
    </svg>
  )
}

function GenericFish({ size = S, color = 'currentColor' }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill={color} style={{ flexShrink: 0 }}>
      <path d="M3 12c0 0 2-5 7.5-5c1 0 2.1.15 3 .5c1.4.5 2.7 1.3 4.1 1.6c1.1.2 2.3.1 3.3-.2l1 1.3l-1 1.3c-1 .3-2.2.4-3.3.2c-1.4-.3-2.7-1.1-4.1-1.6c-.9-.35-2-.5-3-.5C5 17 3 12 3 12z" />
      <circle cx="17" cy="11.2" r=".8" fill="var(--bg, #fff)" />
    </svg>
  )
}

// Species name → icon component mapping
const SPECIES_ICONS: Record<string, (props: IconProps) => React.ReactNode> = {
  'brown trout': Trout,
  'rainbow trout': TroutClean,
  'brook trout': SmallTrout,
  'cutthroat trout': TroutClean,
  'lake trout': LakeTrout,
  'steelhead': Steelhead,
  'chinook salmon': Salmon,
  'coho salmon': Salmon,
  'atlantic salmon': Salmon,
  'walleye': Walleye,
  'muskie': Walleye,
  'smallmouth bass': Bass,
  'largemouth bass': Bass,
  'channel catfish': GenericFish,
}

export function FishIcon({ species, size, color }: { species: string; size?: number; color?: string }) {
  const key = species.toLowerCase()
  const Icon = SPECIES_ICONS[key] || GenericFish
  return <Icon size={size} color={color} />
}

// For the hatches-page key. We expose a flat list of the
// species-name → icon-component pairs so the legend stays in
// sync with the actual icon set instead of duplicating labels in
// two places. Order matches roughly: trouts → salmonids → warm.
export const SPECIES_ICON_LEGEND: Array<{ label: string; species: string }> = [
  { label: 'Brown Trout', species: 'brown trout' },
  { label: 'Rainbow / Cutthroat Trout', species: 'rainbow trout' },
  { label: 'Brook Trout', species: 'brook trout' },
  { label: 'Lake Trout', species: 'lake trout' },
  { label: 'Steelhead', species: 'steelhead' },
  { label: 'Salmon (Chinook / Coho / Atlantic)', species: 'chinook salmon' },
  { label: 'Walleye / Muskie', species: 'walleye' },
  { label: 'Bass (Smallmouth / Largemouth)', species: 'smallmouth bass' },
  { label: 'Other species', species: 'other' },
]

// Returns true when the species name is one we have a dedicated
// icon for (i.e., not the GenericFish fallback). Used by the
// hatches page river card to skip rendering an icon for unknown
// species rather than showing a generic blob.
export function hasFishIcon(species: string): boolean {
  return Object.prototype.hasOwnProperty.call(SPECIES_ICONS, species.toLowerCase())
}

export default FishIcon
