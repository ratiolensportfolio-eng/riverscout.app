// Centralized email sending via Resend
// All outgoing emails from noreply@riverscout.app

const RESEND_API_URL = 'https://api.resend.com/emails'
const FROM_ADDRESS = 'RiverScout <noreply@riverscout.app>'
const ADMIN_EMAIL = 'Paddle.rivers.us@gmail.com'

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

export function stockingAlertEmail(
  riverName: string,
  stateName: string,
  stateSlug: string,
  riverSlug: string,
  species: string,
  quantity: number | null,
  sizeCategory: string | null,
  locationDescription: string | null,
  stockingAuthority: string | null,
  stockingDate: string,
  cfs: number | null,
  condition: string,
  optRange: string,
): string {
  const conditionColor = condition === 'optimal' ? '#1D9E75'
    : condition === 'high' ? '#BA7517'
    : condition === 'flood' ? '#A32D2D'
    : '#666660'
  const conditionLabel = condition === 'optimal' ? 'Optimal'
    : condition === 'high' ? 'High'
    : condition === 'flood' ? 'Flood'
    : condition === 'low' ? 'Low' : 'Unknown'

  const qtyLine = quantity
    ? `${quantity.toLocaleString()}${sizeCategory ? ` ${sizeCategory}` : ''}`
    : sizeCategory || 'Unknown quantity'

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
        <div style="font-family: monospace; font-size: 10px; color: #185FA5; text-transform: uppercase; letter-spacing: 1.5px; margin-bottom: 6px;">
          Stocking Alert
        </div>
        <div style="font-family: Georgia, serif; font-size: 22px; font-weight: 700; color: #1a1a18; line-height: 1.3; margin-bottom: 16px;">
          ${riverName} was just stocked
        </div>
        <table width="100%" cellpadding="0" cellspacing="0" style="background: #f6f5f2; border-radius: 8px; border: 1px solid #e2e1d8;">
          <tr>
            <td style="padding: 16px;">
              <div style="font-family: monospace; font-size: 12px; color: #1a1a18; margin-bottom: 6px;">
                <strong>Species:</strong> ${species}
              </div>
              <div style="font-family: monospace; font-size: 12px; color: #1a1a18; margin-bottom: 6px;">
                <strong>Quantity:</strong> ${qtyLine}
              </div>
              ${locationDescription ? `<div style="font-family: monospace; font-size: 12px; color: #1a1a18; margin-bottom: 6px;"><strong>Location:</strong> ${locationDescription}</div>` : ''}
              ${stockingAuthority ? `<div style="font-family: monospace; font-size: 12px; color: #1a1a18; margin-bottom: 6px;"><strong>Stocked by:</strong> ${stockingAuthority}</div>` : ''}
              <div style="font-family: monospace; font-size: 12px; color: #aaa99a;">
                <strong>Date:</strong> ${new Date(stockingDate + 'T00:00:00').toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
              </div>
            </td>
          </tr>
        </table>
      </td>
    </tr>
    ${cfs !== null ? `<tr>
      <td style="padding: 0 0 24px;">
        <div style="background: #ffffff; border: 1px solid #e2e1d8; border-radius: 8px; padding: 14px 16px; display: flex; align-items: center; gap: 12px;">
          <div style="font-family: monospace; font-size: 10px; color: #aaa99a; text-transform: uppercase; letter-spacing: 1px; margin-bottom: 4px;">Current Flow</div>
          <div>
            <span style="font-family: Georgia, serif; font-size: 22px; font-weight: 700; color: #1a1a18;">${cfs.toLocaleString()}</span>
            <span style="font-family: monospace; font-size: 12px; color: #aaa99a;"> cfs</span>
            <span style="font-family: monospace; font-size: 11px; color: ${conditionColor}; margin-left: 8px; font-weight: 600;">${conditionLabel}</span>
          </div>
          <div style="font-family: monospace; font-size: 11px; color: #aaa99a; margin-top: 2px;">Optimal: ${optRange} cfs</div>
        </div>
      </td>
    </tr>` : ''}
    <tr>
      <td style="padding: 16px 0; text-align: center;">
        <a href="https://riverscout.app/rivers/${stateSlug}/${riverSlug}" style="display: inline-block; padding: 12px 28px; background: #085041; color: #ffffff; font-family: monospace; font-size: 13px; font-weight: 500; text-decoration: none; border-radius: 6px; letter-spacing: .3px;">
          Plan Your Trip &rarr;
        </a>
      </td>
    </tr>
    <tr>
      <td style="padding: 16px 0 0; border-top: 1px solid #e2e1d8;">
        <div style="font-family: monospace; font-size: 10px; color: #aaa99a; text-align: center; line-height: 1.6;">
          You received this because you subscribed to stocking alerts for ${riverName} on
          <a href="https://riverscout.app" style="color: #1D9E75;">RiverScout</a>.<br />
          <a href="https://riverscout.app/alerts" style="color: #aaa99a;">Manage your alerts</a>
        </div>
      </td>
    </tr>
  </table>
</body></html>`
}

// ── Hatch Alert Email Templates ──────────────────────────────

// Template 1 — Temperature trigger alert
export function hatchTempTriggerEmail(
  riverName: string,
  stateSlug: string,
  riverSlug: string,
  hatchName: string,
  hatchDescription: string,
  waterTempF: number,
  triggerTempF: number,
  cfs: number | null,
  condition: string,
  peakWindow: string,
): string {
  const condColor = condition === 'optimal' ? '#1D9E75' : condition === 'high' ? '#BA7517' : condition === 'flood' ? '#A32D2D' : '#666660'
  const condLabel = condition === 'optimal' ? 'Optimal' : condition === 'high' ? 'High' : condition === 'flood' ? 'Flood' : condition === 'low' ? 'Low' : '—'
  const riverUrl = `https://riverscout.app/rivers/${stateSlug}/${riverSlug}`

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
        <div style="font-family: monospace; font-size: 10px; color: #185FA5; text-transform: uppercase; letter-spacing: 1.5px; margin-bottom: 8px;">
          Hatch Alert — Temperature Trigger
        </div>
        <div style="font-family: Georgia, serif; font-size: 22px; font-weight: 700; color: #1a1a18; line-height: 1.3; margin-bottom: 16px;">
          ${hatchName} conditions developing on ${riverName}
        </div>
        <p style="font-size: 15px; color: #1a1a18; line-height: 1.7; margin-bottom: 20px;">
          Water temperature on the ${riverName} just crossed the ${hatchName} trigger threshold.
        </p>

        <table width="100%" cellpadding="0" cellspacing="0" style="background: #f6f5f2; border-radius: 8px; border: 1px solid #e2e1d8; margin-bottom: 20px;">
          <tr><td style="padding: 16px;">
            <div style="font-family: monospace; font-size: 10px; color: #aaa99a; text-transform: uppercase; letter-spacing: 1px; margin-bottom: 10px;">Current Conditions</div>
            <div style="font-family: monospace; font-size: 13px; color: #1a1a18; margin-bottom: 6px;">
              Water temp: <strong>${waterTempF}°F</strong> <span style="color: #1D9E75;">&#10003;</span>
              <span style="color: #aaa99a;">(trigger: ${triggerTempF}°F)</span>
            </div>
            ${cfs !== null ? `<div style="font-family: monospace; font-size: 13px; color: #1a1a18; margin-bottom: 6px;">
              Flow: <strong>${cfs.toLocaleString()} cfs</strong> —
              <span style="color: ${condColor}; font-weight: 600;">${condLabel}</span>
            </div>` : ''}
          </td></tr>
        </table>

        <p style="font-size: 14px; color: #666660; line-height: 1.7; margin-bottom: 8px;">
          ${hatchDescription}
        </p>
        <p style="font-family: monospace; font-size: 12px; color: #aaa99a; margin-bottom: 20px;">
          Historical peak window: ${peakWindow}
        </p>

        <div style="text-align: center; margin: 24px 0;">
          <a href="${riverUrl}" style="display: inline-block; padding: 12px 28px; background: #085041; color: #ffffff; font-family: monospace; font-size: 13px; text-decoration: none; border-radius: 6px;">
            View ${riverName} Conditions &rarr;
          </a>
        </div>
      </td>
    </tr>
    <tr>
      <td style="padding: 16px 0 0; border-top: 1px solid #e2e1d8;">
        <div style="font-family: monospace; font-size: 10px; color: #aaa99a; text-align: center; line-height: 1.6;">
          You received this because you subscribed to ${hatchName} alerts for ${riverName} on
          <a href="https://riverscout.app" style="color: #1D9E75;">RiverScout</a>.<br />
          <a href="https://riverscout.app/alerts" style="color: #aaa99a;">Manage your alerts</a>
        </div>
      </td>
    </tr>
  </table>
</body></html>`
}

// Template 2 — Calendar window alert (sent N days before peak)
export function hatchCalendarEmail(
  riverName: string,
  stateSlug: string,
  riverSlug: string,
  hatchName: string,
  daysUntilPeak: number,
  waterTempF: number | null,
  triggerTempF: number | null,
  cfs: number | null,
  condition: string,
  peakWindow: string,
): string {
  const condColor = condition === 'optimal' ? '#1D9E75' : condition === 'high' ? '#BA7517' : condition === 'flood' ? '#A32D2D' : '#666660'
  const condLabel = condition === 'optimal' ? 'Optimal' : condition === 'high' ? 'High' : condition === 'flood' ? 'Flood' : condition === 'low' ? 'Low' : '—'
  const riverUrl = `https://riverscout.app/rivers/${stateSlug}/${riverSlug}`
  const tempStatus = triggerTempF && waterTempF
    ? (waterTempF >= triggerTempF
      ? `Water temp: <strong>${waterTempF}°F</strong> <span style="color: #1D9E75;">&#10003;</span> <span style="color: #aaa99a;">(trigger: ${triggerTempF}°F — met!)</span>`
      : `Water temp: <strong>${waterTempF}°F</strong> <span style="color: #aaa99a;">(need ${triggerTempF}°F — ${triggerTempF - waterTempF}° away)</span>`)
    : waterTempF ? `Water temp: <strong>${waterTempF}°F</strong>` : 'Water temp: not available'

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
        <div style="font-family: monospace; font-size: 10px; color: #185FA5; text-transform: uppercase; letter-spacing: 1.5px; margin-bottom: 8px;">
          Hatch Alert — ${daysUntilPeak} Days Away
        </div>
        <div style="font-family: Georgia, serif; font-size: 22px; font-weight: 700; color: #1a1a18; line-height: 1.3; margin-bottom: 16px;">
          ${hatchName} season starts in ${daysUntilPeak} days on ${riverName}
        </div>
        <p style="font-size: 15px; color: #1a1a18; line-height: 1.7; margin-bottom: 20px;">
          Here's where conditions stand today:
        </p>

        <table width="100%" cellpadding="0" cellspacing="0" style="background: #f6f5f2; border-radius: 8px; border: 1px solid #e2e1d8; margin-bottom: 20px;">
          <tr><td style="padding: 16px;">
            <div style="font-family: monospace; font-size: 13px; color: #1a1a18; margin-bottom: 6px;">
              ${tempStatus}
            </div>
            ${cfs !== null ? `<div style="font-family: monospace; font-size: 13px; color: #1a1a18; margin-bottom: 6px;">
              Flow: <strong>${cfs.toLocaleString()} cfs</strong> —
              <span style="color: ${condColor}; font-weight: 600;">${condLabel}</span>
            </div>` : ''}
            <div style="font-family: monospace; font-size: 12px; color: #aaa99a; margin-top: 8px;">
              Historical peak: ${peakWindow}
            </div>
          </td></tr>
        </table>

        <div style="text-align: center; margin: 24px 0;">
          <a href="${riverUrl}" style="display: inline-block; padding: 12px 28px; background: #085041; color: #ffffff; font-family: monospace; font-size: 13px; text-decoration: none; border-radius: 6px;">
            View Live ${riverName} Conditions &rarr;
          </a>
        </div>
      </td>
    </tr>
    <tr>
      <td style="padding: 16px 0 0; border-top: 1px solid #e2e1d8;">
        <div style="font-family: monospace; font-size: 10px; color: #aaa99a; text-align: center; line-height: 1.6;">
          You received this because you subscribed to ${hatchName} alerts for ${riverName} on
          <a href="https://riverscout.app" style="color: #1D9E75;">RiverScout</a>.<br />
          <a href="https://riverscout.app/alerts" style="color: #aaa99a;">Manage your alerts</a>
        </div>
      </td>
    </tr>
  </table>
</body></html>`
}

// Template 3 — Peak conditions alert
export function hatchPeakEmail(
  riverName: string,
  stateSlug: string,
  riverSlug: string,
  hatchName: string,
  waterTempF: number,
  cfs: number | null,
  condition: string,
  peakWindow: string,
  hatchNotes: string,
): string {
  const condColor = condition === 'optimal' ? '#1D9E75' : condition === 'high' ? '#BA7517' : '#666660'
  const condLabel = condition === 'optimal' ? 'Optimal' : condition === 'high' ? 'High' : condition === 'flood' ? 'Flood' : condition === 'low' ? 'Low' : '—'
  const riverUrl = `https://riverscout.app/rivers/${stateSlug}/${riverSlug}`

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
        <div style="font-family: monospace; font-size: 10px; color: #1D9E75; text-transform: uppercase; letter-spacing: 1.5px; margin-bottom: 8px;">
          Peak Conditions — Go Now
        </div>
        <div style="font-family: Georgia, serif; font-size: 24px; font-weight: 700; color: #1a1a18; line-height: 1.3; margin-bottom: 16px;">
          Peak ${hatchName} conditions on ${riverName}
        </div>

        <table width="100%" cellpadding="0" cellspacing="0" style="background: #E1F5EE; border-radius: 8px; border: 1px solid #9FE1CB; margin-bottom: 20px;">
          <tr><td style="padding: 16px;">
            <div style="font-family: monospace; font-size: 10px; color: #085041; text-transform: uppercase; letter-spacing: 1px; margin-bottom: 10px;">All Indicators Green</div>
            <div style="font-family: monospace; font-size: 13px; color: #1a1a18; margin-bottom: 6px;">
              Water temp: <strong>${waterTempF}°F</strong> <span style="color: #1D9E75;">&#10003;</span>
            </div>
            ${cfs !== null ? `<div style="font-family: monospace; font-size: 13px; color: #1a1a18; margin-bottom: 6px;">
              Flow: <strong>${cfs.toLocaleString()} cfs</strong>
              <span style="color: ${condColor}; font-weight: 600;">${condLabel}</span> <span style="color: #1D9E75;">&#10003;</span>
            </div>` : ''}
            <div style="font-family: monospace; font-size: 13px; color: #1a1a18;">
              Calendar: <strong>Peak window</strong> <span style="color: #1D9E75;">&#10003;</span>
              <span style="color: #aaa99a;">(${peakWindow})</span>
            </div>
          </td></tr>
        </table>

        ${hatchNotes ? `<p style="font-size: 15px; color: #1a1a18; line-height: 1.7; margin-bottom: 20px; font-style: italic;">
          ${hatchNotes}
        </p>` : ''}

        <div style="text-align: center; margin: 24px 0;">
          <a href="${riverUrl}" style="display: inline-block; padding: 14px 32px; background: #1D9E75; color: #ffffff; font-family: monospace; font-size: 14px; font-weight: 600; text-decoration: none; border-radius: 6px; letter-spacing: .5px;">
            View Current Conditions &rarr;
          </a>
        </div>
      </td>
    </tr>
    <tr>
      <td style="padding: 16px 0 0; border-top: 1px solid #e2e1d8;">
        <div style="font-family: monospace; font-size: 10px; color: #aaa99a; text-align: center; line-height: 1.6;">
          You received this because you subscribed to ${hatchName} alerts for ${riverName} on
          <a href="https://riverscout.app" style="color: #1D9E75;">RiverScout</a>.<br />
          <a href="https://riverscout.app/alerts" style="color: #aaa99a;">Manage your alerts</a>
        </div>
      </td>
    </tr>
  </table>
</body></html>`
}

// ── Hazard Alert Email ───────────────────────────────────────────
// Safety-critical hazards trigger a blast to everyone currently subscribed
// to flow alerts for the same river. Intentionally not gated behind Pro —
// withholding life-threatening safety information from the free tier is
// the wrong call, and "cold water safety alerts" are already marketed as
// free.
export function hazardAlertEmail(
  riverName: string,
  stateSlug: string,
  riverSlug: string,
  hazardType: string,
  severity: 'info' | 'warning' | 'critical',
  title: string,
  description: string,
  locationDescription: string | null,
  reporterName: string | null,
): string {
  const severityColor = severity === 'critical' ? '#A32D2D'
    : severity === 'warning' ? '#BA7517'
    : '#185FA5'
  const severityLabel = severity === 'critical' ? 'Critical Hazard'
    : severity === 'warning' ? 'Hazard Warning'
    : 'Hazard Notice'
  const riverUrl = `https://riverscout.app/rivers/${stateSlug}/${riverSlug}`

  return `<!DOCTYPE html>
<html><head><meta charset="utf-8" /></head>
<body style="margin: 0; padding: 0; background: #ffffff; font-family: Georgia, serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="max-width: 520px; margin: 0 auto; padding: 20px;">
    <tr>
      <td style="padding-bottom: 16px; border-bottom: 2px solid ${severityColor};">
        <span style="font-family: Georgia, serif; font-size: 20px; font-weight: 700; color: #085041; letter-spacing: -0.3px;">
          River<span style="color: #185FA5;">Scout</span>
        </span>
      </td>
    </tr>
    <tr>
      <td style="padding: 24px 0;">
        <div style="font-family: monospace; font-size: 11px; color: ${severityColor}; text-transform: uppercase; letter-spacing: 2px; margin-bottom: 8px; font-weight: 700;">
          &#9888; ${severityLabel}
        </div>
        <div style="font-family: Georgia, serif; font-size: 22px; font-weight: 700; color: #1a1a18; line-height: 1.3; margin-bottom: 6px;">
          ${title}
        </div>
        <div style="font-family: monospace; font-size: 13px; color: #666660; margin-bottom: 16px;">
          ${riverName} &middot; ${hazardType}
        </div>

        <table width="100%" cellpadding="0" cellspacing="0" style="background: ${severity === 'critical' ? '#FCEBEB' : '#FBF3E8'}; border-radius: 8px; border: 1px solid ${severity === 'critical' ? '#F1C4C4' : '#EDD9B5'}; margin-bottom: 20px;">
          <tr><td style="padding: 16px;">
            <div style="font-size: 14px; color: #1a1a18; line-height: 1.6; margin-bottom: ${locationDescription ? '12px' : '0'};">
              ${description}
            </div>
            ${locationDescription ? `<div style="font-family: monospace; font-size: 12px; color: #666660; padding-top: 10px; border-top: 1px solid ${severity === 'critical' ? '#F1C4C4' : '#EDD9B5'};">
              <strong>Location:</strong> ${locationDescription}
            </div>` : ''}
          </td></tr>
        </table>

        ${reporterName ? `<div style="font-family: monospace; font-size: 11px; color: #aaa99a; margin-bottom: 16px;">
          Reported by ${reporterName}
        </div>` : ''}

        <p style="font-size: 13px; color: #666660; line-height: 1.6; margin: 0 0 20px;">
          This report came from the paddling community. Use your own judgment before getting on the water, and scout anything you're unsure about.
        </p>

        <div style="text-align: center; margin: 24px 0;">
          <a href="${riverUrl}" style="display: inline-block; padding: 12px 28px; background: ${severityColor}; color: #ffffff; font-family: monospace; font-size: 13px; font-weight: 500; text-decoration: none; border-radius: 6px; letter-spacing: .3px;">
            View ${riverName} &rarr;
          </a>
        </div>
      </td>
    </tr>
    <tr>
      <td style="padding: 16px 0 0; border-top: 1px solid #e2e1d8;">
        <div style="font-family: monospace; font-size: 10px; color: #aaa99a; text-align: center; line-height: 1.6;">
          You received this because you subscribed to alerts for ${riverName} on
          <a href="https://riverscout.app" style="color: #1D9E75;">RiverScout</a>.<br />
          Hazard alerts are sent to all subscribers regardless of Pro status.<br />
          <a href="https://riverscout.app/alerts" style="color: #aaa99a;">Manage your alerts</a>
        </div>
      </td>
    </tr>
  </table>
</body></html>`
}

export { ADMIN_EMAIL }
