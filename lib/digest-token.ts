// HMAC-signed unsubscribe tokens for the weekly digest.
//
// Why a custom token instead of supabase.auth: the unsubscribe link
// in every email must work in one click without making the user log
// in. We sign a payload of {userId} with HMAC-SHA256 using the same
// CRON_SECRET that gates the cron endpoints. The token is opaque to
// the user but trivially verifiable on the server.
//
// Token format: base64url(payloadJson) + "." + base64url(hmac)
//
// We deliberately don't reach for the `jose` library or full JWT —
// the surface area is one user_id and one signature, and pulling in
// a JWT lib for that is overkill. Native crypto only.

import crypto from 'node:crypto'

const SECRET = process.env.CRON_SECRET ?? 'dev-only-fallback-please-set-CRON_SECRET'

function base64urlEncode(buf: Buffer): string {
  return buf.toString('base64')
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=+$/, '')
}

function base64urlDecode(s: string): Buffer {
  // Re-pad to a multiple of 4
  const padded = s + '='.repeat((4 - (s.length % 4)) % 4)
  return Buffer.from(padded.replace(/-/g, '+').replace(/_/g, '/'), 'base64')
}

export interface DigestTokenPayload {
  userId: string
  // No expiry — unsubscribe links should work forever. If a user
  // forwards a 6-month-old digest and the recipient clicks unsub,
  // that should still work and unsubscribe the original recipient.
}

export function signDigestToken(payload: DigestTokenPayload): string {
  const json = JSON.stringify(payload)
  const payloadPart = base64urlEncode(Buffer.from(json, 'utf8'))
  const hmac = crypto.createHmac('sha256', SECRET).update(payloadPart).digest()
  const sigPart = base64urlEncode(hmac)
  return `${payloadPart}.${sigPart}`
}

export function verifyDigestToken(token: string): DigestTokenPayload | null {
  if (!token || typeof token !== 'string') return null
  const parts = token.split('.')
  if (parts.length !== 2) return null
  const [payloadPart, sigPart] = parts

  // Recompute the HMAC and constant-time compare
  const expected = crypto.createHmac('sha256', SECRET).update(payloadPart).digest()
  let provided: Buffer
  try {
    provided = base64urlDecode(sigPart)
  } catch {
    return null
  }
  if (provided.length !== expected.length) return null
  if (!crypto.timingSafeEqual(provided, expected)) return null

  try {
    const json = base64urlDecode(payloadPart).toString('utf8')
    const parsed = JSON.parse(json) as DigestTokenPayload
    if (typeof parsed?.userId !== 'string') return null
    return parsed
  } catch {
    return null
  }
}
