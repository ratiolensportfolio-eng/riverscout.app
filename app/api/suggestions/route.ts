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
  promptPrefix: string = '',
): Promise<{ confidence: 'high' | 'medium' | 'low'; reasoning: string }> {
  const apiKey = process.env.ANTHROPIC_API_KEY
  if (!apiKey) {
    return { confidence: 'medium', reasoning: 'AI evaluation unavailable — no API key configured.' }
  }

  // 10s timeout via AbortController — never let Anthropic API hang
  const controller = new AbortController()
  const timer = setTimeout(() => controller.abort(), 10000)

  try {
    const res = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      signal: controller.signal,
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
          content: `${promptPrefix}You are a river data expert evaluating a user-submitted correction for the RiverScout paddling atlas. Evaluate whether this suggestion is plausible and accurate.

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
    clearTimeout(timer)

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
    clearTimeout(timer)
    if (err instanceof Error && (err.name === 'AbortError' || err.message.includes('aborted'))) {
      console.warn('[AI] Anthropic API timeout after 10s')
      return { confidence: 'medium', reasoning: 'AI evaluation timed out — please review manually.' }
    }
    console.error('[AI] Evaluation error:', err)
    return { confidence: 'medium', reasoning: 'AI evaluation failed — network error.' }
  }
}

// POST /api/suggestions — submit a correction suggestion
export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { riverId, riverName, stateKey, userId, userEmail, field, currentValue, suggestedValue, reason, sourceUrl, safetyData } = body

    const isSafetyCritical = field === 'safe_cfs'

    if (!riverId || !field || !suggestedValue || !reason) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }

    // For non-safety fields, also require currentValue
    if (!isSafetyCritical && !currentValue) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }

    // AI pre-evaluation (with enhanced prompt for safety-critical)
    const safetyPromptPrefix = isSafetyCritical
      ? 'This is a safety-critical submission about dangerous CFS levels. Weight your confidence assessment accordingly and flag any concerns. '
      : ''

    const ai = await evaluateSuggestion(
      riverName || riverId, stateKey || '', field,
      currentValue || 'Not specified', suggestedValue, reason, sourceUrl || null,
      safetyPromptPrefix,
    )

    const supabase = createSupabaseClient()

    const insertData: Record<string, unknown> = {
      river_id: riverId,
      river_name: riverName || riverId,
      state_key: stateKey || '',
      user_id: userId || null,
      user_email: userEmail || null,
      field,
      current_value: currentValue || 'Not specified',
      suggested_value: suggestedValue,
      reason: reason.slice(0, 2000),
      source_url: sourceUrl || null,
      status: 'pending',
      ai_confidence: ai.confidence,
      ai_reasoning: ai.reasoning,
    }

    // Tag safety-critical submissions
    if (isSafetyCritical) {
      insertData.ai_category = 'safety_critical'
    }

    const { data, error } = await supabase
      .from('suggestions')
      .insert(insertData)
      .select()

    if (error) {
      console.error('Suggestion insert error:', error)
      return NextResponse.json({ error: 'Failed to submit suggestion' }, { status: 500 })
    }

    // Send priority admin notification for safety-critical submissions
    if (isSafetyCritical) {
      const safetyInfo = safetyData
        ? `<p><strong>Upper Safe Limit:</strong> ${safetyData.upperLimit} CFS</p>
           <p><strong>Hazard:</strong> ${safetyData.hazard}</p>
           <p><strong>Experience:</strong> ${safetyData.experience} trips</p>`
        : ''

      try {
        await sendEmail({
          to: ADMIN_EMAIL,
          subject: `\u26A0 SAFETY CRITICAL suggestion \u2014 ${riverName || riverId}`,
          html: `
            <div style="border-left: 4px solid #A32D2D; padding: 16px; margin-bottom: 16px;">
              <h2 style="color: #A32D2D; margin: 0 0 8px;">\u26A0 Safety Critical Submission</h2>
              <p><strong>River:</strong> ${riverName || riverId} (${(stateKey || '').toUpperCase()})</p>
              ${safetyInfo}
              <p><strong>Reason:</strong> ${reason}</p>
              <p><strong>Submitted by:</strong> ${userEmail || 'anonymous'}</p>
              <p><strong>AI Assessment:</strong> ${ai.confidence} confidence — ${ai.reasoning}</p>
              <hr/>
              <p style="color: #A32D2D; font-weight: bold;">This submission affects paddler safety. Review immediately.</p>
              <p><a href="https://riverscout.app/admin/suggestions">Review in Admin Dashboard &rarr;</a></p>
            </div>
          `,
        })
      } catch (emailErr) {
        console.error('[SUGGESTIONS] Failed to send safety admin email:', emailErr)
      }
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
        cls: 'class', opt: 'optimal_cfs', len: 'length',
        desc: 'description', desig: 'designations', gauge: 'usgs_gauge',
        sections: 'sections', access_points: 'sections',
        safe_cfs: 'optimal_cfs',
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

    // For approved: apply the change to the database FIRST (mission-critical)
    if (action === 'approved') {
      // Fetch the suggestion to get field details
      const { data: suggestion, error: fetchErr } = await supabase
        .from('suggestions')
        .select('*')
        .eq('id', suggestionId)
        .single()

      if (fetchErr || !suggestion) {
        return NextResponse.json({ error: 'Suggestion not found' }, { status: 404 })
      }

      // MISSION-CRITICAL: Apply the change to the rivers table
      const fieldMap: Record<string, string> = {
        cls: 'class', opt: 'optimal_cfs', len: 'length',
        desc: 'description', desig: 'designations', gauge: 'usgs_gauge',
        sections: 'sections', access_points: 'sections',
        safe_cfs: 'optimal_cfs',
      }

      const dbField = fieldMap[suggestion.field]
      if (dbField) {
        const { error: updateErr } = await supabase
          .from('rivers')
          .update({ [dbField]: suggestion.suggested_value, updated_at: new Date().toISOString() })
          .eq('id', suggestion.river_id)

        if (updateErr) {
          // DATA UPDATE FAILED — do NOT mark as approved, return error
          return NextResponse.json({
            error: `Failed to update river data: ${updateErr.message}. Suggestion stays pending.`,
          }, { status: 500 })
        }
      }

      // Data update succeeded — now mark as approved (this should not fail, but if it does, the data is already correct)
      const { error: statusErr } = await supabase
        .from('suggestions')
        .update({
          status: 'approved',
          admin_notes: adminNotes || null,
          reviewed_at: new Date().toISOString(),
        })
        .eq('id', suggestionId)

      if (statusErr) {
        console.error('[SUGGESTIONS] Failed to update status after successful data change:', statusErr)
        // Data is already updated — return success but note the status issue
      }

      // BEST-EFFORT: Get contributor stats for the email
      let totalSubmitted = 0
      let totalApproved = 0
      let isFirstApproval = false

      if (suggestion.user_email) {
        try {
          const { count: submitted } = await supabase
            .from('suggestions')
            .select('*', { count: 'exact', head: true })
            .eq('user_email', suggestion.user_email)
          totalSubmitted = submitted || 0

          const { count: approved } = await supabase
            .from('suggestions')
            .select('*', { count: 'exact', head: true })
            .eq('user_email', suggestion.user_email)
            .eq('status', 'approved')
          totalApproved = approved || 0

          isFirstApproval = totalApproved === 1
        } catch (statsErr) {
          console.error('[SUGGESTIONS] Failed to fetch contributor stats:', statsErr)
        }
      }

      // BEST-EFFORT: Send contributor notification email
      if (suggestion.user_email) {
        try {
          const statsLine = totalSubmitted > 0
            ? `<p style="font-family: monospace; font-size: 12px; color: #666;">Your stats: ${totalApproved} of ${totalSubmitted} improvements approved.</p>`
            : ''
          const firstTimeLine = isFirstApproval
            ? `<p style="font-size: 16px; color: #1D9E75; font-weight: bold;">This is your first approved improvement — thank you for being a river steward!</p>`
            : ''

          await sendEmail({
            to: suggestion.user_email,
            subject: `Your improvement to ${suggestion.river_name} is live!`,
            html: `
              <div style="font-family: Georgia, serif; max-width: 520px; margin: 0 auto; padding: 20px;">
                <div style="font-size: 20px; font-weight: 700; color: #085041; margin-bottom: 16px;">
                  River<span style="color: #185FA5;">Scout</span>
                </div>
                ${firstTimeLine}
                <p>Your improvement to <strong>${suggestion.river_name}</strong> has been reviewed and approved.</p>
                <p><strong>Field:</strong> ${suggestion.field}</p>
                <p><strong>Updated to:</strong> ${suggestion.suggested_value}</p>
                ${statsLine}
                <p style="color: #999; font-size: 12px; margin-top: 20px;">
                  Thank you for helping keep RiverScout accurate for paddlers and anglers across America.
                </p>
              </div>
            `,
          })
        } catch (emailErr) {
          console.error('[SUGGESTIONS] Failed to send contributor email:', emailErr)
        }
      }

      // BEST-EFFORT: Send admin confirmation email
      try {
        await sendEmail({
          to: ADMIN_EMAIL,
          subject: `[Approved] Improvement for ${suggestion.river_name}: ${suggestion.field}`,
          html: improvementApprovedEmail(
            suggestion.river_name, suggestion.state_key, suggestion.field,
            suggestion.current_value, suggestion.suggested_value, suggestion.reason,
            suggestion.source_url, suggestion.user_email,
          ),
        })
      } catch (adminEmailErr) {
        console.error('[SUGGESTIONS] Failed to send admin email:', adminEmailErr)
      }

      return NextResponse.json({ ok: true, suggestion })
    }

    // For rejected: just update status (no data changes needed)
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

    return NextResponse.json({ ok: true, suggestion: data?.[0] })
  } catch (err) {
    console.error('Suggestion update error:', err)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
