import { NextRequest, NextResponse } from 'next/server'
import { createSupabaseClient } from '@/lib/supabase'
import { isAdmin } from '@/lib/admin'
import { sendEmail, improvementApprovedEmail, ADMIN_EMAIL } from '@/lib/email'
import { VERIFICATION_TAGS } from '@/lib/needs-verification'
import { getRiver } from '@/data/rivers'
import { getContributorTier, didJustLevelUp } from '@/lib/contributor-tiers'

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
    const isPermitUpdate = field === 'permit_update'

    if (!riverId || !field || !suggestedValue || !reason) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }

    // For non-safety / non-permit fields, also require currentValue.
    // Permit updates are descriptive ("application date moved to Feb
    // 1") rather than a single old→new value swap, so currentValue
    // is optional and we synthesize a placeholder.
    if (!isSafetyCritical && !isPermitUpdate && !currentValue) {
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

    // Tag safety-critical and permit-update submissions so the admin
    // page can sort/highlight them above ordinary improvements.
    if (isSafetyCritical) {
      insertData.ai_category = 'safety_critical'
    } else if (isPermitUpdate) {
      insertData.ai_category = 'permit_update'
    }

    const { data, error } = await supabase
      .from('suggestions')
      .insert(insertData)
      .select()

    if (error) {
      console.error('Suggestion insert error:', error)
      return NextResponse.json({ error: 'Failed to submit suggestion' }, { status: 500 })
    }

    // Send priority admin notification for permit-update submissions.
    // High priority because outdated permit info can cause someone to
    // miss a lottery window — but not safety-critical, so the email
    // is less alarming than the safe_cfs blast.
    if (isPermitUpdate) {
      try {
        await sendEmail({
          to: ADMIN_EMAIL,
          subject: `[Permit Update] ${riverName || riverId}`,
          html: `
            <div style="border-left: 4px solid #BA7517; padding: 16px; font-family: Georgia, serif;">
              <h2 style="color: #BA7517; margin: 0 0 8px;">Permit Update Reported</h2>
              <p><strong>River:</strong> ${riverName || riverId} (${(stateKey || '').toUpperCase()})</p>
              <p><strong>What changed:</strong> ${suggestedValue}</p>
              <p><strong>Reason / context:</strong> ${reason}</p>
              ${sourceUrl ? `<p><strong>Source:</strong> <a href="${sourceUrl}">${sourceUrl}</a></p>` : '<p><em>No source URL provided.</em></p>'}
              <p><strong>Submitted by:</strong> ${userEmail || 'anonymous'}</p>
              <hr/>
              <p style="color: #BA7517; font-weight: bold;">Outdated permit info can cause paddlers to miss a lottery window. Verify against the agency site and update the row in /admin/permits.</p>
              <p><a href="https://riverscout.app/admin/suggestions">Review in Admin Dashboard &rarr;</a></p>
              <p><a href="https://riverscout.app/admin/permits">Open Admin Permits &rarr;</a></p>
            </div>
          `,
        })
      } catch (emailErr) {
        console.error('[SUGGESTIONS] Failed to send permit-update admin email:', emailErr)
      }
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

  // Decorate each suggestion with the submitter's lifetime approved count
  // so the admin queue can render contributor tier badges next to the
  // submitter email. We do this here (not on the client) because the
  // browser can't reach auth.users / the suggestions table with the
  // anon key under our RLS policies, and the count is cheap on the
  // server.
  const submitterIds = Array.from(
    new Set((data || []).map(s => s.user_id).filter((id): id is string => !!id))
  )
  const approvedCounts: Record<string, number> = {}
  if (submitterIds.length > 0) {
    const { data: approvedRows } = await supabase
      .from('suggestions')
      .select('user_id')
      .eq('status', 'approved')
      .in('user_id', submitterIds)
    for (const row of approvedRows || []) {
      if (row.user_id) approvedCounts[row.user_id] = (approvedCounts[row.user_id] || 0) + 1
    }
  }
  const decorated = (data || []).map(s => ({
    ...s,
    submitter_approved_count: s.user_id ? (approvedCounts[s.user_id] || 0) : 0,
  }))

  return NextResponse.json({ suggestions: decorated })
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

      // Rollback: delete the override row so the river reverts to
      // the static data/rivers.ts value. Also clear any cleared-tag
      // rows tied to this suggestion so the verification chip
      // reappears for re-review.
      //
      // Same scalar-only allow-list as the approve handler. Array
      // fields like sections/access_points can't be round-tripped
      // through the override layer, so they were never written and
      // there's nothing to delete on rollback.
      const OVERRIDEABLE_FIELDS = new Set([
        'cls', 'opt', 'len', 'desc', 'desig', 'gauge', 'safe_cfs',
      ])

      if (OVERRIDEABLE_FIELDS.has(original.field)) {
        const { error: delErr } = await supabase
          .from('river_field_overrides')
          .delete()
          .eq('river_id', original.river_id)
          .eq('field', original.field)

        if (delErr) {
          return NextResponse.json({ error: 'Failed to rollback override: ' + delErr.message }, { status: 500 })
        }

        // Re-flag the verification tags this approval cleared. We
        // identify them by source_suggestion_id rather than the
        // tag→field mapping so we only un-clear what THIS specific
        // approval cleared.
        await supabase
          .from('river_cleared_verification_tags')
          .delete()
          .eq('source_suggestion_id', suggestionId)
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

    // For approved: apply the change to the override layer FIRST
    // (mission-critical). The override layer is a thin Supabase
    // table that the river page reads alongside the static
    // data/rivers.ts data — see lib/river-page-data.ts and
    // app/rivers/[state]/[slug]/page.tsx for the merge logic.
    //
    // Why an override layer instead of writing to public.rivers:
    // the river page reads from data/rivers.ts (a static TypeScript
    // file), not from Supabase. Writes to public.rivers were
    // happening but never visible on the live site. The override
    // layer is the bridge that lets approved improvements actually
    // show up.
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

      // Allow-list of overrideable fields. Anything outside this set
      // (e.g. permit_update, photos, custom community fields) is
      // considered metadata-only and the approval just changes the
      // suggestion status without writing an override.
      //
      // IMPORTANT: scalar fields only. The override layer's
      // `value` column is TEXT and the render-merge in
      // app/rivers/[state]/[slug]/page.tsx assigns the override
      // string directly into the static river record. Array
      // fields like `sections` and `access_points` can't be
      // round-tripped through a single text value, so even if
      // an admin approves them the render layer will silently
      // skip them and the page keeps showing the static data.
      // Those fields are blocked here and an explicit error is
      // returned so the admin knows to apply the fix via direct
      // edit to data/rivers.ts instead.
      const OVERRIDEABLE_FIELDS = new Set([
        'cls', 'opt', 'len', 'desc', 'desig', 'gauge', 'safe_cfs',
      ])
      const ARRAY_FIELDS_NEEDING_DIRECT_EDIT = new Set([
        'sections', 'access_points',
      ])

      if (ARRAY_FIELDS_NEEDING_DIRECT_EDIT.has(suggestion.field)) {
        return NextResponse.json({
          error:
            `The "${suggestion.field}" field is an array and can't be applied through the override layer. ` +
            `Edit data/rivers.ts directly for river_id "${suggestion.river_id}", commit the change, and then ` +
            `mark this suggestion approved manually with the admin_notes column. The suggestion is staying ` +
            `pending so it doesn't disappear from the queue.`,
          field: suggestion.field,
          riverId: suggestion.river_id,
          suggestedValue: suggestion.suggested_value,
        }, { status: 400 })
      }

      if (OVERRIDEABLE_FIELDS.has(suggestion.field)) {
        // Upsert into river_field_overrides — last approved value
        // wins per (river_id, field). The unique constraint on
        // (river_id, field) handles the conflict for re-approvals.
        const { error: overrideErr } = await supabase
          .from('river_field_overrides')
          .upsert(
            {
              river_id: suggestion.river_id,
              field: suggestion.field,
              value: suggestion.suggested_value,
              source_suggestion_id: suggestion.id,
              applied_at: new Date().toISOString(),
              applied_by: userId,
            },
            { onConflict: 'river_id,field' },
          )

        if (overrideErr) {
          return NextResponse.json({
            error: `Failed to write override: ${overrideErr.message}. Suggestion stays pending.`,
          }, { status: 500 })
        }

        // Clear any verification tags whose suggestField matches the
        // field we just approved. The DataConfidenceBanner will
        // subtract these from the static needsVerification list at
        // render time, so the warning chip disappears immediately.
        //
        // We only clear tags that the river ACTUALLY has — looking up
        // VERIFICATION_TAGS by suggestField gives us all candidate
        // tag keys (e.g. clf is mapped from 'class-rating-drift'),
        // then we filter against the river's own static array to
        // avoid inserting orphan rows.
        const matchingTags = Object.entries(VERIFICATION_TAGS)
          .filter(([, meta]) => meta.suggestField === suggestion.field)
          .map(([tag]) => tag)

        if (matchingTags.length > 0) {
          const river = getRiver(suggestion.river_id)
          const staticTags = (river?.needsVerification as string[] | undefined) ?? []
          const tagsToClear = matchingTags.filter(t => staticTags.includes(t))

          if (tagsToClear.length > 0) {
            const rows = tagsToClear.map(tag => ({
              river_id: suggestion.river_id,
              tag,
              source_suggestion_id: suggestion.id,
              cleared_at: new Date().toISOString(),
              cleared_by: userId,
            }))
            // Best-effort: if a tag was already cleared by a prior
            // approval the unique constraint will conflict — that's
            // fine, we just want it gone. Use upsert with onConflict
            // to make the operation idempotent.
            const { error: clearErr } = await supabase
              .from('river_cleared_verification_tags')
              .upsert(rows, { onConflict: 'river_id,tag' })

            if (clearErr) {
              // Don't fail the approval over a tag-clear miss —
              // the override is the mission-critical write. Log
              // and move on.
              console.error('[SUGGESTIONS] Failed to clear verification tags:', clearErr)
            }
          }
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

      // BEST-EFFORT: Get contributor stats for the email + tier
      // celebration. We count by user_email rather than user_id
      // because some legacy submissions only have email.
      let totalSubmitted = 0
      let totalApproved = 0

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
        } catch (statsErr) {
          console.error('[SUGGESTIONS] Failed to fetch contributor stats:', statsErr)
        }
      }

      // BEST-EFFORT: Send contributor notification email
      if (suggestion.user_email) {
        try {
          // Tier crossing detection — totalApproved already includes
          // this newly-approved suggestion, so the previous count is
          // totalApproved - 1. didJustLevelUp returns the new tier
          // when the user just crossed a threshold, otherwise null.
          const previousCount = Math.max(0, totalApproved - 1)
          const leveledUpTo = didJustLevelUp(previousCount, totalApproved)
          const currentTier = getContributorTier(totalApproved)

          const statsLine = totalSubmitted > 0
            ? `<p style="font-family: monospace; font-size: 12px; color: #666;">Your stats: ${totalApproved} of ${totalSubmitted} improvements approved.</p>`
            : ''

          // Tier celebration — replaces the old "first approval"
          // single-line. didJustLevelUp returns the first-tier on
          // the literal first approval, so this also handles the
          // welcome moment without a separate branch.
          const tierBlock = leveledUpTo
            ? `
              <div style="background: ${leveledUpTo.background}; border: 1px solid ${leveledUpTo.border}; border-radius: 8px; padding: 16px 20px; margin-bottom: 16px; text-align: center;">
                <div style="font-size: 32px; line-height: 1; margin-bottom: 6px;">${leveledUpTo.icon}</div>
                <div style="font-family: monospace; font-size: 10px; color: ${leveledUpTo.color}; text-transform: uppercase; letter-spacing: 1.5px; font-weight: 700; margin-bottom: 6px;">
                  New Tier Unlocked
                </div>
                <div style="font-family: Georgia, serif; font-size: 20px; font-weight: 700; color: ${leveledUpTo.color}; margin-bottom: 8px;">
                  ${leveledUpTo.label}
                </div>
                <div style="font-family: monospace; font-size: 11px; color: ${leveledUpTo.color}; opacity: 0.85; line-height: 1.55;">
                  ${leveledUpTo.description}
                </div>
              </div>
            `
            : currentTier.key !== 'none'
              ? `
                <div style="background: #f6f5f2; border: 1px solid #e2e1d8; border-radius: 6px; padding: 10px 14px; margin-bottom: 14px; font-family: monospace; font-size: 11px; color: #666; display: flex; align-items: center; gap: 8px;">
                  <span style="font-size: 14px;">${currentTier.icon}</span>
                  <span>You\u2019re a <strong style="color: ${currentTier.color};">${currentTier.label}</strong> contributor.</span>
                </div>
              `
              : ''

          await sendEmail({
            to: suggestion.user_email,
            subject: leveledUpTo
              ? `\u2728 ${leveledUpTo.label} \u2014 your ${suggestion.river_name} improvement is live`
              : `Your improvement to ${suggestion.river_name} is live!`,
            html: `
              <div style="font-family: Georgia, serif; max-width: 520px; margin: 0 auto; padding: 20px;">
                <div style="font-size: 20px; font-weight: 700; color: #085041; margin-bottom: 16px;">
                  River<span style="color: #185FA5;">Scout</span>
                </div>
                ${tierBlock}
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
