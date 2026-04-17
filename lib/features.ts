// Feature flags. Read from NEXT_PUBLIC_* env vars so client and server
// see the same value. Flip in Vercel (or .env.local) and redeploy to
// toggle. Defaults are conservative — if the env var is unset, the
// feature is OFF.

// Pro tier: paid upgrade flow, /pro pricing page, "Upgrade to Pro" CTAs
// across the app, Pro nav pill. ON by default. Set
// NEXT_PUBLIC_SHOW_PRO_TIER=false in Vercel to kill-switch atomically.
export const SHOW_PRO_TIER =
  process.env.NEXT_PUBLIC_SHOW_PRO_TIER !== 'false'

// 72-hour NOAA NWPS forecast section on river pages. HIDDEN by default —
// most rivers don't have an NWS gauge mapping so the section was rendering
// "no forecast" for the majority. Code is preserved (not deleted) — flip
// NEXT_PUBLIC_SHOW_NOAA_FORECAST=true to re-enable site-wide once mapping
// coverage is broad enough. The HeroSparkline still hits /api/pro/forecast
// for its 3-day tail and degrades gracefully, so it stays on regardless.
export const SHOW_NOAA_FORECAST =
  process.env.NEXT_PUBLIC_SHOW_NOAA_FORECAST === 'true'

// River page V2 layout: dark gradient hero, stat cards row, grouped
// action bar. ON by default. Set NEXT_PUBLIC_RIVER_V2=false to revert
// to the classic beige header layout instantly.
export const RIVER_V2 =
  process.env.NEXT_PUBLIC_RIVER_V2 !== 'false'
