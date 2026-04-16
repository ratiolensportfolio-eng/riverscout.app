'use client'

// 10-day CFS sparkline for the river page hero — 7 days past + 3 days
// forecast. Fits the dead space between the river-name column and the
// CFS number column.
//
// Data:
//   - Past 7 days come from `readings` (already loaded server-side
//     for the page hero — 15-min instantaneous values, downsampled
//     here to one mean per day so the line stays clean).
//   - Next 3 days fetched async from /api/pro/forecast (the same
//     endpoint that powers the Overview tab's forecast chart). The
//     fetch happens on mount, so the historical half renders
//     immediately and the forecast tail fades in.
//
// Visual:
//   - Solid line for past, dashed for forecast.
//   - Tiny dot at the rightmost historical point (current cfs).
//   - Subtle vertical "today" divider.
//   - Optimal range as an 8% green band behind the line.
//   - Background tints amber if line is above the band, blue if below.
//   - Hover anywhere → minimal tooltip with date + cfs.
//   - 80px tall on desktop, 60px on mobile.

import { useEffect, useMemo, useRef, useState } from 'react'
import type { FlowCondition } from '@/types'

interface Props {
  readings: Array<{ t: string; v: number }>
  optRange: string                  // "200–800" style
  condition: FlowCondition
  gaugeId: string
  currentCfs: number | null
  // Historical average flow for this river — drives the reference
  // band (±10% around avg) and the dashed midline label so users
  // can see at a glance whether current flow is above or below
  // normal-for-time-of-year. Pass 0 (or omit) when unknown to skip.
  avgFlow?: number
}

const CONDITION_STROKE: Record<FlowCondition, string> = {
  optimal: '#1D9E75',
  low:     '#3F77E0',
  high:    '#BA7517',
  flood:   '#A32D2D',
  loading: '#aaa99a',
}

interface ForecastPoint { time: string; cfs: number }

// Group readings by yyyy-mm-dd in local time and take the daily mean.
function dailyMeans(readings: Array<{ t: string; v: number }>): Array<{ date: Date; v: number }> {
  if (!readings.length) return []
  const byDay = new Map<string, number[]>()
  for (const r of readings) {
    const d = new Date(r.t)
    const key = `${d.getFullYear()}-${d.getMonth() + 1}-${d.getDate()}`
    const arr = byDay.get(key) ?? []
    arr.push(r.v)
    byDay.set(key, arr)
  }
  const out: Array<{ date: Date; v: number }> = []
  for (const [key, vals] of byDay) {
    const [y, m, dd] = key.split('-').map(Number)
    const sum = vals.reduce((a, b) => a + b, 0)
    out.push({ date: new Date(y, m - 1, dd), v: sum / vals.length })
  }
  out.sort((a, b) => a.date.getTime() - b.date.getTime())
  return out
}

function parseOptRange(opt: string): [number, number] | null {
  if (!opt) return null
  // Handles "200–800", "200-800", "200 – 800"
  const parts = opt.split(/[\u2013\u2014-]/).map(s => parseFloat(s.trim()))
  if (parts.length !== 2 || !isFinite(parts[0]) || !isFinite(parts[1])) return null
  return [Math.min(...parts), Math.max(...parts)]
}

function fmtDate(d: Date) {
  return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
}

export default function HeroSparkline({ readings, optRange, condition, gaugeId, currentCfs, avgFlow }: Props) {
  const [forecast, setForecast] = useState<ForecastPoint[] | null>(null)
  // Forecast disabled — NOAA predictions were producing wildly
  // inaccurate jumps (6k→14k CFS). Historical-only until the
  // forecast pipeline is verified. The component gracefully renders
  // just the solid historical line when forecastFailed is true.
  const [forecastFailed, setForecastFailed] = useState(true)
  const [hover, setHover] = useState<{ x: number; y: number; label: string } | null>(null)
  const containerRef = useRef<HTMLDivElement>(null)

  // Pull the NOAA forecast once. The endpoint sometimes returns 404
  // (no NWS mapping for that gauge) — that's fine, we'll just render
  // historical-only.
  useEffect(() => {
    if (!gaugeId) { setForecastFailed(true); return }
    let cancel = false
    fetch(`/api/pro/forecast?gaugeId=${gaugeId}`)
      .then(r => r.json())
      .then(d => {
        if (cancel) return
        if (d.forecasts?.length) setForecast(d.forecasts)
        else setForecastFailed(true)
      })
      .catch(() => { if (!cancel) setForecastFailed(true) })
    return () => { cancel = true }
  }, [gaugeId])

  const past = useMemo(() => dailyMeans(readings), [readings])
  const futureDaily = useMemo(() => {
    if (!forecast?.length) return []
    return dailyMeans(forecast.map(f => ({ t: f.time, v: f.cfs })))
  }, [forecast])

  const optBand = useMemo(() => parseOptRange(optRange), [optRange])

  if (!past.length && !futureDaily.length && !forecastFailed) {
    return <SkeletonPulse />
  }

  // Combine past + future into one ordered array. Tag each point so
  // the renderer knows which segment it belongs to.
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  type Point = { date: Date; v: number; future: boolean }
  const all: Point[] = [
    ...past.map(p => ({ ...p, future: false })),
    ...futureDaily
      .filter(p => p.date.getTime() > (past.at(-1)?.date.getTime() ?? 0))
      .map(p => ({ ...p, future: true })),
  ]
  if (!all.length) return null

  const W = 600, H = 130, PAD_X = 4, PAD_Y = 8
  const minDate = all[0].date.getTime()
  const maxDate = all.at(-1)!.date.getTime()
  const dateSpan = Math.max(maxDate - minDate, 24 * 60 * 60 * 1000)
  // Include avg-flow band in the y-extent so the reference line
  // is always visible even when actual readings are far above or
  // below the historical norm.
  const avgBandHigh = avgFlow && avgFlow > 0 ? avgFlow * 1.1 : null
  const avgBandLow  = avgFlow && avgFlow > 0 ? avgFlow * 0.9 : null
  const yExtents = [
    ...all.map(p => p.v),
    ...(optBand ? optBand : []),
    ...(avgBandHigh != null ? [avgBandHigh, avgBandLow!] : []),
  ]
  const minV = Math.min(...yExtents)
  const maxV = Math.max(...yExtents)
  const vSpan = Math.max(maxV - minV, 1)

  const xOf = (d: Date) => PAD_X + ((d.getTime() - minDate) / dateSpan) * (W - 2 * PAD_X)
  const yOf = (v: number) => PAD_Y + (1 - (v - minV) / vSpan) * (H - 2 * PAD_Y)

  // Split into past polyline + future polyline (joined at boundary).
  const splitIdx = all.findIndex(p => p.future)
  const pastPoints = splitIdx === -1 ? all : all.slice(0, splitIdx + 1)
  // Bridge first future to last past so the line is continuous
  const futurePoints = splitIdx === -1 ? [] : all.slice(splitIdx === 0 ? 0 : splitIdx - 1)

  // Monotone (Fritsch-Carlson) cubic interpolation — produces smooth
  // curves without overshooting between data points. Same algorithm
  // d3-shape uses for curveMonotoneX. Falls back to a straight line
  // when there are fewer than 3 points.
  const pathFor = (pts: Point[]) => {
    if (pts.length === 0) return ''
    const px = pts.map(p => xOf(p.date))
    const py = pts.map(p => yOf(p.v))
    if (pts.length === 1) return `M${px[0].toFixed(1)},${py[0].toFixed(1)}`
    if (pts.length === 2) return `M${px[0].toFixed(1)},${py[0].toFixed(1)}L${px[1].toFixed(1)},${py[1].toFixed(1)}`
    const n = pts.length
    const dx: number[] = [], dy: number[] = [], m: number[] = []
    for (let i = 0; i < n - 1; i++) {
      dx[i] = px[i + 1] - px[i]
      dy[i] = py[i + 1] - py[i]
      m[i] = dx[i] === 0 ? 0 : dy[i] / dx[i]
    }
    const tangents: number[] = [m[0]]
    for (let i = 1; i < n - 1; i++) {
      tangents.push(m[i - 1] * m[i] <= 0 ? 0 : (m[i - 1] + m[i]) / 2)
    }
    tangents.push(m[n - 2])
    let path = `M${px[0].toFixed(1)},${py[0].toFixed(1)}`
    for (let i = 0; i < n - 1; i++) {
      const cx1 = px[i] + dx[i] / 3
      const cy1 = py[i] + (tangents[i] * dx[i]) / 3
      const cx2 = px[i + 1] - dx[i] / 3
      const cy2 = py[i + 1] - (tangents[i + 1] * dx[i]) / 3
      path += ` C${cx1.toFixed(1)},${cy1.toFixed(1)} ${cx2.toFixed(1)},${cy2.toFixed(1)} ${px[i + 1].toFixed(1)},${py[i + 1].toFixed(1)}`
    }
    return path
  }

  const stroke = CONDITION_STROKE[condition] ?? CONDITION_STROKE.loading

  const todayX = (() => {
    if (today.getTime() <= minDate) return PAD_X
    if (today.getTime() >= maxDate) return W - PAD_X
    return xOf(today)
  })()

  function onMove(e: React.MouseEvent<SVGSVGElement>) {
    const rect = e.currentTarget.getBoundingClientRect()
    const x = e.clientX - rect.left
    const ratio = (x - PAD_X) / (W - 2 * PAD_X)
    const t = minDate + ratio * dateSpan
    let nearest = all[0]; let bestD = Infinity
    for (const p of all) {
      const d = Math.abs(p.date.getTime() - t)
      if (d < bestD) { bestD = d; nearest = p }
    }
    setHover({
      x: xOf(nearest.date),
      y: yOf(nearest.v),
      label: `${fmtDate(nearest.date)}${nearest.future ? ' (forecast)' : ''}: ${Math.round(nearest.v).toLocaleString()} cfs`,
    })
  }

  return (
    <div
      ref={containerRef}
      className="hero-sparkline"
      style={{
        flex: '1 1 320px', minWidth: 0, maxWidth: '600px',
        position: 'relative', alignSelf: 'center',
      }}
    >
      <svg
        viewBox={`0 0 ${W} ${H}`}
        preserveAspectRatio="none"
        style={{ width: '100%', height: '130px', display: 'block', background: 'transparent' }}
        onMouseMove={onMove}
        onMouseLeave={() => setHover(null)}
      >
        {/* Above-optimal red tint — entire chart area above optBand max */}
        {optBand && yOf(optBand[1]) > PAD_Y && (
          <rect
            x={0} width={W}
            y={PAD_Y} height={Math.max(yOf(optBand[1]) - PAD_Y, 0)}
            fill="rgba(163, 45, 45, 0.04)"
          />
        )}
        {/* Below-optimal blue tint — chart area below optBand min */}
        {optBand && yOf(optBand[0]) < H - PAD_Y && (
          <rect
            x={0} width={W}
            y={yOf(optBand[0])} height={Math.max(H - PAD_Y - yOf(optBand[0]), 0)}
            fill="rgba(63, 119, 224, 0.03)"
          />
        )}
        {/* Optimal band — soft green between min and max */}
        {optBand && (
          <rect
            x={0} width={W}
            y={yOf(optBand[1])} height={Math.max(yOf(optBand[0]) - yOf(optBand[1]), 1)}
            fill="rgba(29, 158, 117, 0.08)"
          />
        )}
        {/* Historical-average reference band — ±10% around avgFlow.
            Drawn AFTER the optimal band so the teal stays visible
            even where the two overlap. */}
        {avgFlow && avgFlow > 0 && avgBandHigh != null && avgBandLow != null && (
          <>
            <rect
              x={0} width={W}
              y={yOf(avgBandHigh)} height={Math.max(yOf(avgBandLow) - yOf(avgBandHigh), 1)}
              fill="rgba(120, 140, 150, 0.08)"
            />
            <line
              x1={0} x2={W}
              y1={yOf(avgFlow)} y2={yOf(avgFlow)}
              stroke="rgba(110, 120, 130, 0.45)" strokeWidth={0.6} strokeDasharray="3,3"
            />
            <text
              x={4} y={yOf(avgFlow) - 3}
              fontFamily="'IBM Plex Mono', monospace" fontSize="9"
              fill="rgba(100, 110, 120, 0.7)"
            >
              {avgFlow.toLocaleString()} avg
            </text>
          </>
        )}
        {/* Today divider — only when forecast extends past today */}
        {futureDaily.length > 0 && (
          <line x1={todayX} x2={todayX} y1={PAD_Y} y2={H - PAD_Y} stroke="rgba(60, 60, 60, 0.25)" strokeWidth={0.5} strokeDasharray="1,3" />
        )}
        {/* Past line — smooth monotone curve */}
        {pastPoints.length > 1 && (
          <path d={pathFor(pastPoints)} fill="none" stroke={stroke} strokeWidth={2} strokeLinejoin="round" strokeLinecap="round" />
        )}
        {/* Forecast line — dashed, lighter, same smooth curve */}
        {futurePoints.length > 1 && (
          <path d={pathFor(futurePoints)} fill="none" stroke={stroke} strokeOpacity={0.5} strokeWidth={2} strokeDasharray="4,3" strokeLinejoin="round" strokeLinecap="round" />
        )}
        {/* Current dot — last historical point, larger */}
        {pastPoints.length > 0 && (
          <circle
            cx={xOf(pastPoints.at(-1)!.date)}
            cy={yOf(pastPoints.at(-1)!.v)}
            r={3.5} fill={stroke}
          />
        )}
        {/* Hover marker */}
        {hover && (
          <>
            <line x1={hover.x} x2={hover.x} y1={PAD_Y} y2={H - PAD_Y} stroke="#aaa99a" strokeWidth={0.5} />
            <circle cx={hover.x} cy={hover.y} r={3.2} fill="white" stroke={stroke} strokeWidth={1.2} />
          </>
        )}
      </svg>
      {hover && (
        <div style={{
          position: 'absolute',
          left: `${(hover.x / W) * 100}%`,
          transform: 'translate(-50%, calc(-100% - 6px))',
          top: 0,
          background: 'rgba(255,255,255,.95)',
          border: '.5px solid var(--bd)',
          borderRadius: '4px',
          padding: '3px 6px',
          fontFamily: "'IBM Plex Mono', monospace",
          fontSize: '10px',
          color: 'var(--tx2)',
          whiteSpace: 'nowrap',
          pointerEvents: 'none',
          boxShadow: '0 1px 3px rgba(0,0,0,.08)',
          zIndex: 5,
        }}>
          {hover.label}
        </div>
      )}
      <style>{`
        @media (max-width: 768px) {
          .hero-sparkline { flex-basis: 100% !important; max-width: none !important; }
          .hero-sparkline > svg { height: 90px !important; }
        }
      `}</style>
    </div>
  )
}

function SkeletonPulse() {
  // Transparent skeleton — no box / gray rectangle. Just a soft
  // pulsing horizontal sweep so the user sees something is loading
  // without the chart slot looking heavy.
  return (
    <div
      className="hero-sparkline"
      style={{
        flex: '1 1 320px', minWidth: 0, maxWidth: '600px',
        height: '130px', position: 'relative',
        background: 'transparent',
      }}
    >
      <div style={{
        position: 'absolute', top: '50%', left: 0, right: 0,
        height: '2px', transform: 'translateY(-50%)',
        background: 'linear-gradient(90deg, transparent 0%, rgba(80, 110, 150, 0.18) 50%, transparent 100%)',
        backgroundSize: '200% 100%',
        animation: 'sparkline-pulse 1.5s ease-in-out infinite',
      }} />
      <style>{`
        @keyframes sparkline-pulse {
          0%   { background-position: 200% 0; }
          100% { background-position: -200% 0; }
        }
        @media (max-width: 768px) {
          .hero-sparkline { flex-basis: 100% !important; max-width: none !important; height: 90px !important; }
          .hero-sparkline > svg { height: 90px !important; }
        }
      `}</style>
    </div>
  )
}
