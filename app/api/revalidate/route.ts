import { NextRequest, NextResponse } from 'next/server'
import { revalidatePath } from 'next/cache'
import { getRiver, getStateSlug, getRiverSlug } from '@/data/rivers'

// POST /api/revalidate
//
// Force-revalidates the cached HTML for one or more river pages
// after an outfitter listing (or other content) is updated from
// the browser. The river page has `revalidate = 900`, so without
// this route the public page would keep serving the old listing
// for up to 15 minutes — owners would update their logo and see
// no change on the public page until ISR caught up, which has
// confused real owners (it took 5 re-uploads to figure out the
// data was saving but the page was stale).
//
// Body: { riverIds: string[] }
//
// This endpoint is intentionally unauthenticated. The worst a
// caller can do is trigger an unnecessary re-render of public
// pages — there is nothing destructive here. We do NOT call
// revalidatePath('/') or anything broader to keep blast radius
// small.
export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const riverIds: unknown = body?.riverIds
    if (!Array.isArray(riverIds) || riverIds.length === 0) {
      return NextResponse.json({ error: 'riverIds (string[]) required' }, { status: 400 })
    }

    const revalidated: string[] = []
    const skipped: string[] = []

    for (const rid of riverIds) {
      if (typeof rid !== 'string') continue
      const river = getRiver(rid)
      if (!river) {
        skipped.push(rid)
        continue
      }
      const stateSlug = getStateSlug(river.stateKey)
      const riverSlug = getRiverSlug(river)
      const path = `/rivers/${stateSlug}/${riverSlug}`
      revalidatePath(path)
      revalidated.push(path)
    }

    return NextResponse.json({ ok: true, revalidated, skipped })
  } catch (err) {
    console.error('[revalidate] error:', err)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
