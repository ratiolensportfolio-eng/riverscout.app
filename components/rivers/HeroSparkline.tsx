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

export default function HeroSparkline({ readings, optRange, condition, gaugeId, currentCfs }: Props) {
  const [forecast, setForecast] = useState<ForecastPoint[] | null>(null)
  const [forecastFailed, setForecastFailed] = useState(false)
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

  const W = 320, H = 80, PAD_X = 6, PAD_Y = 8
  const minDate = all[0].date.getTime()
  const maxDate = all.at(-1)!.date.getTime()
  const dateSpan = Math.max(maxDate - minDate, 24 * 60 * 60 * 1000)
  const minV = Math.min(...all.map(p => p.v), optBand?.[0] ?? Infinity)
  const maxV = Math.max(...all.map(p => p.v), optBand?.[1] ?? -Infinity)
  const vSpan = Math.max(maxV - minV, 1)

  const xOf = (d: Date) => PAD_X + ((d.getTime() - minDate) / dateSpan) * (W - 2 * PAD_X)
  const yOf = (v: number) => PAD_Y + (1 - (v - minV) / vSpan) * (H - 2 * PAD_Y)

  // Split into past polyline + future polyline (joined at boundary).
  const splitIdx = all.findIndex(p => p.future)
  const pastPoints = splitIdx === -1 ? all : all.slice(0, splitIdx + 1)
  // Bridge first future to last past so the line is continuous
  const futurePoints = splitIdx === -1 ? [] : all.slice(splitIdx === 0 ? 0 : splitIdx - 1)

  const pathFor = (pts: Point[]) =>
    pts.map((p, i) => `${i === 0 ? 'M' : 'L'} ${xOf(p.date).toFixed(1)} ${yOf(p.v).toFixed(1)}`).join(' ')

  const stroke = CONDITION_STROKE[condition] ?? CONDITION_STROKE.loading

  // Background tint: amber if currently above optimal, blue if below.
  let bgTint = 'transparent'
  if (optBand && currentCfs !== null) {
    if (currentCfs > optBand[1]) bgTint = 'rgba(186, 117, 23, 0.05)'
    else if (currentCfs < optBand[0]) bgTint = 'rgba(63, 119, 224, 0.05)'
  }

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
        flex: '1 1 220px', minWidth: 0, maxWidth: '360px',
        position: 'relative', alignSelf: 'center',
      }}
    >
      <svg
        viewBox={`0 0 ${W} ${H}`}
        preserveAspectRatio="none"
        style={{ width: '100%', height: '80px', display: 'block', background: bgTint, borderRadius: '6px' }}
        onMouseMove={onMove}
        onMouseLeave={() => setHover(null)}
      >
        {/* Optimal band */}
        {optBand && (
          <rect
            x={0} width={W}
            y={yOf(optBand[1])} height={Math.max(yOf(optBand[0]) - yOf(optBand[1]), 1)}
            fill="rgba(29, 158, 117, 0.08)"
          />
        )}
        {/* Today divider — only when forecast extends past today */}
        {futureDaily.length > 0 && (
          <line x1={todayX} x2={todayX} y1={PAD_Y} y2={H - PAD_Y} stroke="#aaa99a" strokeWidth={0.5} strokeDasharray="2,2" />
        )}
        {/* Past line */}
        {pastPoints.length > 1 && (
          <path d={pathFor(pastPoints)} fill="none" stroke={stroke} strokeWidth={1.6} strokeLinejoin="round" strokeLinecap="round" />
        )}
        {/* Forecast line — dashed, lighter */}
        {futurePoints.length > 1 && (
          <path d={pathFor(futurePoints)} fill="none" stroke={stroke} strokeOpacity={0.55} strokeWidth={1.6} strokeDasharray="3,3" strokeLinejoin="round" strokeLinecap="round" />
        )}
        {/* Current dot — last historical point */}
        {pastPoints.length > 0 && (
          <circle
            cx={xOf(pastPoints.at(-1)!.date)}
            cy={yOf(pastPoints.at(-1)!.v)}
            r={2.8} fill={stroke}
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
          .hero-sparkline > svg { height: 60px !important; }
        }
      `}</style>
    </div>
  )
}

function SkeletonPulse() {
  return (
    <div
      className="hero-sparkline"
      style={{
        flex: '1 1 220px', minWidth: 0, maxWidth: '360px',
        height: '80px', borderRadius: '6px',
        background: 'linear-gradient(90deg, #eee 0%, #f5f5f5 50%, #eee 100%)',
        backgroundSize: '200% 100%',
        animation: 'sparkline-pulse 1.5s ease-in-out infinite',
      }}
    >
      <style>{`
        @keyframes sparkline-pulse {
          0%   { background-position: 200% 0; }
          100% { background-position: -200% 0; }
        }
        @media (max-width: 768px) {
          .hero-sparkline { flex-basis: 100% !important; max-width: none !important; height: 60px !important; }
          .hero-sparkline > svg { height: 60px !important; }
        }
      `}</style>
    </div>
  )
}
