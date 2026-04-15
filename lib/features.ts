// Feature flags. Read from NEXT_PUBLIC_* env vars so client and server
// see the same value. Flip in Vercel (or .env.local) and redeploy to
// toggle. Defaults are conservative — if the env var is unset, the
// feature is OFF.

// Pro tier: paid upgrade flow, /pro pricing page, "Upgrade to Pro" CTAs
// across the app, Pro nav pill. Set NEXT_PUBLIC_SHOW_PRO_TIER=true to
// re-enable everything atomically.
export const SHOW_PRO_TIER =
  process.env.NEXT_PUBLIC_SHOW_PRO_TIER === 'true'

// 72-hour NOAA NWPS forecast section on river pages. Hidden by default —
// NOAA gauge mappings only exist for a fraction of our rivers, so most
// pages were rendering an empty / "no forecast" block. Flip
// NEXT_PUBLIC_SHOW_NOAA_FORECAST=true once mapping coverage is broad
// enough to be useful. The HeroSparkline still hits /api/pro/forecast
// for its 3-day tail and degrades to historical-only when missing,
// so it stays on regardless of this flag.
export const SHOW_NOAA_FORECAST =
  process.env.NEXT_PUBLIC_SHOW_NOAA_FORECAST === 'true'
