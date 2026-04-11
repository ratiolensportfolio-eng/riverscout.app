// Inline SVG fish species icons.
//
// v2 redesign — the v1 icons were all "vaguely fish-shaped blob
// with a dot for an eye" and you couldn't tell them apart at the
// 16-20px sizes the river cards actually use. Brown / Rainbow /
// Cutthroat trout literally shared the same component. Now each
// species has:
//
//   1. A distinct fill color (the species IS the color — caller-
//      supplied `color` prop is ignored except by GenericFish)
//   2. A signature mark — red dots / lateral stripe / fin tipping
//      / spotted back / paddle tail / forked tail / etc.
//   3. A real body-shape difference between families (sleek for
//      salmonids, blocky/dorsal-spined for bass, paddle-tail for
//      walleye, big eye for muskie)
//
// At 16-20px the legend now reads as: brown body with red dots
// (Brown), silver body with red stripe (Rainbow), olive body with
// red belly (Brook), and so on — actually distinguishable.

import React from 'react'

const S = 20 // default size

interface IconProps {
  size?: number
  // Most icons hard-code their species color. The prop is kept
  // for API compatibility (and is honored by GenericFish) so
  // existing call sites don't need to change.
  color?: string
}

// Shared base wrapper — handles size, viewBox, shrink lock.
function Svg({ size = S, children }: { size?: number; children: React.ReactNode }) {
  return (
    <svg width={size} height={size} viewBox="0 0 32 20" style={{ flexShrink: 0, display: 'block' }}>
      {children}
    </svg>
  )
}

// ── Brown Trout ─────────────────────────────────────────────
// Tan/olive body, red dots ringed in pale halos along the side.
// The red dots are the iconic Brown Trout marker.
function BrownTrout({ size = S }: IconProps) {
  return (
    <Svg size={size}>
      {/* Body */}
      <path d="M2 10 C 6 4, 18 4, 24 10 L 30 6 L 30 14 L 24 10 C 18 16, 6 16, 2 10 Z" fill="#8B6B3A" />
      {/* Dorsal fin */}
      <path d="M14 5 L 17 2 L 19 5 Z" fill="#6B4F2A" />
      {/* Pale-haloed red spots — Brown Trout signature */}
      <circle cx="10" cy="9" r="1.6" fill="#F5E6C8" />
      <circle cx="10" cy="9" r="0.9" fill="#C42A2A" />
      <circle cx="15" cy="11" r="1.6" fill="#F5E6C8" />
      <circle cx="15" cy="11" r="0.9" fill="#C42A2A" />
      <circle cx="20" cy="9" r="1.4" fill="#F5E6C8" />
      <circle cx="20" cy="9" r="0.7" fill="#C42A2A" />
      {/* Eye */}
      <circle cx="6" cy="9" r="0.9" fill="#fff" />
      <circle cx="6" cy="9" r="0.45" fill="#000" />
    </Svg>
  )
}

// ── Rainbow Trout ───────────────────────────────────────────
// Silver body with the unmistakable pink/red lateral stripe and
// fine dark spots on the back.
function RainbowTrout({ size = S }: IconProps) {
  return (
    <Svg size={size}>
      <path d="M2 10 C 6 4, 18 4, 24 10 L 30 6 L 30 14 L 24 10 C 18 16, 6 16, 2 10 Z" fill="#A8B5BD" />
      <path d="M14 5 L 17 2 L 19 5 Z" fill="#6F7C84" />
      {/* Pink lateral stripe — the Rainbow Trout signature */}
      <path d="M5 10 C 10 9.4, 18 9.4, 23 10" stroke="#E85A8A" strokeWidth="1.6" fill="none" strokeLinecap="round" />
      {/* Fine dark back spots */}
      <circle cx="10" cy="7" r="0.4" fill="#1F2A30" />
      <circle cx="13" cy="6.5" r="0.4" fill="#1F2A30" />
      <circle cx="16" cy="7" r="0.4" fill="#1F2A30" />
      <circle cx="19" cy="7" r="0.4" fill="#1F2A30" />
      <circle cx="22" cy="7.5" r="0.4" fill="#1F2A30" />
      {/* Eye */}
      <circle cx="6" cy="9" r="0.9" fill="#fff" />
      <circle cx="6" cy="9" r="0.45" fill="#000" />
    </Svg>
  )
}

// ── Brook Trout ─────────────────────────────────────────────
// Olive back, vermiculated pattern, RED belly, white-edged
// orange lower fins. Smaller-bodied silhouette.
function BrookTrout({ size = S }: IconProps) {
  return (
    <Svg size={size}>
      {/* Olive back half */}
      <path d="M3 10 C 7 5, 17 5, 23 10 L 29 7 L 29 13 L 23 10 C 17 11, 7 11, 3 10 Z" fill="#4A6B3A" />
      {/* Bright orange/red belly half — Brook Trout signature */}
      <path d="M3 10 C 7 14, 17 14, 23 10 C 17 11, 7 11, 3 10 Z" fill="#D4602A" />
      {/* White-edged ventral fin */}
      <path d="M9 13 L 11 16 L 13 13 Z" fill="#D4602A" stroke="#fff" strokeWidth="0.5" />
      {/* Pale yellow back spots (vermiculated stand-in) */}
      <circle cx="9" cy="7.5" r="0.5" fill="#F0E68C" />
      <circle cx="13" cy="7" r="0.5" fill="#F0E68C" />
      <circle cx="17" cy="7.5" r="0.5" fill="#F0E68C" />
      <circle cx="20" cy="8" r="0.5" fill="#F0E68C" />
      {/* Dorsal fin */}
      <path d="M13 5 L 16 2.5 L 18 5 Z" fill="#3A5A2E" />
      {/* Eye */}
      <circle cx="6" cy="9" r="0.9" fill="#fff" />
      <circle cx="6" cy="9" r="0.45" fill="#000" />
    </Svg>
  )
}

// ── Cutthroat Trout ─────────────────────────────────────────
// Yellow-olive body with the iconic red/orange "cut" slash under
// the jaw. Heavy black spots on the back half.
function CutthroatTrout({ size = S }: IconProps) {
  return (
    <Svg size={size}>
      <path d="M2 10 C 6 4, 18 4, 24 10 L 30 6 L 30 14 L 24 10 C 18 16, 6 16, 2 10 Z" fill="#C9A84A" />
      <path d="M14 5 L 17 2 L 19 5 Z" fill="#8A7028" />
      {/* The "cut" — red slash under the jaw */}
      <path d="M4 11 L 8 12.5" stroke="#C42A2A" strokeWidth="1.4" strokeLinecap="round" />
      {/* Heavy black back spots concentrated on tail end */}
      <circle cx="14" cy="7" r="0.55" fill="#1F1F1F" />
      <circle cx="17" cy="7" r="0.55" fill="#1F1F1F" />
      <circle cx="20" cy="7.5" r="0.55" fill="#1F1F1F" />
      <circle cx="22" cy="8" r="0.55" fill="#1F1F1F" />
      <circle cx="18" cy="9" r="0.55" fill="#1F1F1F" />
      <circle cx="21" cy="10" r="0.55" fill="#1F1F1F" />
      {/* Eye */}
      <circle cx="6" cy="9" r="0.9" fill="#fff" />
      <circle cx="6" cy="9" r="0.45" fill="#000" />
    </Svg>
  )
}

// ── Lake Trout ──────────────────────────────────────────────
// Dark gray body, pale "vermiculation" pattern of cream squiggles
// covering the entire back, deeply forked tail.
function LakeTrout({ size = S }: IconProps) {
  return (
    <Svg size={size}>
      {/* Body — deeply forked tail */}
      <path d="M2 10 C 6 4, 18 4, 24 10 L 30 5 L 27 10 L 30 15 L 24 10 C 18 16, 6 16, 2 10 Z" fill="#3D4A52" />
      <path d="M14 5 L 17 2 L 19 5 Z" fill="#1F2A30" />
      {/* Cream-colored vermiculation spots — densely packed */}
      <circle cx="7" cy="8" r="0.45" fill="#E8E0C8" />
      <circle cx="9" cy="9.5" r="0.4" fill="#E8E0C8" />
      <circle cx="11" cy="7.5" r="0.5" fill="#E8E0C8" />
      <circle cx="13" cy="9" r="0.45" fill="#E8E0C8" />
      <circle cx="15" cy="7.5" r="0.45" fill="#E8E0C8" />
      <circle cx="17" cy="9" r="0.4" fill="#E8E0C8" />
      <circle cx="19" cy="7.5" r="0.45" fill="#E8E0C8" />
      <circle cx="21" cy="9" r="0.4" fill="#E8E0C8" />
      <circle cx="11" cy="11" r="0.4" fill="#E8E0C8" />
      <circle cx="14" cy="11.5" r="0.4" fill="#E8E0C8" />
      <circle cx="17" cy="11" r="0.4" fill="#E8E0C8" />
      {/* Eye */}
      <circle cx="6" cy="9" r="0.9" fill="#fff" />
      <circle cx="6" cy="9" r="0.45" fill="#000" />
    </Svg>
  )
}

// ── Steelhead ───────────────────────────────────────────────
// Chrome-bright silver body, faint pink lateral wash, anadromous
// jaw shape. The "fresh from the lake" Rainbow look.
function Steelhead({ size = S }: IconProps) {
  return (
    <Svg size={size}>
      <path d="M2 10 C 6 4, 18 4, 24 10 L 30 6 L 30 14 L 24 10 C 18 16, 6 16, 2 10 Z" fill="#C8D4DC" />
      {/* Chrome shine — top edge highlight */}
      <path d="M5 8 C 10 5, 18 5, 22 8" stroke="#fff" strokeWidth="0.8" fill="none" opacity="0.7" />
      {/* Faint pink wash along the lateral line */}
      <path d="M5 10 C 10 9.7, 18 9.7, 23 10" stroke="#E89AAA" strokeWidth="1.2" fill="none" opacity="0.7" />
      {/* Sparse dark spots on the upper back */}
      <circle cx="11" cy="7.5" r="0.35" fill="#2F3A40" />
      <circle cx="15" cy="7" r="0.35" fill="#2F3A40" />
      <circle cx="19" cy="7.5" r="0.35" fill="#2F3A40" />
      <path d="M14 5 L 17 2 L 19 5 Z" fill="#8E9AA2" />
      {/* Eye */}
      <circle cx="6" cy="9" r="0.9" fill="#fff" />
      <circle cx="6" cy="9" r="0.45" fill="#000" />
    </Svg>
  )
}

// ── Chinook (King) Salmon ───────────────────────────────────
// Big-bodied silver/blue with black-spotted tail and gum line.
// Forked tail. Larger silhouette than the trout.
function ChinookSalmon({ size = S }: IconProps) {
  return (
    <Svg size={size}>
      {/* Larger body */}
      <path d="M1 10 C 5 3, 18 3, 24 10 L 31 5 L 28 10 L 31 15 L 24 10 C 18 17, 5 17, 1 10 Z" fill="#5B7A92" />
      {/* Dorsal fin */}
      <path d="M13 4 L 17 1 L 20 4 Z" fill="#2F4858" />
      {/* Black spots on back AND tail (Chinook signature — both) */}
      <circle cx="9" cy="7" r="0.5" fill="#1F2A30" />
      <circle cx="12" cy="6.5" r="0.5" fill="#1F2A30" />
      <circle cx="15" cy="6.5" r="0.5" fill="#1F2A30" />
      <circle cx="18" cy="7" r="0.5" fill="#1F2A30" />
      <circle cx="26" cy="7" r="0.45" fill="#1F2A30" />
      <circle cx="28" cy="9" r="0.45" fill="#1F2A30" />
      <circle cx="26" cy="13" r="0.45" fill="#1F2A30" />
      <circle cx="28" cy="11" r="0.45" fill="#1F2A30" />
      {/* Black gum line — Chinook ID signature */}
      <path d="M2 11 L 5 12" stroke="#000" strokeWidth="0.8" strokeLinecap="round" />
      {/* Eye */}
      <circle cx="6" cy="9" r="0.9" fill="#fff" />
      <circle cx="6" cy="9" r="0.45" fill="#000" />
    </Svg>
  )
}

// ── Coho (Silver) Salmon ────────────────────────────────────
// Silver body with a wash of green-blue on the back, spots on
// upper half of tail only (Coho ID), white gum line.
function CohoSalmon({ size = S }: IconProps) {
  return (
    <Svg size={size}>
      <path d="M1 10 C 5 3, 18 3, 24 10 L 31 5 L 28 10 L 31 15 L 24 10 C 18 17, 5 17, 1 10 Z" fill="#9DAFBD" />
      {/* Green-blue back wash */}
      <path d="M3 9 C 8 5, 18 5, 23 9 C 18 7, 8 7, 3 9 Z" fill="#3D6B7A" opacity="0.85" />
      <path d="M13 4 L 17 1 L 20 4 Z" fill="#2F4858" />
      {/* Spots only on upper tail — Coho signature */}
      <circle cx="26" cy="7" r="0.45" fill="#1F2A30" />
      <circle cx="28" cy="8" r="0.45" fill="#1F2A30" />
      <circle cx="27" cy="6" r="0.4" fill="#1F2A30" />
      {/* Few back spots */}
      <circle cx="13" cy="6.5" r="0.4" fill="#1F2A30" />
      <circle cx="17" cy="6.5" r="0.4" fill="#1F2A30" />
      {/* Eye */}
      <circle cx="6" cy="9" r="0.9" fill="#fff" />
      <circle cx="6" cy="9" r="0.45" fill="#000" />
    </Svg>
  )
}

// ── Atlantic Salmon ─────────────────────────────────────────
// Bright silver, X-shaped spots above the lateral line, no spots
// on tail (key ID separating from Chinook).
function AtlanticSalmon({ size = S }: IconProps) {
  return (
    <Svg size={size}>
      <path d="M1 10 C 5 3, 18 3, 24 10 L 31 5 L 28 10 L 31 15 L 24 10 C 18 17, 5 17, 1 10 Z" fill="#BAC8D0" />
      <path d="M13 4 L 17 1 L 20 4 Z" fill="#5F6E78" />
      {/* X-shaped spots above lateral line — Atlantic signature */}
      <text x="9" y="8.5" fontSize="3" fill="#1F2A30" fontFamily="sans-serif" fontWeight="bold">x</text>
      <text x="13" y="8" fontSize="3" fill="#1F2A30" fontFamily="sans-serif" fontWeight="bold">x</text>
      <text x="17" y="8" fontSize="3" fill="#1F2A30" fontFamily="sans-serif" fontWeight="bold">x</text>
      <text x="21" y="8.5" fontSize="3" fill="#1F2A30" fontFamily="sans-serif" fontWeight="bold">x</text>
      {/* Eye */}
      <circle cx="6" cy="9" r="0.9" fill="#fff" />
      <circle cx="6" cy="9" r="0.45" fill="#000" />
    </Svg>
  )
}

// ── Walleye ─────────────────────────────────────────────────
// Olive/gold body, distinctive milky reflective eye, two clearly
// separated dorsal fins (the spiny + soft-rayed pair is the key
// ID feature for the perch family).
function Walleye({ size = S }: IconProps) {
  return (
    <Svg size={size}>
      <path d="M2 10 C 6 5, 18 5, 24 10 L 30 6 L 30 14 L 24 10 C 18 15, 6 15, 2 10 Z" fill="#9C8A3F" />
      {/* TWO separated dorsals — perch family signature */}
      <path d="M9 5 L 11 1.5 L 13 5 Z M 13 5 L 14 5 L 14 6 L 13 6 Z" fill="#6F6028" />
      <path d="M15 5 L 17 2.5 L 19 5 Z" fill="#6F6028" />
      {/* Faint vertical bars */}
      <path d="M9 7 L 9 13" stroke="#6F6028" strokeWidth="0.5" opacity="0.6" />
      <path d="M13 7 L 13 13" stroke="#6F6028" strokeWidth="0.5" opacity="0.6" />
      <path d="M17 7 L 17 13" stroke="#6F6028" strokeWidth="0.5" opacity="0.6" />
      <path d="M21 7 L 21 13" stroke="#6F6028" strokeWidth="0.5" opacity="0.6" />
      {/* Big milky reflective eye — the Walleye signature */}
      <circle cx="6" cy="9" r="1.4" fill="#F0F0E0" />
      <circle cx="6" cy="9" r="0.6" fill="#000" />
      <circle cx="5.7" cy="8.7" r="0.25" fill="#fff" />
    </Svg>
  )
}

// ── Muskie ──────────────────────────────────────────────────
// Long lean body, dark vertical bars on a pale flank, pointed
// duck-like jaw. Distinct from Walleye via shape and bar pattern.
function Muskie({ size = S }: IconProps) {
  return (
    <Svg size={size}>
      {/* Long lean body, pointed jaw */}
      <path d="M1 10 C 4 7, 8 7, 14 9 C 20 11, 24 11, 28 10 L 31 7 L 31 13 L 28 10 C 24 9, 20 9, 14 11 C 8 13, 4 13, 1 10 Z" fill="#A8B098" />
      {/* Dark vertical bars — Muskie signature */}
      <path d="M9 7.5 L 9 12.5" stroke="#3A4A2E" strokeWidth="1.1" strokeLinecap="round" />
      <path d="M13 7 L 13 13" stroke="#3A4A2E" strokeWidth="1.1" strokeLinecap="round" />
      <path d="M17 7 L 17 13" stroke="#3A4A2E" strokeWidth="1.1" strokeLinecap="round" />
      <path d="M21 7.5 L 21 12.5" stroke="#3A4A2E" strokeWidth="1.1" strokeLinecap="round" />
      <path d="M25 8 L 25 12" stroke="#3A4A2E" strokeWidth="1.1" strokeLinecap="round" />
      {/* Big eye */}
      <circle cx="4.5" cy="9" r="0.8" fill="#fff" />
      <circle cx="4.5" cy="9" r="0.4" fill="#000" />
      {/* Mouth slit */}
      <path d="M1 10.5 L 4 10.8" stroke="#1F2A1A" strokeWidth="0.5" />
    </Svg>
  )
}

// ── Smallmouth Bass ─────────────────────────────────────────
// Bronze/olive body with strong dark vertical bars, spiny dorsal
// fin clearly visible, deeper body than the trout shapes.
function SmallmouthBass({ size = S }: IconProps) {
  return (
    <Svg size={size}>
      {/* Deeper, blockier body */}
      <path d="M2 10 C 5 3, 18 3, 23 10 C 18 17, 5 17, 2 10 Z M 23 10 L 30 6 L 30 14 Z" fill="#7A5A2A" />
      {/* Spiny dorsal — sawtooth */}
      <path d="M8 5 L 9 2 L 10 5 L 11 2.5 L 12 5 L 13 2 L 14 5 L 15 3 L 16 5 Z" fill="#4A3818" />
      {/* Dark vertical bars — Smallmouth signature */}
      <path d="M9 6 L 9 14" stroke="#2F2210" strokeWidth="1.4" strokeLinecap="round" opacity="0.7" />
      <path d="M13 6 L 13 14" stroke="#2F2210" strokeWidth="1.4" strokeLinecap="round" opacity="0.7" />
      <path d="M17 6 L 17 14" stroke="#2F2210" strokeWidth="1.4" strokeLinecap="round" opacity="0.7" />
      <path d="M20 6.5 L 20 13.5" stroke="#2F2210" strokeWidth="1.2" strokeLinecap="round" opacity="0.7" />
      {/* Big mouth */}
      <path d="M2 11 C 3 12, 5 12.5, 7 12" stroke="#2F2210" strokeWidth="0.6" fill="none" />
      {/* Eye — red-tinged for Smallmouth */}
      <circle cx="6" cy="9" r="1" fill="#E8C8B0" />
      <circle cx="6" cy="9" r="0.5" fill="#A02818" />
    </Svg>
  )
}

// ── Largemouth Bass ─────────────────────────────────────────
// Green body, single thick HORIZONTAL black stripe along the
// lateral line, oversized mouth that extends past the eye.
function LargemouthBass({ size = S }: IconProps) {
  return (
    <Svg size={size}>
      <path d="M2 10 C 5 3, 18 3, 23 10 C 18 17, 5 17, 2 10 Z M 23 10 L 30 6 L 30 14 Z" fill="#5C7A3A" />
      {/* Spiny dorsal */}
      <path d="M8 5 L 9 2 L 10 5 L 11 2.5 L 12 5 L 13 2 L 14 5 L 15 3 L 16 5 Z" fill="#3A4F22" />
      {/* HORIZONTAL black stripe — Largemouth signature */}
      <path d="M5 10 C 10 9.6, 18 9.6, 22 10" stroke="#1F1F1F" strokeWidth="2" strokeLinecap="round" />
      {/* Oversized mouth that goes past the eye */}
      <path d="M2 11 C 4 13, 7 13.5, 9 12.5" stroke="#1F2A14" strokeWidth="0.8" fill="none" />
      <path d="M2 10 L 9 12.5" stroke="#1F2A14" strokeWidth="0.5" />
      {/* Eye */}
      <circle cx="6" cy="9" r="0.9" fill="#fff" />
      <circle cx="6" cy="9" r="0.45" fill="#000" />
    </Svg>
  )
}

// ── Channel Catfish ─────────────────────────────────────────
// Slate body, prominent barbels (whiskers) at the mouth, deeply
// forked tail, no scales.
function ChannelCatfish({ size = S }: IconProps) {
  return (
    <Svg size={size}>
      {/* Wider front-tapering body */}
      <path d="M2 10 C 4 6, 18 6, 23 10 L 30 5 L 27 10 L 30 15 L 23 10 C 18 14, 4 14, 2 10 Z" fill="#5C5F5A" />
      {/* Barbels (whiskers) — Catfish signature */}
      <path d="M2 10 L 0 8" stroke="#3A3D38" strokeWidth="0.6" strokeLinecap="round" />
      <path d="M2 10 L 0 11.5" stroke="#3A3D38" strokeWidth="0.6" strokeLinecap="round" />
      <path d="M3 9 L 1 7.5" stroke="#3A3D38" strokeWidth="0.5" strokeLinecap="round" />
      <path d="M3 11 L 1 12.5" stroke="#3A3D38" strokeWidth="0.5" strokeLinecap="round" />
      {/* Dorsal */}
      <path d="M11 6 L 14 3 L 16 6 Z" fill="#3A3D38" />
      {/* Sparse dark spots */}
      <circle cx="13" cy="9" r="0.4" fill="#2A2D28" />
      <circle cx="17" cy="10" r="0.4" fill="#2A2D28" />
      <circle cx="20" cy="8.5" r="0.4" fill="#2A2D28" />
      {/* Eye */}
      <circle cx="5" cy="9" r="0.7" fill="#fff" />
      <circle cx="5" cy="9" r="0.35" fill="#000" />
    </Svg>
  )
}

// Generic fallback for species without a dedicated icon. Uses
// `currentColor` so it inherits the parent's color and visibly
// reads as "unknown species" rather than impersonating a real one.
function GenericFish({ size = S, color = 'currentColor' }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 32 20" fill={color} style={{ flexShrink: 0, display: 'block' }}>
      <path d="M2 10 C 6 5, 18 5, 24 10 L 30 6 L 30 14 L 24 10 C 18 15, 6 15, 2 10 Z" />
      <circle cx="6" cy="9" r="0.9" fill="#fff" />
      <circle cx="6" cy="9" r="0.45" fill="#000" />
    </svg>
  )
}

// Species name → icon component mapping. Lowercased keys.
const SPECIES_ICONS: Record<string, (props: IconProps) => React.ReactNode> = {
  'brown trout': BrownTrout,
  'rainbow trout': RainbowTrout,
  'brook trout': BrookTrout,
  'cutthroat trout': CutthroatTrout,
  'westslope cutthroat trout': CutthroatTrout,
  'lake trout': LakeTrout,
  'steelhead': Steelhead,
  'chinook salmon': ChinookSalmon,
  'coho salmon': CohoSalmon,
  'atlantic salmon': AtlanticSalmon,
  'walleye': Walleye,
  'muskie': Muskie,
  'musky': Muskie,
  'smallmouth bass': SmallmouthBass,
  'largemouth bass': LargemouthBass,
  'channel catfish': ChannelCatfish,
}

export function FishIcon({ species, size, color }: { species: string; size?: number; color?: string }) {
  const key = species.toLowerCase()
  const Icon = SPECIES_ICONS[key] || GenericFish
  return <Icon size={size} color={color} />
}

// For the hatches-page key. We expose a flat list of (label,
// species-name) pairs so the legend stays in sync with the
// actual icon set instead of duplicating labels in two places.
//
// Each entry now points at a SPECIFIC species (no more
// "Rainbow / Cutthroat" sharing one icon) because every species
// has its own distinct icon in v2.
export const SPECIES_ICON_LEGEND: Array<{ label: string; species: string }> = [
  { label: 'Brown Trout', species: 'brown trout' },
  { label: 'Rainbow Trout', species: 'rainbow trout' },
  { label: 'Brook Trout', species: 'brook trout' },
  { label: 'Cutthroat Trout', species: 'cutthroat trout' },
  { label: 'Lake Trout', species: 'lake trout' },
  { label: 'Steelhead', species: 'steelhead' },
  { label: 'Chinook (King) Salmon', species: 'chinook salmon' },
  { label: 'Coho (Silver) Salmon', species: 'coho salmon' },
  { label: 'Atlantic Salmon', species: 'atlantic salmon' },
  { label: 'Walleye', species: 'walleye' },
  { label: 'Muskie', species: 'muskie' },
  { label: 'Smallmouth Bass', species: 'smallmouth bass' },
  { label: 'Largemouth Bass', species: 'largemouth bass' },
  { label: 'Channel Catfish', species: 'channel catfish' },
]

// Returns true when the species name is one we have a dedicated
// icon for (i.e., not the GenericFish fallback). Used by the
// hatches page river card to skip rendering an icon for unknown
// species rather than showing a generic blob.
export function hasFishIcon(species: string): boolean {
  return Object.prototype.hasOwnProperty.call(SPECIES_ICONS, species.toLowerCase())
}

export default FishIcon
