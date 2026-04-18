import { NextRequest, NextResponse } from 'next/server'
import { runNyStockingScraper } from '@/lib/stocking-ny'
import { runPaStockingScraper } from '@/lib/stocking-pa'
import { runVaStockingScraper } from '@/lib/stocking-va'
import { runCoStockingScraper } from '@/lib/stocking-co'

// GET /api/cron/stocking-multi?key=CRON_SECRET
//
// Runs all four state stocking scrapers sequentially. Each adapter
// is independent — a failure in one doesn't block the others.
// Designed to run weekly (Mondays at 14:00 UTC) alongside the
// daily MI scraper that runs separately.

export const dynamic = 'force-dynamic'
export const maxDuration = 120

export async function GET(req: NextRequest) {
  const key = req.nextUrl.searchParams.get('key')
  const cronSecret = process.env.CRON_SECRET
  if (!cronSecret || key !== cronSecret) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const results: Record<string, unknown> = {}

  // NY — SODA API, 2026 current-season data
  try {
    console.log('[stocking-multi] Running NY scraper...')
    results.ny = await runNyStockingScraper()
  } catch (e) {
    console.error('[stocking-multi] NY error:', e)
    results.ny = { error: e instanceof Error ? e.message : 'unknown' }
  }

  // PA — ArcGIS, annual allocation data
  try {
    console.log('[stocking-multi] Running PA scraper...')
    results.pa = await runPaStockingScraper()
  } catch (e) {
    console.error('[stocking-multi] PA error:', e)
    results.pa = { error: e instanceof Error ? e.message : 'unknown' }
  }

  // VA — ArcGIS FeatureServer, stream reference data
  try {
    console.log('[stocking-multi] Running VA scraper...')
    results.va = await runVaStockingScraper()
  } catch (e) {
    console.error('[stocking-multi] VA error:', e)
    results.va = { error: e instanceof Error ? e.message : 'unknown' }
  }

  // CO — fallback reference records (no live API)
  try {
    console.log('[stocking-multi] Running CO scraper...')
    results.co = await runCoStockingScraper()
  } catch (e) {
    console.error('[stocking-multi] CO error:', e)
    results.co = { error: e instanceof Error ? e.message : 'unknown' }
  }

  return NextResponse.json(results)
}
