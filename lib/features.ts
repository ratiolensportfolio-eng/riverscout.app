// Feature flags. Read from NEXT_PUBLIC_* env vars so client and server
// see the same value. Flip in Vercel (or .env.local) and redeploy to
// toggle. Defaults are conservative — if the env var is unset, the
// feature is OFF.

// Pro tier: paid upgrade flow, /pro pricing page, "Upgrade to Pro" CTAs
// across the app, Pro nav pill. Set NEXT_PUBLIC_SHOW_PRO_TIER=true to
// re-enable everything atomically.
export const SHOW_PRO_TIER =
  process.env.NEXT_PUBLIC_SHOW_PRO_TIER === 'true'
