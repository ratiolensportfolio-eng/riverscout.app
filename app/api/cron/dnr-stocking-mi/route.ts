import { NextRequest, NextResponse } from 'next/server'
import { runDnrStockingScraper } from '@/lib/dnr-stocking'

// GET /api/cron/dnr-stocking-mi?key=CRON_SECRET
//
// Vercel cron endpoint that pulls the last 21 days of Michigan
// DNR stocking events from the official ArcGIS FeatureServer,
// matches them to river_ids in our database, and writes the
// matched rows to public.river_stocking with verified=true and
// stocking_authority='Michigan DNR'.
//
// Idempotent — backed by the unique index on
// (stocking_authority, source_record_id) from migration 028.
// Re-running this within the lookback window is safe; duplicate
// GUIDs are silently skipped.
//
// Manual trigger for testing:
//   curl 'https://riverscout.app/api/cron/dnr-stocking-mi?key=YOUR_CRON_SECRET'
//
// The response is the full ScraperReport JSON — paste the
// `unmatchedSamples` array back to the developer to grow the
// hand-curated waters_id → river_id map in lib/dnr-stocking.ts.

export const dynamic = 'force-dynamic'
export const revalidate = 0
// Vercel default timeout is 10s on the hobby tier; bump to 60s
// because the DNR endpoint can be slow on cold reads and we
// might paginate through 1000+ rows.
export const maxDuration = 60

export async function GET(req: NextRequest) {
  const key = req.nextUrl.searchParams.get('key')
  const cronSecret = process.env.CRON_SECRET

  // Match the auth pattern used by the other crons in this
  // project (alerts/check, digest, permits/verify-reminder).
  if (!cronSecret) {
    return NextResponse.json({ error: 'CRON_SECRET not configured' }, { status: 500 })
  }
  if (key !== cronSecret) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  // Allow callers to override the lookback window via query
  // param for backfill / debugging. Capped at 365 days to keep
  // the response sane.
  const windowParam = req.nextUrl.searchParams.get('windowDays')
  const windowDays = windowParam
    ? Math.max(1, Math.min(365, parseInt(windowParam, 10) || 21))
    : 21

  try {
    const report = await runDnrStockingScraper({ windowDays })
    return NextResponse.json(report, { status: report.ok ? 200 : 500 })
  } catch (err) {
    console.error('[dnr-stocking-mi] cron error:', err)
    return NextResponse.json(
      {
        ok: false,
        error: err instanceof Error ? err.message : String(err),
        fetchedAt: new Date().toISOString(),
      },
      { status: 500 },
    )
  }
}
