import { NextRequest, NextResponse } from 'next/server'
import { createSupabaseClient } from '@/lib/supabase'
import { isAdmin } from '@/lib/admin'
import { sendEmail, improvementApprovedEmail, ADMIN_EMAIL } from '@/lib/email'

// AI evaluation of a suggestion using Claude
async function evaluateSuggestion(
  riverName: string,
  stateKey: string,
  field: string,
  currentValue: string,
  suggestedValue: string,
  reason: string,
  sourceUrl: string | null,
): Promise<{ confidence: 'high' | 'medium' | 'low'; reasoning: string }> {
  const apiKey = process.env.ANTHROPIC_API_KEY
  if (!apiKey) {
    return { confidence: 'medium', reasoning: 'AI evaluation unavailable — no API key configured.' }
  }

  try {
    const res = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'x-api-key': apiKey,
        'anthropic-version': '2023-06-01',
        'content-type': 'application/json',
      },
      body: JSON.stringify({
        model: 'claude-haiku-4-5-20251001',
        max_tokens: 500,
        messages: [{
          role: 'user',
          content: `You are a river data expert evaluating a user-submitted correction for the RiverScout paddling atlas. Evaluate whether this suggestion is plausible and accurate.

River: ${riverName} (${stateKey.toUpperCase()})
Field being corrected: ${field}
Current value in our database: ${currentValue}
User's suggested value: ${suggestedValue}
User's reason: ${reason}
${sourceUrl ? `Source provided: ${sourceUrl}` : 'No source URL provided.'}

Evaluate:
1. Is this suggestion plausible based on what you know about this river?
2. Does the suggested value conflict with known facts?
3. Is the user's reasoning sound?

Respond in this exact JSON format:
{"confidence": "high" or "medium" or "low", "reasoning": "Your 1-3 sentence assessment"}

- "high" = suggestion is almost certainly correct, aligns with known data
- "medium" = suggestion is plausible but needs verification
- "low" = suggestion appears incorrect, conflicts with known facts, or is suspicious

Be concise. Respond ONLY with the JSON object.`,
        }],
      }),
    })

    if (!res.ok) {
      console.error('[AI] Claude API error:', res.status)
      return { confidence: 'medium', reasoning: 'AI evaluation failed — API error.' }
    }

    const data = await res.json()
    const text = data.content?.[0]?.text?.trim() || ''

    // Parse the JSON response
    try {
      const parsed = JSON.parse(text)
      const confidence = ['high', 'medium', 'low'].includes(parsed.confidence) ? parsed.confidence : 'medium'
      const reasoning = typeof parsed.reasoning === 'string' ? parsed.reasoning.slice(0, 1000) : 'No reasoning provided.'
      return { confidence, reasoning }
    } catch {
      // If Claude didn't return valid JSON, extract what we can
      return { confidence: 'medium', reasoning: text.slice(0, 500) || 'AI returned unparseable response.' }
    }
  } catch (err) {
    console.error('[AI] Evaluation error:', err)
    return { confidence: 'medium', reasoning: 'AI evaluation failed — network error.' }
  }
}

// POST /api/suggestions — submit a correction suggestion
export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { riverId, riverName, stateKey, userId, userEmail, field, currentValue, suggestedValue, reason, sourceUrl } = body

    if (!riverId || !field || !currentValue || !suggestedValue || !reason) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }

    // AI pre-evaluation
    const ai = await evaluateSuggestion(
      riverName || riverId, stateKey || '', field,
      currentValue, suggestedValue, reason, sourceUrl || null,
    )

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
        ai_confidence: ai.confidence,
        ai_reasoning: ai.reasoning,
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

// GET /api/suggestions?status=pending&userId=... — admin: fetch all suggestions by status
// GET /api/suggestions?riverId=... — public: fetch approved changes for a river
export async function GET(req: NextRequest) {
  const userId = req.nextUrl.searchParams.get('userId')
  const status = req.nextUrl.searchParams.get('status')
  const riverId = req.nextUrl.searchParams.get('riverId')

  const supabase = createSupabaseClient()

  // Public: fetch approved changes for a specific river (for Data Accuracy section)
  if (riverId && !userId) {
    const { data, error } = await supabase
      .from('suggestions')
      .select('field, reviewed_at')
      .eq('river_id', riverId)
      .eq('status', 'approved')
      .order('reviewed_at', { ascending: false })
      .limit(20)

    if (error) {
      return NextResponse.json({ changes: [] })
    }
    return NextResponse.json({ changes: data || [] })
  }

  // Admin: fetch by status
  if (!isAdmin(userId || undefined)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 403 })
  }

  const { data, error } = await supabase
    .from('suggestions')
    .select('*')
    .eq('status', status || 'pending')
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

    if (!suggestionId || !['approved', 'rejected', 'rollback'].includes(action)) {
      return NextResponse.json({ error: 'Invalid request' }, { status: 400 })
    }

    const supabase = createSupabaseClient()

    // Handle rollback
    if (action === 'rollback') {
      // Get the original suggestion
      const { data: original, error: fetchErr } = await supabase
        .from('suggestions')
        .select('*')
        .eq('id', suggestionId)
        .single()

      if (fetchErr || !original) {
        return NextResponse.json({ error: 'Suggestion not found' }, { status: 404 })
      }

      // Apply the rollback — update the river field back to the original value
      const fieldMap: Record<string, string> = {
        cls: 'class',
        opt: 'optimal_cfs',
        len: 'length',
        desc: 'description',
        desig: 'designations',
        gauge: 'usgs_gauge',
      }

      const dbField = fieldMap[original.field]
      if (dbField) {
        const { error: updateErr } = await supabase
          .from('rivers')
          .update({ [dbField]: original.current_value, updated_at: new Date().toISOString() })
          .eq('id', original.river_id)

        if (updateErr) {
          return NextResponse.json({ error: 'Failed to rollback river data: ' + updateErr.message }, { status: 500 })
        }
      }

      // Update suggestion status to rolled_back
      await supabase
        .from('suggestions')
        .update({
          status: 'rolled_back',
          admin_notes: (original.admin_notes || '') + '\n[Rolled back by admin at ' + new Date().toISOString() + ']',
          reviewed_at: new Date().toISOString(),
        })
        .eq('id', suggestionId)

      // Send rollback notification email
      await sendEmail({
        to: ADMIN_EMAIL,
        subject: `[Rollback] ${original.river_name}: ${original.field} reverted`,
        html: `
          <h2>Rollback Confirmed</h2>
          <p><strong>River:</strong> ${original.river_name} (${original.state_key.toUpperCase()})</p>
          <p><strong>Field:</strong> ${original.field}</p>
          <p><strong>Reverted from:</strong> ${original.suggested_value}</p>
          <p><strong>Reverted to:</strong> ${original.current_value}</p>
          <hr/>
          <p style="color:#999;">This change was rolled back by an admin.</p>
        `,
      })

      return NextResponse.json({ ok: true, action: 'rollback', river: original.river_name, field: original.field })
    }

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

    // If approved, send email notification
    if (action === 'approved' && data?.[0]) {
      const s = data[0]
      await sendEmail({
        to: ADMIN_EMAIL,
        subject: `[Approved] Improvement for ${s.river_name}: ${s.field}`,
        html: improvementApprovedEmail(
          s.river_name, s.state_key, s.field,
          s.current_value, s.suggested_value, s.reason,
          s.source_url, s.user_email,
        ),
      })
    }

    return NextResponse.json({ ok: true, suggestion: data?.[0] })
  } catch (err) {
    console.error('Suggestion update error:', err)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
