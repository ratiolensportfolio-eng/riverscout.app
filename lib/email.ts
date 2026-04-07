// Centralized email sending via Resend
// All outgoing emails from noreply@riverscout.app

const RESEND_API_URL = 'https://api.resend.com/emails'
const FROM_ADDRESS = 'RiverScout <noreply@riverscout.app>'
const ADMIN_EMAIL = 'outfitters@riverscout.app'

interface SendEmailOptions {
  to: string | string[]
  subject: string
  html: string
  replyTo?: string
}

export async function sendEmail({ to, subject, html, replyTo }: SendEmailOptions): Promise<boolean> {
  const apiKey = process.env.RESEND_API_KEY
  if (!apiKey) {
    console.log('[EMAIL] No RESEND_API_KEY — would have sent:', { to, subject })
    return false
  }

  try {
    const res = await fetch(RESEND_API_URL, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from: FROM_ADDRESS,
        to: Array.isArray(to) ? to : [to],
        subject,
        html,
        ...(replyTo ? { reply_to: replyTo } : {}),
      }),
    })

    if (!res.ok) {
      const err = await res.text()
      console.error('[EMAIL] Resend error:', res.status, err)
      return false
    }

    console.log('[EMAIL] Sent:', subject, '→', to)
    return true
  } catch (err) {
    console.error('[EMAIL] Send failed:', err)
    return false
  }
}

// Pre-built email templates

export function flowAlertEmail(
  riverName: string,
  cfs: number,
  condition: string,
  optRange: string,
  sponsor?: { business_name: string; description: string | null; website: string | null; logo_url: string | null } | null,
): string {
  const conditionLabel = condition === 'optimal' ? 'Optimal conditions'
    : condition === 'high' ? 'High water'
    : condition === 'flood' ? 'Flood warning'
    : 'Conditions changed'

  const conditionColor = condition === 'optimal' ? '#1D9E75'
    : condition === 'high' ? '#BA7517'
    : condition === 'flood' ? '#A32D2D'
    : '#666660'

  const sponsorBlock = sponsor ? `
    <tr>
      <td style="padding: 24px 0 0;">
        <table width="100%" cellpadding="0" cellspacing="0" style="background: #f6f5f2; border-radius: 8px; border: 1px solid #e2e1d8;">
          <tr>
            <td style="padding: 20px;">
              ${sponsor.logo_url ? `<img src="${sponsor.logo_url}" alt="${sponsor.business_name}" style="max-height: 40px; max-width: 160px; margin-bottom: 12px; display: block;" />` : ''}
              <div style="font-family: Georgia, serif; font-size: 18px; font-weight: 700; color: #085041; margin-bottom: 4px;">
                ${sponsor.business_name}
              </div>
              ${sponsor.description ? `<div style="font-size: 14px; color: #666660; line-height: 1.5; margin-bottom: 12px;">${sponsor.description}</div>` : ''}
              ${sponsor.website ? `<a href="https://${sponsor.website}" target="_blank" style="display: inline-block; padding: 10px 24px; background: #1D9E75; color: #ffffff; text-decoration: none; border-radius: 6px; font-family: monospace; font-size: 13px; font-weight: 500;">Book Now</a>` : ''}
            </td>
          </tr>
        </table>
        <div style="font-family: monospace; font-size: 10px; color: #aaa99a; margin-top: 8px; text-align: center;">
          This message is sponsored by ${sponsor.business_name}, a RiverScout Sponsored Partner on ${riverName}.
        </div>
      </td>
    </tr>` : ''

  return `<!DOCTYPE html>
<html><head><meta charset="utf-8" /></head>
<body style="margin: 0; padding: 0; background: #ffffff; font-family: Georgia, serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="max-width: 520px; margin: 0 auto; padding: 20px;">
    <tr>
      <td style="padding-bottom: 16px; border-bottom: 1px solid #e2e1d8;">
        <span style="font-family: Georgia, serif; font-size: 20px; font-weight: 700; color: #085041; letter-spacing: -0.3px;">
          River<span style="color: #185FA5;">Scout</span>
        </span>
      </td>
    </tr>
    <tr>
      <td style="padding: 24px 0;">
        <div style="font-family: monospace; font-size: 10px; color: ${conditionColor}; text-transform: uppercase; letter-spacing: 1.5px; margin-bottom: 6px;">
          Flow Alert
        </div>
        <div style="font-family: Georgia, serif; font-size: 24px; font-weight: 700; color: #1a1a18; line-height: 1.3; margin-bottom: 8px;">
          ${riverName} is running at ${cfs.toLocaleString()} cfs
        </div>
        <div style="font-size: 16px; color: ${conditionColor}; font-weight: 600; margin-bottom: 4px;">
          ${conditionLabel}
        </div>
        <div style="font-family: monospace; font-size: 12px; color: #aaa99a; margin-top: 12px;">
          Optimal range: ${optRange} cfs · Live data from USGS
        </div>
      </td>
    </tr>
    ${sponsorBlock}
    <tr>
      <td style="padding: 24px 0 0; border-top: 1px solid #e2e1d8;">
        <div style="font-family: monospace; font-size: 10px; color: #aaa99a; text-align: center; line-height: 1.6;">
          You received this because you subscribed to flow alerts for ${riverName} on
          <a href="https://riverscout.app" style="color: #1D9E75;">RiverScout</a>.<br />
          <a href="https://riverscout.app/alerts" style="color: #aaa99a;">Manage your alerts</a>
        </div>
      </td>
    </tr>
  </table>
</body></html>`
}

export function improvementApprovedEmail(
  riverName: string,
  stateKey: string,
  field: string,
  currentValue: string,
  suggestedValue: string,
  reason: string,
  sourceUrl: string | null,
  userEmail: string | null,
): string {
  return `<!DOCTYPE html>
<html><head><meta charset="utf-8" /></head>
<body style="margin: 0; padding: 0; background: #ffffff; font-family: Georgia, serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="max-width: 520px; margin: 0 auto; padding: 20px;">
    <tr>
      <td style="padding-bottom: 16px; border-bottom: 1px solid #e2e1d8;">
        <span style="font-family: Georgia, serif; font-size: 20px; font-weight: 700; color: #085041;">
          River<span style="color: #185FA5;">Scout</span>
        </span>
      </td>
    </tr>
    <tr>
      <td style="padding: 24px 0;">
        <div style="font-family: monospace; font-size: 10px; color: #1D9E75; text-transform: uppercase; letter-spacing: 1.5px; margin-bottom: 6px;">
          Approved Improvement
        </div>
        <div style="font-family: Georgia, serif; font-size: 20px; font-weight: 700; color: #1a1a18; margin-bottom: 16px;">
          ${riverName} <span style="font-family: monospace; font-size: 12px; color: #aaa99a;">${stateKey.toUpperCase()}</span>
        </div>
        <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom: 16px;">
          <tr>
            <td style="font-family: monospace; font-size: 10px; color: #aaa99a; padding-bottom: 4px;">FIELD</td>
          </tr>
          <tr>
            <td style="font-family: monospace; font-size: 13px; color: #085041; padding-bottom: 12px; font-weight: 600;">${field}</td>
          </tr>
          <tr>
            <td style="font-family: monospace; font-size: 10px; color: #A32D2D; padding-bottom: 4px;">CURRENT</td>
          </tr>
          <tr>
            <td style="font-family: monospace; font-size: 13px; color: #1a1a18; padding: 8px; background: #FCEBEB; border-radius: 4px; margin-bottom: 8px;">${currentValue}</td>
          </tr>
          <tr><td style="height: 8px;"></td></tr>
          <tr>
            <td style="font-family: monospace; font-size: 10px; color: #1D9E75; padding-bottom: 4px;">SUGGESTED</td>
          </tr>
          <tr>
            <td style="font-family: monospace; font-size: 13px; color: #1a1a18; padding: 8px; background: #E1F5EE; border-radius: 4px;">${suggestedValue}</td>
          </tr>
        </table>
        <div style="font-size: 14px; color: #666660; line-height: 1.6; margin-bottom: 12px;">
          <strong>Reason:</strong> ${reason}
        </div>
        ${sourceUrl ? `<div style="font-family: monospace; font-size: 12px; margin-bottom: 12px;"><a href="${sourceUrl}" style="color: #1D9E75;">Source: ${sourceUrl}</a></div>` : ''}
        ${userEmail ? `<div style="font-family: monospace; font-size: 11px; color: #aaa99a;">Submitted by: ${userEmail}</div>` : ''}
      </td>
    </tr>
    <tr>
      <td style="padding: 16px 0 0; border-top: 1px solid #e2e1d8;">
        <div style="font-family: monospace; font-size: 10px; color: #aaa99a; text-align: center;">
          This improvement needs to be applied to the database.
        </div>
      </td>
    </tr>
  </table>
</body></html>`
}

export { ADMIN_EMAIL }
