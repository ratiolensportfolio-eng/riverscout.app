import { NextRequest, NextResponse } from 'next/server'
import { runReleaseScrapers } from '@/lib/release-scrapers'

// GET /api/cron/release-scrapers?key=CRON_SECRET
//
// Daily cron that walks every registered release scraper adapter,
// fetches scheduled release events, matches them to river_ids,
// and writes new rows to scraped_releases.
//
// Per-adapter results are returned in the response so the admin
// can see which adapters fired and what they pulled.
//
// Manual trigger:
//   curl 'https://riverscout.app/api/cron/release-scrapers?key=YOUR_CRON_SECRET'
//
// Note: as of this commit, all registered adapters are stubs
// with enabled: false. The framework is in place but no real
// upstream sources have been wired up yet. See
// lib/release-scrapers/example-stub.ts for the adapter pattern
// and lib/release-scrapers/arcgis-template.ts for the
// proven ArcGIS adapter generator.

export const dynamic = 'force-dynamic'
export const revalidate = 0
export const maxDuration = 120

export async function GET(req: NextRequest) {
  const key = req.nextUrl.searchParams.get('key')
  const cronSecret = process.env.CRON_SECRET
  if (!cronSecret || key !== cronSecret) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const report = await runReleaseScrapers()
    return NextResponse.json(report, { status: report.ok ? 200 : 500 })
  } catch (err) {
    console.error('[release-scrapers] error:', err)
    return NextResponse.json({
      ok: false,
      error: err instanceof Error ? err.message : String(err),
      fetchedAt: new Date().toISOString(),
    }, { status: 500 })
  }
}
