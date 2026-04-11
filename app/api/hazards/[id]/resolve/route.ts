import { NextRequest, NextResponse } from 'next/server'
import { isAdmin } from '@/lib/admin'

// POST /api/hazards/:id/resolve — mark a hazard as resolved.
// The original reporter OR any admin can resolve. "Resolved" means the
// hazard is no longer present (e.g. strainer was cleared by a crew,
// water dropped, landowner reopened access). Resolved hazards become
// inactive and drop off the river page banner.
export async function POST(
  req: NextRequest,
  context: { params: Promise<{ id: string }> },
) {
  const { id } = await context.params
  const body = await req.json().catch(() => ({}))
  const { userId, userEmail, note } = body

  if (!userId) {
    return NextResponse.json({ error: 'auth_required' }, { status: 401 })
  }

  // Service role: river_hazards.resolved_by is FK-bound to
  // auth.users so the anon write hits the migration-026 error.
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY
  if (!url || !serviceKey) {
    return NextResponse.json({ error: 'Server misconfigured' }, { status: 500 })
  }
  const { createClient } = await import('@supabase/supabase-js')
  const supabase = createClient(url, serviceKey, { auth: { persistSession: false } })

  // Pull the hazard so we can check authorization (reporter OR admin).
  const { data: hazard, error: fetchErr } = await supabase
    .from('river_hazards')
    .select('id, reported_by, active')
    .eq('id', id)
    .single()

  if (fetchErr || !hazard) {
    return NextResponse.json({ error: 'Hazard not found' }, { status: 404 })
  }
  if (!hazard.active) {
    return NextResponse.json({ error: 'Already resolved' }, { status: 400 })
  }

  const userIsAdmin = isAdmin(userId, userEmail)
  const isReporter = hazard.reported_by === userId
  if (!userIsAdmin && !isReporter) {
    return NextResponse.json({ error: 'forbidden' }, { status: 403 })
  }

  const { data: updated, error: updErr } = await supabase
    .from('river_hazards')
    .update({
      active: false,
      resolved_at: new Date().toISOString(),
      resolved_by: userId,
      resolved_note: note || null,
    })
    .eq('id', id)
    .select()
    .single()

  if (updErr) {
    console.error('[hazards/resolve] update error:', updErr)
    return NextResponse.json({ error: 'Failed to resolve' }, { status: 500 })
  }

  return NextResponse.json({ ok: true, hazard: updated })
}
