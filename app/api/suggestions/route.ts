import { NextRequest, NextResponse } from 'next/server'
import { createSupabaseClient } from '@/lib/supabase'
import { isAdmin } from '@/lib/admin'

// POST /api/suggestions — submit a correction suggestion
export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { riverId, riverName, stateKey, userId, userEmail, field, currentValue, suggestedValue, reason, sourceUrl } = body

    if (!riverId || !field || !currentValue || !suggestedValue || !reason) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }

    const supabase = createSupabaseClient()

    const { data, error } = await supabase
      .from('suggestions')
      .insert({
        river_id: riverId,
        river_name: riverName || riverId,
        state_key: stateKey || '',
        user_id: userId || null,
        user_email: userEmail || null,
        field,
        current_value: currentValue,
        suggested_value: suggestedValue,
        reason: reason.slice(0, 2000),
        source_url: sourceUrl || null,
        status: 'pending',
      })
      .select()

    if (error) {
      console.error('Suggestion insert error:', error)
      return NextResponse.json({ error: 'Failed to submit suggestion' }, { status: 500 })
    }

    return NextResponse.json({ ok: true, suggestion: data?.[0] })
  } catch (err) {
    console.error('Suggestion error:', err)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

// GET /api/suggestions?status=pending — fetch suggestions (admin only)
export async function GET(req: NextRequest) {
  const userId = req.nextUrl.searchParams.get('userId')
  const status = req.nextUrl.searchParams.get('status') || 'pending'

  if (!isAdmin(userId || undefined)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 403 })
  }

  const supabase = createSupabaseClient()

  const { data, error } = await supabase
    .from('suggestions')
    .select('*')
    .eq('status', status)
    .order('created_at', { ascending: false })
    .limit(100)

  if (error) {
    return NextResponse.json({ error: 'Failed to fetch suggestions' }, { status: 500 })
  }

  return NextResponse.json({ suggestions: data })
}

// PATCH /api/suggestions — approve or reject (admin only)
export async function PATCH(req: NextRequest) {
  try {
    const body = await req.json()
    const { suggestionId, userId, action, adminNotes } = body

    if (!isAdmin(userId)) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 })
    }

    if (!suggestionId || !['approved', 'rejected'].includes(action)) {
      return NextResponse.json({ error: 'Invalid request' }, { status: 400 })
    }

    const supabase = createSupabaseClient()

    const { data, error } = await supabase
      .from('suggestions')
      .update({
        status: action,
        admin_notes: adminNotes || null,
        reviewed_at: new Date().toISOString(),
      })
      .eq('id', suggestionId)
      .select()

    if (error) {
      return NextResponse.json({ error: 'Failed to update suggestion' }, { status: 500 })
    }

    // If approved, send email notification via Resend
    if (action === 'approved' && data?.[0]) {
      const s = data[0]
      const resendKey = process.env.RESEND_API_KEY
      if (resendKey) {
        try {
          await fetch('https://api.resend.com/emails', {
            method: 'POST',
            headers: {
              'Authorization': `Bearer ${resendKey}`,
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              from: 'RiverScout <noreply@riverscout.app>',
              to: 'outfitters@riverscout.app',
              subject: `[Approved] Correction for ${s.river_name}: ${s.field}`,
              html: `
                <h2>Approved Correction</h2>
                <p><strong>River:</strong> ${s.river_name} (${s.state_key})</p>
                <p><strong>Field:</strong> ${s.field}</p>
                <p><strong>Current:</strong> ${s.current_value}</p>
                <p><strong>Suggested:</strong> ${s.suggested_value}</p>
                <p><strong>Reason:</strong> ${s.reason}</p>
                ${s.source_url ? `<p><strong>Source:</strong> <a href="${s.source_url}">${s.source_url}</a></p>` : ''}
                ${s.user_email ? `<p><strong>Submitted by:</strong> ${s.user_email}</p>` : ''}
                <hr/>
                <p style="color:#999;">This correction was approved and needs to be applied to the database.</p>
              `,
            }),
          })
        } catch (emailErr) {
          console.error('Resend email error:', emailErr)
          // Don't fail the request if email fails
        }
      }
    }

    return NextResponse.json({ ok: true, suggestion: data?.[0] })
  } catch (err) {
    console.error('Suggestion update error:', err)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
