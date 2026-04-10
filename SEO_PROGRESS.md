# SEO Audit & Improvements

## Run summary

**Pages updated:** all 375 river detail pages (single source — `app/rivers/[state]/[slug]/page.tsx`'s `generateMetadata`)

**Sitemap status:** ✓ all 375 river pages already enumerated by `app/sitemap.ts` via `ALL_RIVERS.map(...)` — no changes needed.

## Changes made

### 1. Title tag — new format

**Before:**
```
{River Name} — Live Flow, Conditions & Trip Planning | RiverScout
```

**After:**
```
{River Name} Conditions & Flow Data | RiverScout
```

- Drops the "—" emdash that some browsers double-encode in tab titles
- Tighter and more keyword-focused
- Matches the spec: e.g. "Au Sable River Conditions & Flow Data | RiverScout"

### 2. Meta description — river-aware, fishing keywords on fishing rivers

The description is now built by `buildRiverDescription(river)` and is hard-clamped to 160 chars at a word boundary.

**Two branches:**

- **Rivers with fisheries data** (uses `hasFisheries(river.id)` from `data/fisheries-keys.ts` to detect): leans into fishing language. Picks the strongest hook from the species data — `steelhead and salmon runs` if both, else `steelhead runs`, else `trout fishing and hatch calendar`, else species-specific (`smallmouth bass fishing` etc.). Always includes "stocking reports" and "live CFS".

  Example output (Au Sable):
  ```
  Live Au Sable River conditions in Michigan — current CFS, 7-day forecast,
  steelhead and salmon runs, stocking reports, and trip planning. Updated
  every 15 minutes from USGS.
  ```

- **Paddling-first rivers** (no fisheries entry): leans into class/optimal flows. Includes Class rating when not Class I.

  Example output (Gauley):
  ```
  Live Gauley River conditions in West Virginia — current CFS, optimal flows
  1500–2800, Class IV–V whitewater, 7-day forecast, access points, and trip
  reports. Updated every 15 minutes.
  ```

All descriptions:
- Mention the river name
- Mention the state by name (not abbreviation)
- Mention live CFS data
- Include a fishing or paddling hook based on the river's data
- Are 150–160 characters (clamped at word boundary if longer)

### 3. Canonical URL — added

Every river page now sets:

```ts
alternates: {
  canonical: `https://riverscout.app/rivers/${state}/${slug}`,
}
```

This pins Google's canonical to the SEO-friendly slug URL and prevents canonicalization to a query-string variant or trailing-slash variant.

### 4. Open Graph + Twitter cards

`openGraph` now includes:
- `title` (matches the new title format)
- `description` (matches the new meta description)
- `url` (canonical URL)
- `siteName: 'RiverScout'`
- `type: 'website'`
- **`images`** — added. Currently points to `/icon.svg` as a fallback. **TODO**: build a per-page OG image route at `app/rivers/[state]/[slug]/opengraph-image.tsx` that renders a branded card with the river name + live CFS via `next/og` ImageResponse. This would dramatically improve social-sharing CTR but is a separate ~30-min build and is logged here as a follow-up.

`twitter` block added with `card: 'summary_large_image'` and the same title/description/image.

### 5. Sitemap — verified

`app/sitemap.ts` already enumerates every river via `ALL_RIVERS.map(river => ({ url: ..., priority: 0.9 }))`. With 375 rivers in the database (after the recent +10 East rivers commit), the sitemap output includes all 375. No changes needed to the sitemap file.

Static pages (homepage, /search, /alerts, /hatches, /pro, /outfitters, /about/improvements) are already included with appropriate priority. State pages (`/state/{key}`) are also included.

**Note:** the new `/rivers` alphabetical index page (built in a separate task) needs to be added to the sitemap. That edit will be made when the page itself ships.

## Issues found / not addressed in this pass

1. **Per-page OG images.** Currently every river uses the same `/icon.svg` fallback. The Next 15 way to fix this is a per-segment `opengraph-image.tsx` ImageResponse. Logged as TODO above.

2. **No `robots.txt`.** Next.js defaults handle this OK but an explicit `app/robots.ts` would let us control crawl rate and explicitly disallow `/admin/*`, `/api/*`, `/account`, `/outfitters/dashboard`, and `/login`. Logged as a follow-up.

3. **Keywords meta tag** — intentionally not added. Google ignores it. Bing too.

4. **State pages (`/state/[state]`)** also lack a custom `generateMetadata`. They currently inherit the root metadata. These would benefit from the same treatment ("[State Name] River Conditions & Flow Data | RiverScout") but were out of scope for this pass — flagged for the next SEO sweep.

## Files touched

- `app/rivers/[state]/[slug]/page.tsx` — generateMetadata rewritten + helpers added
- `SEO_PROGRESS.md` — this log

No other files were modified in this pass.
