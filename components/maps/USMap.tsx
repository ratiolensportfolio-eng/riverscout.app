'use client'

import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { STATES } from '@/data/rivers'

const LIVE_STATES = new Set(Object.keys(STATES))

// Multi-part states map to a single state key
function toKey(id: string): string {
  const map: Record<string, string> = {
    'MI-lp': 'mi',
    'MI-up': 'mi',
  }
  return map[id] ?? id.toLowerCase()
}

interface Tooltip {
  x: number
  y: number
  name: string
  count: number
  live: boolean
}

export default function USMap() {
  const router = useRouter()
  const [tooltip, setTooltip] = useState<Tooltip | null>(null)
  const [hovered, setHovered] = useState<string | null>(null)

  function handleClick(id: string) {
    const key = toKey(id)
    if (LIVE_STATES.has(key)) router.push(`/state/${key}`)
  }

  function handleEnter(e: React.MouseEvent<SVGElement>, id: string, name: string) {
    const key = toKey(id)
    const live = LIVE_STATES.has(key)
    const count = live ? (STATES[key]?.rivers.length ?? 0) : 0
    const svgRect = e.currentTarget.closest('svg')!.getBoundingClientRect()
    setTooltip({ x: e.clientX - svgRect.left, y: e.clientY - svgRect.top - 14, name, count, live })
    setHovered(id)
  }

  function handleLeave() {
    setTooltip(null)
    setHovered(null)
  }

  function handleMove(e: React.MouseEvent<SVGElement>) {
    const svgRect = e.currentTarget.closest('svg')?.getBoundingClientRect()
    if (svgRect) setTooltip(t => t ? { ...t, x: e.clientX - svgRect.left, y: e.clientY - svgRect.top - 14 } : null)
  }

  // Shared pointer events
  const events = (id: string, name: string) => ({
    onMouseEnter: (e: React.MouseEvent<SVGPathElement>) => handleEnter(e, id, name),
    onMouseLeave: handleLeave,
    onMouseMove: (e: React.MouseEvent<SVGPathElement>) => handleMove(e),
    onClick: () => handleClick(id),
  })

  function liveFill(id: string) {
    if (hovered === id) return 'url(#fill-live-hover)'
    return 'url(#fill-live)'
  }

  function soonFill(id: string) {
    if (hovered === id) return '#c8c4bc'
    return '#d4d0c8'
  }

  function liveStroke(id: string) {
    return hovered === id ? 'rgba(255,255,255,0.95)' : 'rgba(255,255,255,0.75)'
  }

  function liveStrokeW(id: string) {
    return hovered === id ? 1.2 : 0.7
  }

  function liveCursor(id: string) {
    return LIVE_STATES.has(toKey(id)) ? 'pointer' : 'default'
  }

  const lp = (id: string, name: string, d: string) => (
    <path
      key={id}
      id={id}
      d={d}
      fill={liveFill(id)}
      stroke={liveStroke(id)}
      strokeWidth={liveStrokeW(id)}
      cursor={liveCursor(id)}
      style={{ transition: 'fill .15s, stroke .15s, filter .15s', filter: hovered === id ? 'drop-shadow(0 1px 4px rgba(0,80,60,.35))' : 'none' }}
      {...events(id, name)}
    />
  )

  const sp = (id: string, name: string, d: string) => (
    <path
      key={id}
      id={id}
      d={d}
      fill={soonFill(id)}
      stroke="rgba(255,255,255,0.65)"
      strokeWidth={hovered === id ? 0.9 : 0.55}
      cursor="default"
      style={{ transition: 'fill .12s' }}
      {...events(id, name)}
    />
  )

  const pulse = (cx: number, cy: number, dur: string) => (
    <g key={`pulse-${cx}-${cy}`} style={{ pointerEvents: 'none' }}>
      <circle cx={cx} cy={cy} r={3.5} fill="#1db971" opacity={0.95} />
      <circle cx={cx} cy={cy} r={3.5} fill="#1db971" opacity={0.4}>
        <animate attributeName="r" from="3.5" to="10" dur={dur} repeatCount="indefinite" />
        <animate attributeName="opacity" from="0.4" to="0" dur={dur} repeatCount="indefinite" />
      </circle>
    </g>
  )

  const lbl = (x: number, y: number, text: string) => (
    <text key={`lbl-${text}`} x={x} y={y} fontFamily="IBM Plex Mono,monospace" fontSize={7.5}
      fill="#0a3558" fontWeight="600" textAnchor="middle" pointerEvents="none"
      style={{ textShadow: '0 0 4px rgba(255,255,255,0.6)', userSelect: 'none' }}>
      {text}
    </text>
  )

  return (
    <div style={{ position: 'relative', width: '100%', height: '100%' }}>
      <svg
        viewBox="0 0 960 530"
        xmlns="http://www.w3.org/2000/svg"
        style={{ width: '100%', height: '100%', display: 'block', borderRadius: '8px', boxShadow: '0 4px 24px rgba(0,0,0,.18)' }}
      >
        <defs>
          {/* Ocean background gradient */}
          <radialGradient id="ocean-grad" cx="50%" cy="50%" r="65%">
            <stop offset="0%" stopColor="#3a7ca5" />
            <stop offset="100%" stopColor="#1a3f5c" />
          </radialGradient>

          {/* Live state fill gradient — calm blue */}
          <linearGradient id="fill-live" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#a8d4ec" />
            <stop offset="100%" stopColor="#7eb8d8" />
          </linearGradient>

          {/* Live state hover fill — teal */}
          <linearGradient id="fill-live-hover" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#5dcaa5" />
            <stop offset="100%" stopColor="#3daa88" />
          </linearGradient>

          {/* Subtle land texture for non-state fill */}
          <pattern id="land-texture" patternUnits="userSpaceOnUse" width="4" height="4">
            <rect width="4" height="4" fill="#cbc8c0" />
            <rect width="2" height="2" fill="#c8c5bd" />
          </pattern>
        </defs>

        {/* Ocean background */}
        <rect width="960" height="530" rx="8" fill="url(#ocean-grad)" />

        {/* Subtle ocean shimmer lines */}
        {[60, 110, 160, 210, 260, 310, 360, 410, 460].map(y => (
          <line key={y} x1="0" y1={y} x2="960" y2={y} stroke="rgba(255,255,255,0.04)" strokeWidth="1" />
        ))}

        {/* ── LIVE STATES ─────────────────────────────── */}
        {lp('WA', 'Washington',   'M92,48 L200,40 L210,74 L196,88 L170,94 L130,102 L100,102 L86,88 Z')}
        {lp('OR', 'Oregon',       'M86,88 L130,102 L170,94 L196,88 L200,136 L174,148 L136,154 L86,154 L78,134 Z')}
        {lp('CA', 'California',   'M78,154 L136,154 L150,192 L148,252 L128,300 L96,320 L68,300 L58,262 L64,204 Z')}
        {lp('ID', 'Idaho',        'M200,40 L258,38 L264,84 L248,124 L218,132 L196,122 L196,88 L210,74 Z')}
        {lp('MT', 'Montana',      'M200,40 L366,36 L372,90 L338,94 L298,90 L264,84 L258,38 Z')}
        {lp('CO', 'Colorado',     'M262,142 L342,138 L348,196 L262,198 Z')}
        {lp('AZ', 'Arizona',      'M148,210 L206,224 L228,198 L232,250 L172,264 L138,254 Z')}
        {lp('MI-lp', 'Michigan',  'M551,120 L564,116 L578,114 L594,116 L608,124 L616,136 L614,152 L606,162 L594,168 L580,172 L566,172 L555,166 L548,154 L548,140 Z')}
        {lp('MI-up', 'Michigan',  'M516,90 L538,84 L560,80 L582,80 L600,82 L616,88 L624,98 L618,108 L604,114 L590,116 L574,116 L558,116 L542,114 L528,108 Z')}
        {lp('PA', 'Pennsylvania', 'M618,108 L670,104 L674,130 L642,130 L616,134 Z')}
        {lp('WV', 'West Virginia','M616,134 L642,130 L648,152 L626,156 L618,150 Z')}
        {lp('VA', 'Virginia',     'M626,152 L672,148 L674,170 L626,174 Z')}
        {lp('KY', 'Kentucky',     'M540,172 L566,172 L590,168 L623,154 L626,188 L558,194 Z')}
        {lp('TN', 'Tennessee',    'M558,194 L626,188 L630,212 L556,216 Z')}
        {lp('NC', 'North Carolina','M626,174 L670,170 L674,190 L622,192 Z')}

        {/* ── COMING-SOON STATES ───────────────────────── */}
        {sp('WY', 'Wyoming',       'M258,84 L338,82 L342,138 L262,142 Z')}
        {sp('NV', 'Nevada',        'M136,154 L196,122 L218,132 L222,192 L206,224 L148,210 L140,186 Z')}
        {sp('UT', 'Utah',          'M218,132 L262,142 L262,198 L228,198 L222,192 Z')}
        {sp('NM', 'New Mexico',    'M228,198 L262,198 L348,196 L352,248 L234,250 Z')}
        {sp('TX', 'Texas',         'M352,248 L500,224 L506,260 L512,316 L490,364 L440,382 L388,352 L354,312 Z')}
        {sp('OK', 'Oklahoma',      'M382,226 L498,222 L500,224 L352,248 L354,262 Z')}
        {sp('KS', 'Kansas',        'M380,184 L496,182 L498,222 L382,226 Z')}
        {sp('NE', 'Nebraska',      'M376,140 L494,140 L496,182 L380,184 Z')}
        {sp('SD', 'South Dakota',  'M374,90 L492,90 L494,140 L376,140 Z')}
        {sp('ND', 'North Dakota',  'M372,90 L372,46 L488,42 L492,90 Z')}
        {sp('MN', 'Minnesota',     'M492,42 L562,40 L566,50 L552,80 L542,90 L494,90 Z')}
        {sp('IA', 'Iowa',          'M494,90 L542,90 L546,134 L496,140 Z')}
        {sp('MO', 'Missouri',      'M496,140 L546,134 L554,180 L526,200 L498,204 L496,182 Z')}
        {sp('AR', 'Arkansas',      'M498,204 L554,180 L556,228 L500,230 Z')}
        {sp('LA', 'Louisiana',     'M500,230 L556,228 L552,272 L516,284 L488,272 Z')}
        {sp('WI', 'Wisconsin',     'M542,66 L570,60 L586,78 L582,102 L566,116 L548,110 L536,96 Z')}
        {sp('IL', 'Illinois',      'M548,118 L568,122 L566,172 L542,176 L536,152 L538,128 Z')}
        {sp('IN', 'Indiana',       'M568,122 L588,122 L590,168 L566,172 Z')}
        {sp('OH', 'Ohio',          'M588,114 L618,108 L623,154 L600,160 L590,168 Z')}
        {sp('SC', 'South Carolina','M622,192 L650,188 L654,210 L626,212 Z')}
        {sp('GA', 'Georgia',       'M588,214 L622,210 L626,262 L590,264 Z')}
        {sp('FL', 'Florida',       'M590,264 L626,262 L634,292 L618,330 L602,348 L584,328 L574,288 Z')}
        {sp('AL', 'Alabama',       'M556,216 L588,214 L590,264 L558,262 Z')}
        {sp('MS', 'Mississippi',   'M500,230 L536,228 L538,268 L520,272 Z')}
        {sp('NY', 'New York',      'M618,94 L684,90 L688,108 L670,104 L618,108 L612,106 Z')}
        {sp('NJ', 'New Jersey',    'M681,108 L690,106 L694,128 L682,130 Z')}
        {sp('MD', 'Maryland',      'M650,128 L676,124 L678,136 L656,138 Z')}
        {sp('DE', 'Delaware',      'M682,124 L690,122 L692,134 L682,134 Z')}
        {sp('MA', 'Massachusetts', 'M688,90 L722,88 L724,100 L714,100 L694,100 L688,102 Z')}
        {sp('ME', 'Maine',         'M710,58 L734,56 L738,88 L712,90 L710,68 Z')}
        {sp('CT', 'Connecticut',   'M714,100 L726,100 L726,112 L714,112 Z')}
        {sp('RI', 'Rhode Island',  'M726,100 L734,100 L734,112 L726,112 Z')}
        {sp('VT', 'Vermont',       'M688,68 L700,68 L700,90 L688,90 Z')}
        {sp('NH', 'New Hampshire', 'M700,60 L712,58 L712,90 L700,90 Z')}

        {/* ── LABELS for live states ────────────────────── */}
        {lbl(145, 50,  'WA')}
        {lbl(145, 123, 'OR')}
        {lbl(97,  240, 'CA')}
        {lbl(229, 78,  'ID')}
        {lbl(283, 61,  'MT')}
        {lbl(305, 172, 'CO')}
        {lbl(184, 232, 'AZ')}
        {lbl(581, 147, 'MI')}
        {lbl(568, 96,  'MI UP')}
        {lbl(647, 120, 'PA')}
        {lbl(633, 144, 'WV')}
        {lbl(650, 162, 'VA')}
        {lbl(583, 184, 'KY')}
        {lbl(592, 205, 'TN')}
        {lbl(650, 182, 'NC')}

        {/* ── ANIMATED PULSE DOTS on live states ─────────── */}
        {pulse(145,  42, '2.0s')}
        {pulse(145, 120, '2.1s')}
        {pulse(97,  237, '2.5s')}
        {pulse(230,  60, '2.3s')}
        {pulse(283,  63, '2.6s')}
        {pulse(305, 168, '2.2s')}
        {pulse(184, 230, '2.4s')}
        {pulse(581, 146, '2.0s')}
        {pulse(570,  92, '2.2s')}
        {pulse(648, 118, '2.1s')}
        {pulse(633, 142, '2.4s')}
        {pulse(650, 160, '2.2s')}
        {pulse(582, 181, '2.3s')}
        {pulse(592, 202, '2.2s')}
        {pulse(650, 181, '2.1s')}

        {/* ── Alaska / Hawaii insets ───────────────────── */}
        <g>
          <rect x="28" y="430" width="116" height="72" rx="5" fill="#1e4e6e" stroke="rgba(255,255,255,0.15)" strokeWidth={0.7} />
          <text x="86" y="456" fontFamily="IBM Plex Mono,monospace" fontSize={9.5} fill="#7ab4d0" textAnchor="middle" fontWeight="500">Alaska</text>
          <text x="86" y="471" fontFamily="IBM Plex Mono,monospace" fontSize={8} fill="rgba(255,255,255,0.35)" textAnchor="middle">coming soon</text>
        </g>
        <g>
          <rect x="158" y="430" width="80" height="52" rx="5" fill="#1e4e6e" stroke="rgba(255,255,255,0.15)" strokeWidth={0.7} />
          <text x="198" y="461" fontFamily="IBM Plex Mono,monospace" fontSize={9.5} fill="#7ab4d0" textAnchor="middle" fontWeight="500">Hawaii</text>
          <text x="198" y="474" fontFamily="IBM Plex Mono,monospace" fontSize={8} fill="rgba(255,255,255,0.35)" textAnchor="middle">coming soon</text>
        </g>

        {/* ── Footer label ────────────────────────────── */}
        <text x="480" y="516" fontFamily="IBM Plex Mono,monospace" fontSize={8.5} fill="rgba(255,255,255,0.4)" textAnchor="middle">
          14 states live · WA · OR · ID · MT · CO · CA · MI · PA · WV · VA · KY · TN · NC · AZ — more added monthly
        </text>
      </svg>

      {/* ── Tooltip ────────────────────────────────────── */}
      {tooltip && (
        <div style={{
          position: 'absolute',
          left: tooltip.x + 14,
          top: tooltip.y,
          background: 'var(--bg)',
          border: '.5px solid var(--bd2)',
          borderRadius: 'var(--r)',
          padding: '8px 13px',
          fontFamily: "'IBM Plex Mono', monospace",
          pointerEvents: 'none',
          boxShadow: '0 4px 16px rgba(0,0,0,.18)',
          zIndex: 50,
          whiteSpace: 'nowrap',
          minWidth: '130px',
        }}>
          <div style={{ fontSize: '12px', fontWeight: 600, color: 'var(--rvdk)', marginBottom: '3px' }}>{tooltip.name}</div>
          {tooltip.live ? (
            <div style={{ fontSize: '10px', color: 'var(--rv)' }}>
              <span style={{ marginRight: '6px' }}>●</span>{tooltip.count} rivers · click to explore
            </div>
          ) : (
            <div style={{ fontSize: '10px', color: 'var(--tx3)' }}>Coming soon</div>
          )}
        </div>
      )}

      {/* ── Legend ────────────────────────────────────── */}
      <div style={{
        position: 'absolute', bottom: '18px', right: '14px',
        display: 'flex', gap: '16px',
        fontFamily: "'IBM Plex Mono', monospace", fontSize: '9px',
        color: 'rgba(255,255,255,0.65)',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
          <div style={{ width: '10px', height: '10px', borderRadius: '2px', background: 'linear-gradient(#a8d4ec, #7eb8d8)' }} />
          Live data
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
          <div style={{ width: '10px', height: '10px', borderRadius: '2px', background: '#d4d0c8' }} />
          Coming soon
        </div>
      </div>
    </div>
  )
}
