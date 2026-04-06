'use client'

import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { STATES } from '@/data/rivers'

const LIVE_STATES = new Set(Object.keys(STATES))

function toKey(id: string): string {
  const map: Record<string, string> = { 'MI-lp': 'mi', 'MI-up': 'mi' }
  return map[id] ?? id.toLowerCase()
}

interface Tooltip { x: number; y: number; name: string; count: number; live: boolean }

export default function USMap() {
  const router = useRouter()
  const [tooltip, setTooltip] = useState<Tooltip | null>(null)
  const [hovered, setHovered] = useState<string | null>(null)

  const onClick = (id: string) => {
    const key = toKey(id)
    if (LIVE_STATES.has(key)) router.push(`/state/${key}`)
  }

  const onEnter = (e: React.MouseEvent<SVGPathElement>, id: string, name: string) => {
    const key = toKey(id)
    const live = LIVE_STATES.has(key)
    const count = live ? (STATES[key]?.rivers.length ?? 0) : 0
    const r = e.currentTarget.closest('svg')!.getBoundingClientRect()
    setTooltip({ x: e.clientX - r.left, y: e.clientY - r.top - 16, name, count, live })
    setHovered(id)
  }

  const onMove = (e: React.MouseEvent<SVGPathElement>) => {
    const r = e.currentTarget.closest('svg')?.getBoundingClientRect()
    if (r) setTooltip(t => t ? { ...t, x: e.clientX - r.left, y: e.clientY - r.top - 16 } : null)
  }

  const ev = (id: string, name: string) => ({
    onMouseEnter: (e: React.MouseEvent<SVGPathElement>) => onEnter(e, id, name),
    onMouseLeave: () => { setTooltip(null); setHovered(null) },
    onMouseMove: onMove,
    onClick: () => onClick(id),
  })

  // Live state path rendering
  const lp = (id: string, name: string, d: string) => {
    const h = hovered === id
    return (
      <path key={id} id={id} d={d}
        fill={h ? '#4db896' : '#92c5de'}
        stroke={h ? 'rgba(255,255,255,1)' : 'rgba(255,255,255,0.8)'}
        strokeWidth={h ? 1.4 : 0.8}
        cursor="pointer"
        style={{ transition: 'fill .14s, filter .14s', filter: h ? 'drop-shadow(0 2px 6px rgba(0,80,50,.4))' : 'none' }}
        {...ev(id, name)}
      />
    )
  }

  // Coming-soon path rendering
  const sp = (id: string, name: string, d: string) => {
    const h = hovered === id
    return (
      <path key={id} id={id} d={d}
        fill={h ? '#c4c0b8' : '#d8d4cc'}
        stroke="rgba(255,255,255,0.6)"
        strokeWidth={0.55}
        cursor="default"
        style={{ transition: 'fill .1s' }}
        {...ev(id, name)}
      />
    )
  }

  const pulse = (cx: number, cy: number, dur: string) => (
    <g key={`p${cx}${cy}`} style={{ pointerEvents: 'none' }}>
      <circle cx={cx} cy={cy} r={3.5} fill="#1db971" opacity={0.95} />
      <circle cx={cx} cy={cy} r={3.5} fill="#1db971" opacity={0.38}>
        <animate attributeName="r" from="3.5" to="10" dur={dur} repeatCount="indefinite" />
        <animate attributeName="opacity" from="0.38" to="0" dur={dur} repeatCount="indefinite" />
      </circle>
    </g>
  )

  const lbl = (x: number, y: number, text: string) => (
    <text key={`l${text}`} x={x} y={y}
      fontFamily="IBM Plex Mono,monospace" fontSize={7} fontWeight="700"
      fill="#08385a" textAnchor="middle" pointerEvents="none"
      style={{ userSelect: 'none' }}>
      {text}
    </text>
  )

  return (
    <div style={{ position: 'relative', width: '100%', height: '100%' }}>
      <svg viewBox="0 0 960 530" xmlns="http://www.w3.org/2000/svg"
        style={{ width: '100%', height: '100%', display: 'block', borderRadius: '10px', boxShadow: '0 6px 32px rgba(0,0,0,.22)' }}>
        <defs>
          <radialGradient id="ocean" cx="50%" cy="45%" r="60%">
            <stop offset="0%" stopColor="#2e6a9a" />
            <stop offset="100%" stopColor="#152d42" />
          </radialGradient>
          {/* Subtle land texture between states */}
          <pattern id="hatching" patternUnits="userSpaceOnUse" width="3" height="3" patternTransform="rotate(45)">
            <line x1="0" y1="0" x2="0" y2="3" stroke="rgba(255,255,255,0.04)" strokeWidth="1" />
          </pattern>
        </defs>

        {/* Ocean */}
        <rect width="960" height="530" rx="10" fill="url(#ocean)" />
        {/* Very subtle latitude lines */}
        {[100, 160, 220, 280, 340, 400, 460].map(y => (
          <line key={y} x1="20" y1={y} x2="940" y2={y} stroke="rgba(255,255,255,0.035)" strokeWidth="1" />
        ))}

        {/* ── LIVE STATES ─────────────────────────────────────────── */}

        {/* Washington — with Olympic Peninsula bump */}
        {lp('WA', 'Washington',
          'M 92,50 L 132,44 L 168,40 L 200,40 L 210,74 L 204,82 L 196,90 L 180,97 L 162,103 L 140,106 L 118,108 L 100,106 L 88,98 L 82,86 L 84,66 Z')}

        {/* Oregon — Columbia River southern border */}
        {lp('OR', 'Oregon',
          'M 82,86 L 88,98 L 100,106 L 118,108 L 140,106 L 162,103 L 180,97 L 196,90 L 200,112 L 200,136 L 178,146 L 158,152 L 132,156 L 104,156 L 86,156 L 78,140 L 76,120 Z')}

        {/* California — long diagonal coast */}
        {lp('CA', 'California',
          'M 78,140 L 86,156 L 104,156 L 132,156 L 148,188 L 152,218 L 150,250 L 144,276 L 132,298 L 116,314 L 96,322 L 76,308 L 62,284 L 56,256 L 60,226 L 64,200 L 70,172 Z')}

        {/* Idaho — narrow panhandle at top */}
        {lp('ID', 'Idaho',
          'M 200,40 L 258,38 L 262,58 L 264,84 L 252,112 L 244,128 L 220,134 L 196,124 L 196,100 L 196,90 L 200,112 L 200,88 L 204,74 L 210,74 Z')}

        {/* Montana */}
        {lp('MT', 'Montana',
          'M 200,40 L 268,36 L 310,34 L 366,34 L 374,88 L 346,92 L 310,90 L 278,88 L 264,84 L 262,58 L 258,38 Z')}

        {/* Colorado */}
        {lp('CO', 'Colorado',
          'M 262,142 L 344,138 L 350,196 L 264,200 Z')}

        {/* Arizona — NW corner notch for Hoover Dam area */}
        {lp('AZ', 'Arizona',
          'M 144,212 L 162,212 L 184,216 L 208,224 L 228,200 L 234,250 L 224,264 L 196,272 L 172,266 L 148,256 L 136,238 Z')}

        {/* Michigan — LOWER PENINSULA (mitten shape) */}
        {lp('MI-lp', 'Michigan',
          'M 548,174 L 548,158 L 546,144 L 548,132 L 552,122 L 560,116 L 572,113 L 586,113 L 600,117 L 610,125 L 616,135 L 616,148 C 614,156 610,162 604,166 L 608,152 C 612,144 614,138 610,133 C 606,128 598,130 594,138 L 588,156 C 582,164 574,170 564,174 L 554,175 Z')}

        {/* Michigan — UPPER PENINSULA */}
        {lp('MI-up', 'Michigan',
          'M 514,92 L 532,86 L 552,82 L 574,80 L 596,82 L 614,88 L 624,97 L 620,108 L 608,114 L 594,117 L 576,117 L 558,117 L 542,114 L 528,108 L 518,100 Z')}

        {/* Pennsylvania */}
        {lp('PA', 'Pennsylvania',
          'M 616,106 L 636,103 L 656,101 L 674,100 L 676,120 L 676,130 L 648,132 L 624,134 L 618,130 L 616,118 Z')}

        {/* West Virginia */}
        {lp('WV', 'West Virginia',
          'M 618,130 L 624,134 L 648,132 L 650,148 L 648,156 L 634,160 L 624,158 L 616,152 L 614,140 Z')}

        {/* Virginia */}
        {lp('VA', 'Virginia',
          'M 624,158 L 634,160 L 648,156 L 658,154 L 672,150 L 676,168 L 660,174 L 640,178 L 624,176 L 624,165 Z')}

        {/* Kentucky */}
        {lp('KY', 'Kentucky',
          'M 542,174 L 554,175 L 564,174 L 588,172 L 608,168 L 616,162 L 624,158 L 624,165 L 624,176 L 628,186 L 606,192 L 576,196 L 552,196 L 540,192 Z')}

        {/* Tennessee */}
        {lp('TN', 'Tennessee',
          'M 540,192 L 552,196 L 576,196 L 606,192 L 628,186 L 634,210 L 610,215 L 576,216 L 550,216 L 538,214 Z')}

        {/* North Carolina */}
        {lp('NC', 'North Carolina',
          'M 624,176 L 640,178 L 660,174 L 676,170 L 680,186 L 672,192 L 650,194 L 632,194 L 622,192 L 622,184 Z')}

        {/* ── COMING-SOON STATES ───────────────────────────────────── */}

        {sp('WY', 'Wyoming',       'M 258,84 L 340,80 L 344,138 L 262,142 Z')}
        {sp('NV', 'Nevada',        'M 132,156 L 196,124 L 220,134 L 224,192 L 208,224 L 184,216 L 162,212 L 144,212 L 140,188 Z')}
        {sp('UT', 'Utah',          'M 220,134 L 262,142 L 264,200 L 228,200 L 224,192 Z')}
        {sp('NM', 'New Mexico',    'M 228,200 L 264,200 L 350,196 L 354,252 L 234,252 Z')}
        {sp('TX', 'Texas',
          'M 354,252 L 370,244 L 416,230 L 464,220 L 504,218 L 508,256 L 514,306 L 510,340 L 496,366 L 472,384 L 450,390 L 420,376 L 392,350 L 368,316 L 356,284 Z')}
        {sp('OK', 'Oklahoma',      'M 302,248 L 354,252 L 356,268 L 380,228 L 464,224 L 504,218 L 504,224 L 302,260 Z')}
        {sp('KS', 'Kansas',        'M 380,184 L 500,180 L 504,218 L 380,228 Z')}
        {sp('NE', 'Nebraska',      'M 376,140 L 500,138 L 500,180 L 380,184 Z')}
        {sp('SD', 'South Dakota',  'M 374,90 L 496,88 L 500,138 L 376,140 Z')}
        {sp('ND', 'North Dakota',  'M 372,90 L 374,48 L 492,44 L 496,88 L 374,90 Z')}
        {sp('MN', 'Minnesota',     'M 492,44 L 564,40 L 568,52 L 556,80 L 546,92 L 496,88 Z')}
        {sp('IA', 'Iowa',          'M 496,88 L 546,92 L 550,136 L 500,138 Z')}
        {sp('MO', 'Missouri',      'M 500,138 L 550,136 L 558,180 L 556,196 L 528,202 L 502,204 L 500,180 Z')}
        {sp('AR', 'Arkansas',      'M 502,204 L 528,202 L 556,196 L 558,228 L 502,232 Z')}
        {sp('LA', 'Louisiana',     'M 502,232 L 558,228 L 554,270 L 536,282 L 516,282 L 492,272 Z')}
        {sp('WI', 'Wisconsin',     'M 544,68 L 572,62 L 588,80 L 584,104 L 568,118 L 552,114 L 540,98 Z')}
        {sp('IL', 'Illinois',      'M 548,116 L 570,122 L 568,174 L 540,176 L 536,154 L 540,130 Z')}
        {sp('IN', 'Indiana',       'M 570,122 L 590,122 L 592,168 L 568,174 Z')}
        {sp('OH', 'Ohio',          'M 590,114 L 616,106 L 616,118 L 618,130 L 614,140 L 600,160 L 590,168 L 586,155 L 590,130 Z')}
        {sp('SC', 'South Carolina','M 622,192 L 622,184 L 632,194 L 650,194 L 656,212 L 630,216 Z')}
        {sp('GA', 'Georgia',       'M 590,216 L 630,216 L 634,262 L 592,266 Z')}
        {sp('FL', 'Florida',
          'M 592,266 L 634,262 L 640,288 L 644,312 L 632,338 L 618,352 L 604,350 L 590,328 L 582,296 Z')}
        {sp('AL', 'Alabama',       'M 558,216 L 590,216 L 592,266 L 560,264 Z')}
        {sp('MS', 'Mississippi',   'M 502,232 L 538,230 L 540,268 L 520,272 Z')}
        {sp('NY', 'New York',
          'M 616,80 L 654,76 L 690,74 L 692,92 L 684,100 L 674,100 L 660,100 L 648,98 L 638,100 L 624,100 L 618,96 Z')}
        {sp('NJ', 'New Jersey',    'M 684,100 L 692,98 L 697,118 L 692,128 L 682,128 Z')}
        {sp('MD', 'Maryland',      'M 648,130 L 676,126 L 680,138 L 668,142 L 648,142 Z')}
        {sp('DE', 'Delaware',      'M 684,128 L 692,126 L 694,140 L 684,140 Z')}
        {sp('MA', 'Massachusetts', 'M 692,92 L 726,90 L 728,102 L 718,104 L 700,104 L 692,102 Z')}
        {sp('ME', 'Maine',         'M 712,58 L 738,54 L 742,86 L 714,90 Z')}
        {sp('CT', 'Connecticut',   'M 716,102 L 728,102 L 728,114 L 716,114 Z')}
        {sp('RI', 'Rhode Island',  'M 728,100 L 736,100 L 736,112 L 728,112 Z')}
        {sp('VT', 'Vermont',       'M 690,70 L 702,68 L 702,90 L 690,90 Z')}
        {sp('NH', 'New Hampshire', 'M 702,60 L 714,58 L 714,90 L 702,90 Z')}

        {/* ── LIVE STATE LABELS ────────────────────────────────────── */}
        {lbl(146, 51,  'WA')}
        {lbl(142, 124, 'OR')}
        {lbl(100, 244, 'CA')}
        {lbl(232, 76,  'ID')}
        {lbl(287, 60,  'MT')}
        {lbl(306, 172, 'CO')}
        {lbl(186, 238, 'AZ')}
        {lbl(582, 148, 'MI')}
        {lbl(569, 96,  'MI·UP')}
        {lbl(648, 117, 'PA')}
        {lbl(634, 146, 'WV')}
        {lbl(650, 165, 'VA')}
        {lbl(584, 187, 'KY')}
        {lbl(586, 207, 'TN')}
        {lbl(650, 185, 'NC')}

        {/* ── PULSE DOTS on live states ────────────────────────────── */}
        {pulse(146, 44,  '2.0s')}
        {pulse(142, 120, '2.1s')}
        {pulse(100, 240, '2.5s')}
        {pulse(232, 58,  '2.3s')}
        {pulse(287, 62,  '2.6s')}
        {pulse(306, 168, '2.2s')}
        {pulse(186, 234, '2.4s')}
        {pulse(582, 145, '2.0s')}
        {pulse(569, 90,  '2.2s')}
        {pulse(648, 114, '2.1s')}
        {pulse(634, 143, '2.4s')}
        {pulse(650, 162, '2.2s')}
        {pulse(584, 184, '2.3s')}
        {pulse(586, 204, '2.2s')}
        {pulse(650, 182, '2.1s')}

        {/* ── Alaska / Hawaii insets ───────────────────────────────── */}
        <g>
          <rect x="26" y="428" width="120" height="74" rx="6" fill="#163347" stroke="rgba(255,255,255,0.12)" strokeWidth={0.7} />
          <text x="86" y="456" fontFamily="IBM Plex Mono,monospace" fontSize={10} fontWeight="500" fill="#5fa8cc" textAnchor="middle">Alaska</text>
          <text x="86" y="472" fontFamily="IBM Plex Mono,monospace" fontSize={8} fill="rgba(255,255,255,0.3)" textAnchor="middle">coming soon</text>
        </g>
        <g>
          <rect x="160" y="428" width="82" height="54" rx="6" fill="#163347" stroke="rgba(255,255,255,0.12)" strokeWidth={0.7} />
          <text x="201" y="459" fontFamily="IBM Plex Mono,monospace" fontSize={10} fontWeight="500" fill="#5fa8cc" textAnchor="middle">Hawaii</text>
          <text x="201" y="474" fontFamily="IBM Plex Mono,monospace" fontSize={8} fill="rgba(255,255,255,0.3)" textAnchor="middle">coming soon</text>
        </g>

        {/* ── Footer ──────────────────────────────────────────────── */}
        <text x="480" y="516" fontFamily="IBM Plex Mono,monospace" fontSize={8.5} fill="rgba(255,255,255,0.32)" textAnchor="middle">
          14 states live · WA · OR · ID · MT · CO · CA · MI · PA · WV · VA · KY · TN · NC · AZ — more added monthly
        </text>
      </svg>

      {/* Tooltip */}
      {tooltip && (
        <div style={{
          position: 'absolute', left: tooltip.x + 14, top: tooltip.y,
          background: 'var(--bg)', border: '.5px solid var(--bd2)',
          borderRadius: 'var(--r)', padding: '8px 13px',
          fontFamily: "'IBM Plex Mono', monospace",
          pointerEvents: 'none', boxShadow: '0 4px 18px rgba(0,0,0,.18)',
          zIndex: 50, whiteSpace: 'nowrap',
        }}>
          <div style={{ fontSize: '12px', fontWeight: 600, color: 'var(--rvdk)', marginBottom: '3px' }}>{tooltip.name}</div>
          {tooltip.live
            ? <div style={{ fontSize: '10px', color: 'var(--rv)' }}>● {tooltip.count} rivers · click to explore</div>
            : <div style={{ fontSize: '10px', color: 'var(--tx3)' }}>Coming soon</div>
          }
        </div>
      )}

      {/* Legend */}
      <div style={{
        position: 'absolute', bottom: '16px', right: '14px',
        display: 'flex', gap: '16px',
        fontFamily: "'IBM Plex Mono', monospace", fontSize: '9px',
        color: 'rgba(255,255,255,0.55)',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
          <div style={{ width: '10px', height: '10px', borderRadius: '2px', background: '#92c5de' }} />
          Live data
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
          <div style={{ width: '10px', height: '10px', borderRadius: '2px', background: '#d8d4cc' }} />
          Coming soon
        </div>
      </div>
    </div>
  )
}
