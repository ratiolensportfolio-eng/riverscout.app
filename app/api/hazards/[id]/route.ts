import { NextRequest, NextResponse } from 'next/server'
import { createSupabaseClient } from '@/lib/supabase'
import { isAdmin } from '@/lib/admin'

// PATCH /api/hazards/:id — admin-only moderation (hide, edit admin_notes,
// change severity, extend expiry). This is the escape hatch for the
// admin dashboard; regular users use /confirm and /resolve.
export async function PATCH(
  req: NextRequest,
  context: { params: Promise<{ id: string }> },
) {
  const { id } = await context.params
  const body = await req.json().catch(() => ({}))
  const { userId, userEmail, adminHidden, adminNotes, severity, expiresAt } = body

  if (!userId || !isAdmin(userId, userEmail)) {
    return NextResponse.json({ error: 'forbidden' }, { status: 403 })
  }

  const update: Record<string, unknown> = {}
  if (typeof adminHidden === 'boolean') update.admin_hidden = adminHidden
  if (typeof adminNotes === 'string') update.admin_notes = adminNotes
  if (typeof severity === 'string' && ['info', 'warning', 'critical'].includes(severity)) {
    update.severity = severity
  }
  if (typeof expiresAt === 'string') update.expires_at = expiresAt

  if (Object.keys(update).length === 0) {
    return NextResponse.json({ error: 'No valid fields' }, { status: 400 })
  }

  const supabase = createSupabaseClient()
  const { data, error } = await supabase
    .from('river_hazards')
    .update(update)
    .eq('id', id)
    .select()
    .single()

  if (error) {
    console.error('[hazards PATCH] error:', error)
    return NextResponse.json({ error: 'Failed to update' }, { status: 500 })
  }

  return NextResponse.json({ ok: true, hazard: data })
}

// DELETE /api/hazards/:id — admin-only hard delete. Prefer PATCH
// adminHidden=true for soft-hide; DELETE is for spam/abuse only.
export async function DELETE(
  req: NextRequest,
  context: { params: Promise<{ id: string }> },
) {
  const { id } = await context.params
  const userId = req.nextUrl.searchParams.get('userId')
  const userEmail = req.nextUrl.searchParams.get('userEmail')

  if (!userId || !isAdmin(userId, userEmail)) {
    return NextResponse.json({ error: 'forbidden' }, { status: 403 })
  }

  const supabase = createSupabaseClient()
  const { error } = await supabase
    .from('river_hazards')
    .delete()
    .eq('id', id)

  if (error) {
    console.error('[hazards DELETE] error:', error)
    return NextResponse.json({ error: 'Failed to delete' }, { status: 500 })
  }

  return NextResponse.json({ ok: true })
}
