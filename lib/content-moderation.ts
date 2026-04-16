// Content sanitization, AI moderation, and rate limiting for all
// user-submitted text. Applied in every write endpoint (trips, Q&A,
// hazards, access points, suggestions).
//
// Sanitization is plain-text-only: we strip all HTML + script tags,
// control characters, and collapse whitespace. There's no use case
// for user-submitted markup anywhere on the site, so the simplest
// safe approach is reject-all rather than allow-listing. A dep-free
// implementation avoids the ~1MB jsdom transitive dep that
// sanitize-html / DOMPurify bring.
//
// Moderation sends every submission through Claude Haiku for
// spam/abuse/off-topic detection. Approved submissions go live
// immediately; flagged submissions land in status='pending' for
// manual review in /admin. An email notification fires to the admin
// on every flag so nothing gets stuck unnoticed.
//
// Rate limiting is per-user-per-bucket via a Supabase table
// (rate_limits, mig 043). Each bucket has a configurable max-per-
// hour window. Serverless-safe (no in-memory state).

import type { SupabaseClient } from '@supabase/supabase-js'
import { sendEmail } from '@/lib/email'

const ANTHROPIC_URL = 'https://api.anthropic.com/v1/messages'
const MODEL = 'claude-haiku-4-5-20251001'
const TIMEOUT_MS = 8_000
const ADMIN_EMAIL = 'Paddle.rivers.us@gmail.com'

// ── Sanitization ──────────────────────────────────────────────────

export function sanitizeText(raw: unknown, maxLen: number): string {
  return String(raw ?? '')
    .replace(/<script[\s\S]*?<\/script>/gi, '')
    .replace(/<style[\s\S]*?<\/style>/gi, '')
    .replace(/<[^>]*>/g, '')
    .replace(/&lt;|&gt;|&amp;|&quot;|&#\d+;|&#x[0-9a-f]+;/gi, ' ')
    .replace(/[\x00-\x08\x0B-\x0C\x0E-\x1F\x7F]/g, '')
    .replace(/\s+/g, ' ')
    .trim()
    .slice(0, maxLen)
}

// Convenience: sanitize a URL (strip tags, enforce https/http
// scheme, length cap). Returns null if the result isn't a valid URL.
export function sanitizeUrl(raw: unknown, maxLen = 2000): string | null {
  const cleaned = sanitizeText(raw, maxLen)
  if (!cleaned) return null
  try {
    const url = new URL(cleaned)
    if (url.protocol !== 'https:' && url.protocol !== 'http:') return null
    return url.href
  } catch {
    return null
  }
}

// ── AI moderation ─────────────────────────────────────────────────

export interface ModerationResult {
  approved: boolean
  reason: string
}

export async function moderateContent(content: string): Promise<ModerationResult> {
  const apiKey = process.env.ANTHROPIC_API_KEY
  if (!apiKey) {
    // No key → approve by default and log. The admin can still
    // review submissions manually; we don't want to block the UX
    // when moderation is unavailable.
    console.warn('[moderation] No ANTHROPIC_API_KEY — auto-approving')
    return { approved: true, reason: 'Moderation unavailable — auto-approved.' }
  }

  const prompt = `Review this user submission for a river conditions platform. Flag if it contains: spam, advertising, hate speech, personal information (phone numbers, addresses, SSNs), content completely unrelated to rivers/paddling/fishing, or anything inappropriate for a family-friendly outdoor community.

Submission: "${content.slice(0, 4000)}"

Respond with JSON only: {"approved": true/false, "reason": "brief explanation"}`

  const controller = new AbortController()
  const timer = setTimeout(() => controller.abort(), TIMEOUT_MS)
  try {
    const res = await fetch(ANTHROPIC_URL, {
      method: 'POST',
      signal: controller.signal,
      headers: {
        'x-api-key': apiKey,
        'anthropic-version': '2023-06-01',
        'content-type': 'application/json',
      },
      body: JSON.stringify({ model: MODEL, max_tokens: 100, messages: [{ role: 'user', content: prompt }] }),
    })
    clearTimeout(timer)
    if (!res.ok) {
      console.error('[moderation] Claude API error:', res.status)
      return { approved: true, reason: 'Moderation API error — auto-approved.' }
    }
    const data = await res.json()
    const text = data.content?.[0]?.text?.trim() ?? ''
    const match = text.match(/\{[\s\S]*\}/)
    if (!match) return { approved: true, reason: 'Unparseable moderation response — auto-approved.' }
    const parsed = JSON.parse(match[0])
    return {
      approved: !!parsed.approved,
      reason: typeof parsed.reason === 'string' ? parsed.reason.slice(0, 500) : 'No reason provided.',
    }
  } catch (err) {
    clearTimeout(timer)
    if (err instanceof Error && (err.name === 'AbortError' || err.message.includes('aborted'))) {
      console.warn('[moderation] Claude timeout')
    } else {
      console.error('[moderation] error:', err)
    }
    return { approved: true, reason: 'Moderation timed out — auto-approved.' }
  }
}

// ── Admin notification ────────────────────────────────────────────

export async function notifyAdminFlagged(params: {
  contentType: string
  excerpt: string
  userId: string | null
  riverId: string
}) {
  try {
    await sendEmail({
      to: ADMIN_EMAIL,
      subject: `[RiverScout] Flagged ${params.contentType} needs review`,
      html: `<p>A ${params.contentType} submission was flagged by AI moderation.</p>
<p><strong>River:</strong> ${params.riverId}<br/>
<strong>User ID:</strong> ${params.userId ?? 'anonymous'}<br/>
<strong>Excerpt:</strong> ${params.excerpt.slice(0, 300)}</p>
<p><a href="https://riverscout.app/admin">Review in admin panel →</a></p>`,
    })
  } catch {
    console.error('[moderation] Failed to send admin notification email')
  }
}

// ── Rate limiting ─────────────────────────────────────────────────

export const RATE_LIMITS = {
  trip_report:   3,   // per hour
  qa_answer:     10,
  hazard:        5,
  suggestion:    10,
  access_point:  10,
  fish_catch:    5,
} as const

export type RateBucket = keyof typeof RATE_LIMITS

export interface RateLimitResult {
  allowed: boolean
  remaining: number
  retryAfterMs?: number
}

const WINDOW_MS = 60 * 60 * 1000  // 1 hour

export async function checkRateLimit(
  supabase: SupabaseClient,
  userId: string,
  bucket: RateBucket,
): Promise<RateLimitResult> {
  const max = RATE_LIMITS[bucket]
  const now = new Date()

  const { data } = await supabase
    .from('rate_limits')
    .select('count, window_start')
    .eq('user_id', userId)
    .eq('bucket', bucket)
    .maybeSingle()

  if (!data) {
    await supabase.from('rate_limits').upsert({
      user_id: userId, bucket, count: 1,
      window_start: now.toISOString(),
    }, { onConflict: 'user_id,bucket' })
    return { allowed: true, remaining: max - 1 }
  }

  const windowAge = now.getTime() - new Date(data.window_start).getTime()
  if (windowAge > WINDOW_MS) {
    await supabase.from('rate_limits').update({
      count: 1, window_start: now.toISOString(),
    }).eq('user_id', userId).eq('bucket', bucket)
    return { allowed: true, remaining: max - 1 }
  }

  if (data.count >= max) {
    return {
      allowed: false,
      remaining: 0,
      retryAfterMs: WINDOW_MS - windowAge,
    }
  }

  await supabase.from('rate_limits').update({
    count: data.count + 1,
  }).eq('user_id', userId).eq('bucket', bucket)

  return { allowed: true, remaining: max - data.count - 1 }
}
