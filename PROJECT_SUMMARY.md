# RiverScout — Project Summary

**URL:** https://riverscout.app  
**Repo:** https://github.com/ratiolensportfolio-eng/riverscout.app  
**Stack:** Next.js 16 (App Router) · TypeScript · React 19 · Supabase · Mapbox GL · Stripe · Resend  
**Hosting:** Vercel · Cloudflare DNS  
**Last Updated:** April 9, 2026  

---

## What RiverScout Is

A paddling atlas for every river in America. Live USGS flow data, interactive maps, fish species and hatch calendars, trip reports with photos, named rapids, historical documents, and an outfitter marketplace. Think AllTrails but for rivers, with a monetization layer selling outfitter placement and map products.

---

## Data Scale

- **461 rivers** across **48 continental states** (8+ per state, 29 in Michigan)
- **419 rivers** with fisheries data (species, hatches, run timing, spawn timing)
- **17 rivers** with named rapids (GPS-located, class-rated, described)
- **152 rivers** with interactive map geometry (USGS NHDPlus GPS polylines)
- **135 documents** across 114 rivers, verified URLs to .gov/.edu/.org sources
- **All 461 rivers** have USGS gauge IDs for live CFS flow data
- **51 rivers** flagged with `needsVerification` tags for community review (safety audit)

---

## File Structure

### Core Configuration
| File | Purpose |
|------|---------|
| `package.json` | Dependencies: Next.js, Supabase, Mapbox GL, Stripe, React 19 |
| `tsconfig.json` | TypeScript config with path aliases |
| `tailwind.config.ts` | Tailwind CSS config |
| `next.config.ts` | Next.js config |
| `middleware.ts` | Auth session refresh, route protection (/admin, /outfitters/dashboard) |
| `.gitignore` | Standard Next.js ignores |

### Types (`types/`)
| File | Purpose |
|------|---------|
| `types/index.ts` | All TypeScript interfaces: River, State, FlowData, FlowCondition, HistEra, Review, Outfitter, RiverDoc, FishSpecies, HatchEvent, RunTiming, SpawnTiming, RiverFisheries, OutfitterTier, OutfitterListing, OutfitterClick, OutfitterTierConfig, OUTFITTER_TIERS constant, UserProfile, TripReport |

### Data Layer (`data/`)
| File | Purpose |
|------|---------|
| `data/rivers.ts` | Master river database — 461 rivers with descriptions, history, sections, designations, reviews, outfitters, `needsVerification` tags. Includes slug helpers, flow condition calculator. **Migration to Supabase in progress.** |
| `data/fisheries.ts` | Fisheries data for 419 rivers: species, designations (Gold Medal, Blue-Ribbon), spawning, hatch calendars, run timing, fishing guides |
| `data/rapids.ts` | Named rapids for 17 whitewater rivers with GPS coordinates, class ratings, descriptions |
| `data/river-coordinates.ts` | Approximate lat/lng for all 461 rivers (for state map dots) |
| `data/state-centers.ts` | Map center coordinates and zoom levels for all 48 states |
| `data/river-maps/` (152 files) | Per-river interactive map data: USGS NHDPlus GPS polylines (~150 points each), access points, sections with distances/paddle times |
| `data/river-maps/index.ts` | Registry mapping river IDs to their map data files (lazy-loaded) |
| `data/river-maps/pine_mi.ts` | Pine River MI — fully populated with 10 access points, 8 sections (owner-verified) |

### Libraries (`lib/`)
| File | Purpose |
|------|---------|
| `lib/supabase.ts` | Supabase browser client + simple server client (no next/headers) |
| `lib/supabase-server.ts` | Supabase SSR client with cookie-based auth (next/headers) |
| `lib/usgs.ts` | USGS NWIS API: fetchGaugeData(), fetchPercentile(), formatCfs(), trendArrow(), temperature helpers. Edge-cached 900s (gauge) / 86400s (percentile). |
| `lib/noaa-fetch.ts` | Timeout-safe fetch wrapper for all external APIs (USGS, NOAA, NWS). Opt-in `nextRevalidate` for read paths; defaults to `no-store` for cron/write. |
| `lib/river-page-data.ts` | Server-side batch prefetch: trip_reports, stocking, outfitters, rapids in one `Promise.all` from the river page server component. Eliminates client round-trips on hydration. |
| `lib/needs-verification.ts` | Maps safety-audit tags (`cfs-range-wide`, `class-v-portage-note`, etc.) to UI labels and target SuggestCorrection fields. |
| `lib/stripe.ts` | Stripe client + price ID mapping from env vars |
| `lib/email.ts` | Centralized Resend email: sendEmail(), flowAlertEmail template, improvementApprovedEmail template. All from noreply@riverscout.app |
| `lib/admin.ts` | Admin user ID list (hardcoded: cd958898-e1da-442d-830b-5767f2e0b5ca) |
| `lib/designations.ts` | River designation badge system: Wild & Scenic, Gold Medal, Blue-Ribbon, National Park, Wilderness, Natural River, Scenic River, NRA |
| `lib/rivers-db.ts` | Supabase data fetcher: reconstructs STATES/River structure from DB tables, 60-sec cache |
| `lib/rivers.ts` | Unified data layer: tries Supabase (when USE_DB=true), falls back to static |

### Components (`components/`)
| File | Purpose |
|------|---------|
| `components/maps/USMap.tsx` (44KB) | Interactive US map with all 50 states (real SVG paths from react-usa-map, MIT). Live states colored by flow condition. Tooltip, legend, pulse dots. |
| `components/maps/StateRiverMap.tsx` (8KB) | Mapbox GL map for state pages. Plots all rivers as color-coded dots (green/amber/red/purple by condition). Hover shows river name + CFS. Click navigates to river. |
| `components/maps/RiverMap.tsx` (9KB) | Mapbox GL map for individual rivers. Shows river polyline, access point markers (color-coded by type), section breakdown below map. |
| `components/rivers/RiverTabs.tsx` (46KB) | Tabbed river detail view: Overview, History, Trip Reports, Fishing, Maps & Guides, Documents. Contains trip report form with photo upload, fisheries display, rapids section, document links. |
| `components/alerts/AlertSubscriber.tsx` (12KB) | Flow alert subscription UI: email input, river search dropdown, threshold selector, active alerts management |
| `components/AuthNav.tsx` (2KB) | Auth-aware nav: Google avatar + name when signed in, "Sign In" button when not |
| `components/SuggestCorrection.tsx` (10KB) | "Improve This River" modal: field picker, current/suggested values, reason, source URL. Submits to API for AI evaluation. |
| `components/rivers/DataConfidenceBanner.tsx` | Credibility banner on river pages. Renders a chip per `needsVerification` tag opening a modal that routes each item to the correct SuggestCorrection field. |

### Pages (`app/`)

#### Public Pages
| Route | File | Purpose |
|-------|------|---------|
| `/` | `app/page.tsx` | Home page: hero, live flow stats, interactive US map (colored by conditions), nav with auth |
| `/state/[state]` | `app/state/[state]/page.tsx` | State page: sidebar river list with live CFS badges + designation badges, Mapbox state map with river dots |
| `/rivers/[state]/[slug]` | `app/rivers/[state]/[slug]/page.tsx` | River detail: SEO-optimized URL, live CFS header, designation badges, "Improve This River" button, tabbed content. Per-page meta tags for Google. |
| `/rivers/[id]` | `app/rivers/[id]/page.tsx` | Legacy redirect: 301 redirects old URLs to new SEO format |
| `/search` | `app/search/page.tsx` | River search: real-time filtering by name/state/designation |
| `/alerts` | `app/alerts/page.tsx` | Flow alerts: condition counts, subscription form, live grid of all rivers with CFS |
| `/login` | `app/login/page.tsx` | Auth: Google OAuth button + email magic link (passwordless) |
| `/outfitters` | `app/outfitters/page.tsx` | Outfitter marketing/pricing page: 5 tier cards, FAQ, CTAs |
| `/outfitters/join` | `app/outfitters/join/page.tsx` | 3-step signup: choose tier → business profile → river picker → Stripe checkout |
| `/outfitters/dashboard` | `app/outfitters/dashboard/page.tsx` | Outfitter analytics: clicks this month, MoM %, by river, by source, estimated bookings, daily chart |
| `/outfitters/success` | `app/outfitters/success/page.tsx` | Post-payment confirmation |
| `/outfitters/cancel` | `app/outfitters/cancel/page.tsx` | Checkout cancellation |
| `/admin/suggestions` | `app/admin/suggestions/page.tsx` | Admin: pending/approved/rejected improvements, AI confidence assessment, approve/reject buttons |

#### API Routes
| Route | File | Purpose |
|-------|------|---------|
| `POST /api/alerts` | `app/api/alerts/route.ts` | Subscribe to flow alerts |
| `GET /api/alerts?email=` | Same | List active alerts |
| `DELETE /api/alerts` | Same | Unsubscribe |
| `GET /api/alerts/check?key=` | `app/api/alerts/check/route.ts` | Cron: check conditions, send emails via Resend, include sponsored outfitter blocks |
| `POST /api/trips` | `app/api/trips/route.ts` | Submit trip report |
| `GET /api/trips?riverId=` | Same | Fetch trip reports |
| `POST /api/trips/upload` | `app/api/trips/upload/route.ts` | Upload trip photos to Supabase Storage |
| `GET /api/outfitters?riverId=` | `app/api/outfitters/route.ts` | Fetch active outfitter listings |
| `POST /api/outfitters` | Same | Claim free listing |
| `POST /api/outfitters/click` | `app/api/outfitters/click/route.ts` | Record outfitter click (source tracking) |
| `GET /api/outfitters/analytics` | `app/api/outfitters/analytics/route.ts` | Dashboard data: clicks by river/source/day, MoM, est. bookings |
| `POST /api/stripe/checkout` | `app/api/stripe/checkout/route.ts` | Create Stripe Checkout Session |
| `POST /api/webhooks/stripe` | `app/api/webhooks/stripe/route.ts` | Handle subscription events (created/updated/deleted/failed) |
| `POST /api/suggestions` | `app/api/suggestions/route.ts` | Submit improvement (AI pre-evaluation via Claude Haiku) |
| `GET /api/suggestions` | Same | Fetch suggestions (admin only) |
| `PATCH /api/suggestions` | Same | Approve/reject (admin only, sends email) |

#### Auth Routes
| Route | File | Purpose |
|-------|------|---------|
| `GET /auth/callback` | `app/auth/callback/route.ts` | OAuth code exchange (Google → session) |
| `POST /auth/signout` | `app/auth/signout/route.ts` | Sign out, clear session |

### Database (`supabase/`)
| File | Purpose |
|------|---------|
| `001_flow_alerts.sql` | flow_alerts table (email, river, threshold, cooldown) |
| `002_trip_reports.sql` | trip_reports table + trip-photos storage bucket |
| `003_outfitter_listings.sql` | outfitters table + outfitter_clicks table + RPC increment function |
| `004_suggestions.sql` | suggestions table with AI confidence/reasoning fields |
| `005_rivers_database.sql` | Full river database: 13 tables (states, rivers, history, docs, reviews, outfitters, species, designations_fish, spawning, hatches, runs, guides, rapids) |
| `seed.sql` (1.3MB) | 3,820 INSERT statements to populate all river data |

### Scripts
| File | Purpose |
|------|---------|
| `scripts/seed-rivers.js` | Parses rivers.ts/fisheries.ts/rapids.ts → generates seed.sql |
| `scripts/audit-safety.js` | Flags unsafe class claims, wide CFS ranges (10x+), Class V rapids without portage notes, class-rating drift. Outputs JSON used by `apply-needs-verification.js`. |
| `scripts/audit-fisheries.js` | Validates species / hatch / run geography across all rivers (0 red flags as of Apr 9). |
| `scripts/audit-descriptions.js` | Scans all river descriptions for generic AI phrasing and surfaces thin descriptions (<3 sentences, low specificity). |
| `scripts/apply-needs-verification.js` | Writes safety-audit flags into `data/rivers.ts` as `needsVerification` string arrays. |

### Styling
| File | Purpose |
|------|---------|
| `app/globals.css` | CSS variables (light/dark), condition classes, pulse animation, scrollbar hiding |
| `app/layout.tsx` | Root layout: Plausible analytics, Google Fonts (Playfair Display, IBM Plex Mono), metadata |

---

## Features — Status

### ✅ Complete and Live

| Feature | Status | Notes |
|---------|--------|-------|
| **Live USGS flow data** | ✅ Live | All 461 rivers have gauge IDs. Edge-cached: 900s reads, 86400s percentile. |
| **NWS gauge discovery** | ✅ Live | Self-populating NWS gauge mapping system (14+ verified mappings). |
| **7-day weather forecast** | ✅ Live | NOAA forecast with rain timing windows and estimated accumulation. Collapsed by default on river page. |
| **Dynamic sitemap** | ✅ Live | `app/sitemap.ts` — all 461 rivers, 48 states, static pages. |
| **Data Confidence Banner** | ✅ Live | Per-river `needsVerification` chips → SuggestCorrection modal for community review. |
| **Timeout-safe external fetch** | ✅ Live | `lib/noaa-fetch.ts` — never hangs the app on USGS/NOAA/NWS timeouts. |
| **Server-side prefetch** | ✅ Live | `lib/river-page-data.ts` batches DB queries; eliminates 4 client round-trips per river page load. |
| **Interactive US map** | ✅ Live | All 50 states with real SVG paths. States colored by flow condition. |
| **SEO-optimized URLs** | ✅ Live | `/rivers/michigan/pine-river` format. Per-page meta tags. 301 redirects from old URLs. |
| **River detail pages** | ✅ Live | 6 tabs: Overview, History, Trip Reports, Fishing, Maps & Guides, Documents |
| **Designation badges** | ✅ Live | 8 types: Wild & Scenic, Gold Medal, Blue-Ribbon, National Park, Wilderness, etc. |
| **Notable Rapids** | ✅ Live | 18 rivers with named rapids, color-coded by class, GPS located |
| **Fisheries/Fishing tab** | ✅ Live | 78 rivers: species, hatch calendars, run timing, spawn timing, guides |
| **Documents with links** | ✅ Live | 103 documents linked to real .gov/.edu/.org PDFs |
| **Trip Reports** | ✅ Live | Submit with photos, star rating, CFS, date. Supabase + Storage. |
| **Photo uploads** | ✅ Live | JPEG/PNG/WebP/HEIC, 10MB max, Supabase Storage |
| **Flow Alerts** | ✅ Live | Email subscription by river + threshold. 12-hr cooldown. |
| **Flow Alert emails** | ✅ Live | Branded HTML via Resend from noreply@riverscout.app. Sponsored outfitter block. |
| **Flow alert cron** | ✅ Live | `vercel.json` cron hits `/api/alerts/check` every 15 min. |
| **Interactive river maps** | ✅ Live | 44 rivers with USGS NHDPlus polylines, access points, sections |
| **State maps** | ✅ Live | Mapbox terrain map on every state page, rivers as dots colored by condition |
| **Search** | ✅ Live | Real-time filter by name, state, designation |
| **Google OAuth** | ✅ Live | Sign in with Google + magic link email. SSR cookie auth. |
| **Auth middleware** | ✅ Live | Protects /admin and /outfitters/dashboard |
| **Improve This River** | ✅ Live | Community corrections with AI pre-evaluation (Claude Haiku) |
| **Admin dashboard** | ✅ Live | Review improvements with AI confidence scores. Approve/reject. |
| **Plausible analytics** | ✅ Live | Privacy-friendly, script in layout head |

### ✅ Built, Needs Activation (env vars / Supabase setup)

| Feature | Status | What's Needed |
|---------|--------|---------------|
| **Stripe checkout** | Built | Add STRIPE_SECRET_KEY, STRIPE_WEBHOOK_SECRET, and 7 STRIPE_PRICE_* env vars. Set webhook URL in Stripe dashboard. |
| **Outfitter portal** | Built | Stripe activation + run 003_outfitter_listings.sql |
| **Outfitter analytics** | Built | Needs outfitter_clicks table (run SQL) + outfitter data |
| **AI suggestion evaluation** | Built | Add ANTHROPIC_API_KEY env var |
| **Mapbox maps** | Built | Add NEXT_PUBLIC_MAPBOX_TOKEN env var |
| **River database migration** | Built | Run 005_rivers_database.sql + seed.sql in Supabase, set NEXT_PUBLIC_USE_DB=true |

### 🔶 Partially Built

| Feature | Status | What Remains |
|---------|--------|--------------|
| **Outfitter tier rendering** | Partial | Pricing page + join flow built. Tier badges on river pages not yet rendered (outfitter data shows but not tiered). |
| **Outfitter link display** | Partial | Links intentionally hidden for monetization. Free tier shows name only. Need to render links for Featured/Sponsored tiers. |
| **Fishing tab coverage** | Partial | 419 of 461 rivers have fisheries data. Remaining 42 show "coming soon" placeholder. |
| **Rapids coverage** | Partial | 17 of ~50 whitewater rivers have named rapids data. |
| **River map coverage** | Partial | 152 of 461 rivers have interactive maps. |
| **Document URLs** | Partial | 135 verified .gov/.edu/.org docs across 114 rivers. Unverified docs were removed (trust > volume). |
| **41 thin descriptions** | Flagged | `audit-descriptions.js` surfaced 41 rivers with short/low-specificity descriptions pending rewrite. |

### ❌ Not Yet Built

| Feature | Priority | Notes |
|---------|----------|-------|
| **Outfitter tier badge rendering on river pages** | High | Show Featured/Sponsored badges with logos, links, photos based on tier |
| **Maps & Guides affiliate links** | Medium | Slots exist ("Coming Soon"), need Amazon Associates or publisher affiliate URLs |
| **River proximity / "nearby rivers"** | Medium | mx/my coordinates exist for all rivers |
| **User profiles** | Low | UserProfile type exists, not implemented |
| **Newsletter** | Low | Referenced in Destination Sponsor tier features |
| **Quarterly traffic reports** | Low | Referenced in Sponsored tier, not automated |
| **Alaska & Hawaii** | Low | "Coming soon" insets on map, no river data |

---

## Environment Variables Required

```
# Supabase (set)
NEXT_PUBLIC_SUPABASE_URL=https://zydmjcnuzseoymxcyvqq.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=sb_publishable_...

# Resend (set)
RESEND_API_KEY=re_...

# Stripe (needs setup)
STRIPE_SECRET_KEY=sk_test_...
STRIPE_WEBHOOK_SECRET=whsec_...
STRIPE_PRICE_FEATURED_MONTHLY=price_...
STRIPE_PRICE_FEATURED_YEARLY=price_...
STRIPE_PRICE_SPONSORED_MONTHLY=price_...
STRIPE_PRICE_SPONSORED_YEARLY=price_...
STRIPE_PRICE_GUIDE_MONTHLY=price_...
STRIPE_PRICE_GUIDE_YEARLY=price_...
STRIPE_PRICE_DESTINATION_MONTHLY=price_...

# Mapbox (needs setup)
NEXT_PUBLIC_MAPBOX_TOKEN=pk_...

# AI evaluation (needs setup)
ANTHROPIC_API_KEY=sk-ant-...

# Cron security
CRON_SECRET=...

# Site URL
NEXT_PUBLIC_SITE_URL=https://riverscout.app

# Database switch (not yet active)
NEXT_PUBLIC_USE_DB=false
```

---

## Supabase Tables

| Table | Status | Records |
|-------|--------|---------|
| `flow_alerts` | ✅ Created | User subscriptions |
| `trip_reports` | ✅ Created | User trip reports with photos |
| `outfitters` | ✅ Created | Outfitter listings with tiers |
| `outfitter_clicks` | ✅ Created | Click analytics with source |
| `suggestions` | ✅ Created | Improvement submissions with AI fields |
| `states` | ❌ Pending | Run 005 migration |
| `rivers` | ❌ Pending | Run 005 migration + seed.sql |
| `river_history` | ❌ Pending | Run 005 migration + seed.sql |
| `river_documents` | ❌ Pending | Run 005 migration + seed.sql |
| `river_reviews` | ❌ Pending | Run 005 migration + seed.sql |
| `river_outfitters` | ❌ Pending | Run 005 migration + seed.sql |
| `river_species` | ❌ Pending | Run 005 migration + seed.sql |
| `river_designations_fish` | ❌ Pending | Run 005 migration + seed.sql |
| `river_spawning` | ❌ Pending | Run 005 migration + seed.sql |
| `river_hatches` | ❌ Pending | Run 005 migration + seed.sql |
| `river_runs` | ❌ Pending | Run 005 migration + seed.sql |
| `river_guides` | ❌ Pending | Run 005 migration + seed.sql |
| `river_rapids` | ❌ Pending | Run 005 migration + seed.sql |

---

## Monetization Model

### Outfitter Tiers
| Tier | Price | Rivers | Key Features |
|------|-------|--------|--------------|
| Listed | Free | 1 | Name + description on river page |
| Featured | $49/mo or $399/yr | 3 | Logo, cover photo, booking link, phone, click analytics |
| Sponsored | $149/mo or $999/yr | 6 | Overview tab placement, flow alert email inclusion, quarterly reports |
| Guide Profile | $29/mo or $249/yr | 3 | Personal profile, specialty tags, contact form |
| Destination | $499/mo | State | Every river in state, landing page, newsletter, flow alert co-branding |

### Other Revenue Streams (Not Yet Built)
- Maps & Guides affiliate links (Amazon Associates)
- RiverScout-branded physical maps (print-on-demand)
- Premium data API for apps

---

## Owner

- **Business:** Pine River Paddlesports Center (thepineriver.com)
- **Location:** Pine River, Michigan Lower Peninsula
- **Admin User ID:** cd958898-e1da-442d-830b-5767f2e0b5ca
- **Contact:** Paddle.rivers.us@gmail.com
