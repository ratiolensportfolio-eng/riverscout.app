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
  // Rate-of-change context. All optional so existing call sites that
  // don't have the data still compile and just skip the trend line.
  gaugeHeightFt?: number | null,
  changePerHour?: number | null,
  rateLabel?: string | null,
  // Water temperature in Celsius. When supplied AND the water is
  // ≤60°F, a tier-coded cold-water safety block renders below the
  // condition line. Optional — call sites without temp data omit.
  tempC?: number | null,
): string {
  const conditionLabel = condition === 'optimal' ? 'Optimal conditions'
    : condition === 'high' ? 'High water'
    : condition === 'flood' ? 'Flood warning'
    : 'Conditions changed'

  const conditionColor = condition === 'optimal' ? '#1D9E75'
    : condition === 'high' ? '#BA7517'
    : condition === 'flood' ? '#A32D2D'
    : '#666660'

  // Trend line — only render when we actually have a meaningful rate.
  // Stable rivers (|rate| < 25 cfs/hr) and "Rate unknown" are skipped
  // to avoid noise. Color matches the in-app palette so users get
  // consistent visual cues.
  let trendLineHtml = ''
  if (
    typeof changePerHour === 'number' &&
    Math.abs(changePerHour) >= 25 &&
    rateLabel &&
    rateLabel !== 'Rate unknown' &&
    rateLabel !== 'Stable'
  ) {
    const isRising = changePerHour > 0
    const absRate = Math.abs(changePerHour)
    const arrow = isRising ? '&#8593;' : '&#8595;'
    let rateColor: string
    if (isRising) {
      if (absRate > 300) rateColor = '#A32D2D'
      else if (absRate > 100) rateColor = '#BA7517'
      else rateColor = '#3CA86E'
    } else {
      if (absRate > 300) rateColor = '#6E4BB4'
      else if (absRate > 100) rateColor = '#0C447C'
      else rateColor = '#5B8DBF'
    }
    trendLineHtml = `
        <div style="font-family: monospace; font-size: 13px; color: ${rateColor}; font-weight: 600; margin-top: 8px;">
          ${arrow} ${rateLabel}
        </div>`
  }

  // Headline number line: "1,250 cfs / 2.30 ft" when height is available.
  const headlineValue = typeof gaugeHeightFt === 'number'
    ? `${cfs.toLocaleString()} cfs / ${gaugeHeightFt.toFixed(2)} ft`
    : `${cfs.toLocaleString()} cfs`

  // Cold-water safety block. Mirrors the tiered messages used in
  // app/rivers/[state]/[slug]/page.tsx and the dashboard so the
  // language is consistent across the product.
  let coldWaterHtml = ''
  if (typeof tempC === 'number') {
    const f = Math.round(tempC * 9 / 5 + 32)
    let coldMsg: string | null = null
    let bg = '#f5e9e9', border = '#A32D2D', color = '#A32D2D'
    if (f <= 40) {
      coldMsg = 'Dangerous cold water — high hypothermia risk'
    } else if (f <= 50) {
      coldMsg = 'Cold water immersion risk — review cold water safety before launching'
      bg = '#fbf1e1'; border = '#BA7517'; color = '#7A4D0E'
    } else if (f <= 60) {
      coldMsg = 'Cold water — dress for immersion, not air temperature'
      bg = '#fbf6e1'; border = '#BA9517'; color = '#7A6010'
    }
    if (coldMsg) {
      coldWaterHtml = `
        <div style="margin-top: 14px; padding: 10px 14px; background: ${bg}; border-left: 3px solid ${border}; border-radius: 4px;">
          <div style="font-family: monospace; font-size: 11px; color: ${color}; font-weight: 600; margin-bottom: 2px;">
            Water temp: ${f}°F
          </div>
          <div style="font-family: monospace; font-size: 12px; color: ${color}; line-height: 1.5;">
            ${coldMsg}
          </div>
        </div>`
    }
  }

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
          ${riverName} is running at ${headlineValue}
        </div>
        <div style="font-size: 16px; color: ${conditionColor}; font-weight: 600; margin-bottom: 4px;">
          ${conditionLabel}
        </div>${trendLineHtml}${coldWaterHtml}
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

// ── Weekly River Conditions Digest ──────────────────────────────
// The most important user-facing email in RiverScout. Sent every
// Thursday at 8am Eastern to users who opted in. Designed to be
// scannable in 30 seconds: hazards first, then per-river cards with
// flow + weekend weather + a "best day" call-out, then a single
// best-river-this-weekend pick at the bottom.
//
// Subject line is dynamic — picked by digestSubject() based on what's
// actually happening on the user's rivers.

import type {
  DigestData, DigestRiver, DigestWeekendDay, PaddlingCondition,
} from '@/lib/digest'

// Pure helpers used by both subject + body. Kept module-private — the
// public surface is digestSubject() and digestEmail().

const PADDLING_LABEL: Record<PaddlingCondition, string> = {
  excellent: 'Excellent',
  good: 'Good',
  fair: 'Fair',
  poor: 'Poor',
  dangerous: 'Dangerous',
}

const PADDLING_ICON: Record<PaddlingCondition, string> = {
  excellent: '\u2713',  // check
  good: '\u2713',
  fair: '\u26A1',       // bolt
  poor: '\u26A0',       // warning
  dangerous: '\u26A0',
}

const PADDLING_COLOR: Record<PaddlingCondition, string> = {
  excellent: '#1D9E75',  // green
  good: '#3CA86E',       // light green
  fair: '#BA7517',       // amber
  poor: '#A32D2D',       // red
  dangerous: '#A32D2D',
}

const CONDITION_LABEL: Record<string, string> = {
  optimal: 'OPTIMAL',
  low: 'LOW',
  high: 'HIGH',
  flood: 'FLOOD',
  loading: '—',
}

const CONDITION_DOT: Record<string, string> = {
  optimal: '\uD83D\uDFE2',  // green circle
  low: '\uD83D\uDFE1',      // yellow circle
  high: '\uD83D\uDFE3',     // purple circle (high water)
  flood: '\uD83D\uDD34',    // red circle
  loading: '\u26AA',         // white circle
}

// Subject-line picker. Walks through priority cases in order and
// returns the first one that fires.
export function digestSubject(rivers: DigestRiver[]): string {
  const optimalCount = rivers.filter(r => r.condition === 'optimal').length
  const bestRiver = rivers.find(r => r.condition === 'optimal')
  const hasHazard = rivers.some(r => r.activeHazards.length > 0)
  const hasStocking = rivers.some(r => r.upcomingStocking && !r.upcomingStocking.isScheduled)

  if (hasHazard) {
    return `\u26A0 Hazard alert on your rivers \u2014 weekend conditions`
  }
  if (optimalCount >= 3) {
    return `\uD83D\uDFE2 ${optimalCount} of your rivers are optimal this weekend`
  }
  if (optimalCount === 1 && bestRiver) {
    return `\uD83D\uDFE2 ${bestRiver.name} is running optimal \u2014 your weekend report`
  }
  if (hasStocking) {
    return `\uD83C\uDFA3 Recent stocking on your rivers \u2014 conditions report`
  }
  return `Your rivers this weekend \u2014 RiverScout`
}

function renderHazardBlock(rivers: DigestRiver[]): string {
  const allHazards = rivers.flatMap(r =>
    r.activeHazards.map(h => ({ river: r, hazard: h })),
  )
  if (allHazards.length === 0) return ''

  // Sort: critical first, then warning, then info. Unique by river
  // already implied by per-river dedup further upstream.
  const RANK: Record<string, number> = { critical: 0, warning: 1, info: 2 }
  allHazards.sort((a, b) => RANK[a.hazard.severity] - RANK[b.hazard.severity])

  const cards = allHazards.slice(0, 5).map(({ river, hazard }) => {
    const sevColor = hazard.severity === 'critical' ? '#A32D2D'
      : hazard.severity === 'warning' ? '#BA7517' : '#185FA5'
    const sevLabel = hazard.severity === 'critical' ? 'CRITICAL HAZARD'
      : hazard.severity === 'warning' ? 'HAZARD WARNING' : 'HAZARD NOTICE'
    return `
    <table width="100%" cellpadding="0" cellspacing="0" style="background: #FCEBEB; border: 1px solid ${sevColor}; border-left: 4px solid ${sevColor}; border-radius: 8px; margin-bottom: 12px;">
      <tr><td style="padding: 14px 16px;">
        <div style="font-family: monospace; font-size: 10px; font-weight: 700; color: ${sevColor}; text-transform: uppercase; letter-spacing: 1.5px; margin-bottom: 4px;">
          \u26A0 ${sevLabel} \u2014 ${escapeHtml(river.name)}
        </div>
        <div style="font-family: Georgia, serif; font-size: 14px; font-weight: 600; color: #1a1a18; line-height: 1.4; margin-bottom: 4px;">
          ${escapeHtml(hazard.title)}
        </div>
        <div style="font-size: 12px; color: #666660; line-height: 1.55;">
          ${escapeHtml(hazard.description)}
        </div>
        ${hazard.locationDescription ? `<div style="font-family: monospace; font-size: 11px; color: #666660; margin-top: 6px;">\uD83D\uDCCD ${escapeHtml(hazard.locationDescription)}</div>` : ''}
        <div style="margin-top: 10px;">
          <a href="${river.url}" style="font-family: monospace; font-size: 11px; color: ${sevColor}; text-decoration: underline;">
            View hazard \u2192
          </a>
        </div>
      </td></tr>
    </table>`
  }).join('')

  return `
    <tr><td style="padding: 0 0 18px;">
      <div style="font-family: monospace; font-size: 10px; color: #A32D2D; text-transform: uppercase; letter-spacing: 1.5px; margin-bottom: 10px; font-weight: 700;">
        Active Hazards on Your Rivers
      </div>
      ${cards}
    </td></tr>
  `
}

function renderWeekendStrip(days: DigestWeekendDay[], bestDayIdx: number): string {
  if (days.length === 0) {
    return `<div style="font-family: monospace; font-size: 11px; color: #aaa99a; padding: 6px 0;">Weekend forecast unavailable</div>`
  }
  return days.map((d, i) => {
    const color = PADDLING_COLOR[d.paddlingCondition]
    const label = PADDLING_LABEL[d.paddlingCondition]
    const icon = PADDLING_ICON[d.paddlingCondition]
    const isBest = i === bestDayIdx && d.paddlingCondition === 'excellent'
    return `
      <tr>
        <td style="padding: 5px 0; font-family: monospace; font-size: 12px; color: #1a1a18; vertical-align: top;">
          <strong style="display: inline-block; width: 32px;">${d.label}</strong>
          <span style="display: inline-block; width: 48px; color: #666660;">${d.highF !== null ? `${d.highF}\u00B0F` : '\u2014'}</span>
          <span style="display: inline-block; width: 110px; color: #666660;">${escapeHtml(d.shortForecast)}</span>
          <span style="color: ${color}; font-weight: 600;">${icon} ${label}</span>
          ${isBest ? `<span style="color: #1D9E75; font-weight: 600; margin-left: 8px;">\u2190 Best day</span>` : ''}
        </td>
      </tr>
    `
  }).join('')
}

function renderRiverCard(river: DigestRiver): string {
  // Find the single "best" weekend day for the "← Best day" callout.
  // Only set a best day when one day is strictly better than every
  // other day — if Friday and Saturday are both "excellent" we don't
  // pick a winner because the user can paddle either.
  const RANK: Record<PaddlingCondition, number> = {
    excellent: 0, good: 1, fair: 2, poor: 3, dangerous: 4,
  }
  let bestDayIdx = -1
  if (river.weekendForecast.length > 0) {
    const minRank = Math.min(...river.weekendForecast.map(d => RANK[d.paddlingCondition]))
    const tiedAtMin = river.weekendForecast.filter(d => RANK[d.paddlingCondition] === minRank)
    if (tiedAtMin.length === 1) {
      bestDayIdx = river.weekendForecast.findIndex(d => RANK[d.paddlingCondition] === minRank)
    }
  }

  const flowLine = river.currentCfs !== null
    ? `${river.currentCfs.toLocaleString()} cfs${river.gaugeHeightFt !== null ? ` / ${river.gaugeHeightFt.toFixed(2)} ft` : ''}`
    : 'Flow unavailable'

  const condDot = CONDITION_DOT[river.condition] || '\u26AA'
  const condLabel = CONDITION_LABEL[river.condition] || river.condition.toUpperCase()
  const condColor = river.condition === 'optimal' ? '#1D9E75'
    : river.condition === 'high' ? '#6E4BB4'
    : river.condition === 'flood' ? '#A32D2D'
    : river.condition === 'low' ? '#BA7517' : '#666660'

  const paddlingColor = PADDLING_COLOR[river.paddlingCondition]
  const paddlingLabel = PADDLING_LABEL[river.paddlingCondition]
  const paddlingIcon = PADDLING_ICON[river.paddlingCondition]

  // Hatch line — only when we have something to say. Plain divs (not
  // table rows) because this block is rendered inside an existing
  // <td>, and nesting <tr> inside <td> is invalid HTML even though
  // many email clients tolerate it.
  const hatchBlock = river.activeHatch && river.activeHatch.status !== 'fading' && river.activeHatch.status !== 'off_season' ? `
    <div style="padding: 10px 0 0;">
      <div style="font-family: monospace; font-size: 12px; color: #185FA5; line-height: 1.55;">
        \uD83C\uDFA3 <strong>${escapeHtml(river.activeHatch.hatchName)}</strong> ${
          river.activeHatch.status === 'peak' || river.activeHatch.status === 'active'
            ? '\u2014 active right now'
            : river.activeHatch.daysUntilPeak !== null
              ? `\u2014 ${river.activeHatch.daysUntilPeak} day${river.activeHatch.daysUntilPeak === 1 ? '' : 's'} until peak`
              : '\u2014 approaching'
        }
      </div>
      ${river.activeHatch.waterTempF !== null && river.activeHatch.triggerTempF !== null ? `
        <div style="font-family: monospace; font-size: 11px; color: #666660; margin-top: 2px;">
          Water temp ${river.activeHatch.waterTempF}\u00B0F, trigger at ${river.activeHatch.triggerTempF}\u00B0F
        </div>` : ''}
    </div>` : ''

  // Stocking line — only when we have a recent or scheduled event.
  // Plain divs, same reason as the hatch block above.
  const stockingBlock = river.upcomingStocking ? `
    <div style="padding: 8px 0 0;">
      <div style="font-family: monospace; font-size: 12px; color: #185FA5; line-height: 1.55;">
        \uD83D\uDC1F <strong>${river.upcomingStocking.isScheduled ? 'Scheduled stocking' : 'Stocked recently'}:</strong>
        ${river.upcomingStocking.quantity ? `${river.upcomingStocking.quantity.toLocaleString()} ` : ''}${escapeHtml(river.upcomingStocking.species)}${river.upcomingStocking.sizeCategory ? ` (${escapeHtml(river.upcomingStocking.sizeCategory)})` : ''}
      </div>
      ${river.upcomingStocking.stockingAuthority || river.upcomingStocking.locationDescription ? `
        <div style="font-family: monospace; font-size: 11px; color: #666660; margin-top: 2px;">
          ${river.upcomingStocking.stockingAuthority ? `Stocked by ${escapeHtml(river.upcomingStocking.stockingAuthority)}` : ''}
          ${river.upcomingStocking.stockingAuthority && river.upcomingStocking.locationDescription ? ' \u00B7 ' : ''}
          ${river.upcomingStocking.locationDescription ? `Near ${escapeHtml(river.upcomingStocking.locationDescription)}` : ''}
        </div>` : ''}
    </div>` : ''

  return `
  <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom: 18px; border: 1px solid #e2e1d8; border-radius: 8px; overflow: hidden;">
    <tr><td style="padding: 16px 18px 14px;">
      <div style="font-family: Georgia, serif; font-size: 17px; font-weight: 700; color: #042C53; letter-spacing: -0.2px; margin-bottom: 2px;">
        ${escapeHtml(river.name)}
      </div>
      <div style="font-family: monospace; font-size: 10px; color: #aaa99a; text-transform: uppercase; letter-spacing: .8px; margin-bottom: 12px;">
        ${escapeHtml(river.stateName)}
      </div>

      <div style="font-family: monospace; font-size: 13px; color: #1a1a18; margin-bottom: 4px;">
        <strong style="font-size: 16px; color: #0C447C;">${flowLine}</strong>
        <span style="margin-left: 8px;">${condDot} <span style="color: ${condColor}; font-weight: 600;">${condLabel}</span></span>
        ${river.rateLabel && river.rateLabel !== 'Stable' && river.rateLabel !== 'Rate unknown'
          ? `<span style="color: #666660; margin-left: 8px;">${escapeHtml(river.rateLabel)}</span>`
          : ''}
      </div>

      <div style="font-family: monospace; font-size: 12px; color: #666660; margin-bottom: 6px;">
        ${river.waterTempF !== null ? `Water: ${river.waterTempF}\u00B0F` : 'Water temp unavailable'} \u00B7 Weather: ${escapeHtml(river.weatherSummary)}
      </div>
      ${river.waterTempF !== null && river.waterTempF <= 60 ? (() => {
        const f = river.waterTempF as number
        const msg = f <= 40 ? 'Dangerous cold water — high hypothermia risk'
                  : f <= 50 ? 'Cold water immersion risk — review cold water safety before launching'
                  :           'Cold water — dress for immersion, not air temperature'
        const color = f <= 40 ? '#A32D2D' : f <= 50 ? '#7A4D0E' : '#7A6010'
        const bg    = f <= 40 ? '#f5e9e9' : f <= 50 ? '#fbf1e1' : '#fbf6e1'
        return `
      <div style="margin: 4px 0 10px; padding: 6px 10px; background: ${bg}; border-left: 3px solid ${color}; border-radius: 4px; font-family: monospace; font-size: 11px; color: ${color}; line-height: 1.45;">
        ${msg}
      </div>`
      })() : ''}

      <div style="font-family: monospace; font-size: 12px; color: ${paddlingColor}; font-weight: 600; margin-bottom: 12px;">
        Paddling: ${paddlingIcon} ${paddlingLabel}${
          river.paddlingCondition === 'excellent' ? ' conditions'
          : river.paddlingCondition === 'dangerous' ? ' \u2014 do not paddle'
          : river.paddlingCondition === 'poor' ? ' \u2014 not recommended'
          : ''
        }
      </div>

      ${river.weekendForecast.length > 0 ? `
      <div style="font-family: monospace; font-size: 10px; color: #aaa99a; text-transform: uppercase; letter-spacing: .8px; margin-bottom: 6px;">
        This weekend
      </div>
      <table cellpadding="0" cellspacing="0" style="margin-bottom: 8px;">
        ${renderWeekendStrip(river.weekendForecast, bestDayIdx)}
      </table>` : ''}

      ${hatchBlock}
      ${stockingBlock}

      <div style="margin-top: 14px;">
        <a href="${river.url}" style="display: inline-block; padding: 8px 18px; font-family: monospace; font-size: 11px; font-weight: 500; background: #085041; color: #ffffff; text-decoration: none; border-radius: 6px; letter-spacing: .3px;">
          View ${escapeHtml(river.name)} \u2192
        </a>
      </div>
    </td></tr>
  </table>
  `
}

function bestRiverCallout(best: DigestRiver | null): string {
  if (!best) return ''
  // Build the reason line from the most distinguishing facts about
  // this river. Prioritize: excellent paddling > active hatch >
  // recent stocking > optimal flows.
  const reasons: string[] = []
  if (best.paddlingCondition === 'excellent') {
    const excellentDays = best.weekendForecast.filter(d => d.paddlingCondition === 'excellent').length
    if (excellentDays >= 2) reasons.push(`${excellentDays} excellent days this weekend`)
    else if (excellentDays === 1) reasons.push('excellent conditions one day this weekend')
    else reasons.push('excellent conditions')
  }
  if (best.upcomingStocking && !best.upcomingStocking.isScheduled) {
    reasons.push('recent stocking')
  }
  if (best.activeHatch && (best.activeHatch.status === 'peak' || best.activeHatch.status === 'active')) {
    reasons.push(`${best.activeHatch.hatchName.toLowerCase()} hatch active`)
  }
  if (best.condition === 'optimal') reasons.push('optimal flows')

  const reasonText = reasons.length > 0
    ? reasons.join(', ') + '.'
    : 'Best of your saved rivers this weekend.'

  return `
    <tr><td style="padding: 8px 0 18px;">
      <table width="100%" cellpadding="0" cellspacing="0" style="background: linear-gradient(135deg, #E1F5EE, #E6F1FB); border-radius: 8px; border: 1px solid #9FE1CB;">
        <tr><td style="padding: 18px 20px;">
          <div style="font-family: monospace; font-size: 10px; color: #1D9E75; text-transform: uppercase; letter-spacing: 1.5px; font-weight: 700; margin-bottom: 6px;">
            \uD83C\uDF1F Best River This Weekend
          </div>
          <div style="font-family: Georgia, serif; font-size: 18px; font-weight: 700; color: #085041; margin-bottom: 4px;">
            ${escapeHtml(best.name)}
          </div>
          <div style="font-size: 13px; color: #1a1a18; line-height: 1.55;">
            ${escapeHtml(reasonText.charAt(0).toUpperCase() + reasonText.slice(1))}
          </div>
          <div style="margin-top: 10px;">
            <a href="${best.url}" style="font-family: monospace; font-size: 11px; color: #085041; text-decoration: underline; font-weight: 600;">
              View ${escapeHtml(best.name)} \u2192
            </a>
          </div>
        </td></tr>
      </table>
    </td></tr>
  `
}

// Minimal HTML escape — Resend doesn't sanitize HTML in templates so
// we have to handle it ourselves. We don't worry about &amp;-style
// double-escaping because none of the input fields contain pre-escaped
// content.
function escapeHtml(s: string | null | undefined): string {
  if (s == null) return ''
  return String(s)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;')
}

/**
 * Render the full digest email body. The unsubscribeUrl is required —
 * the email cannot ship without a working one-click unsub link.
 */
export function digestEmail(data: DigestData, unsubscribeUrl: string): string {
  const { user, rivers, bestRiverThisWeekend } = data
  const greeting = `Good morning ${user.displayName} \u2014 here's your Thursday river report.`
  const hazardBlock = renderHazardBlock(rivers)
  const riverCards = rivers.map(renderRiverCard).join('')
  const bestBlock = bestRiverCallout(bestRiverThisWeekend)
  const accountUrl = 'https://riverscout.app/account'
  const allRiversUrl = 'https://riverscout.app/account'

  return `<!DOCTYPE html>
<html><head><meta charset="utf-8" /><meta name="viewport" content="width=device-width, initial-scale=1" /></head>
<body style="margin: 0; padding: 0; background: #f6f5f2; font-family: Georgia, serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background: #f6f5f2; padding: 24px 0;">
    <tr><td align="center">
      <table width="100%" cellpadding="0" cellspacing="0" style="max-width: 580px; background: #ffffff; padding: 28px 28px 22px; border-radius: 12px; border: 1px solid #e2e1d8;">
        <tr><td style="padding-bottom: 18px; border-bottom: 1px solid #e2e1d8;">
          <span style="font-family: Georgia, serif; font-size: 22px; font-weight: 700; color: #085041; letter-spacing: -0.4px;">
            River<span style="color: #185FA5;">Scout</span>
          </span>
        </td></tr>

        <tr><td style="padding: 22px 0 10px;">
          <div style="font-family: Georgia, serif; font-size: 15px; color: #1a1a18; line-height: 1.55;">
            ${escapeHtml(greeting)}
          </div>
        </td></tr>

        ${hazardBlock}

        <tr><td>
          <div style="font-family: monospace; font-size: 10px; color: #aaa99a; text-transform: uppercase; letter-spacing: 1.5px; font-weight: 700; margin: 14px 0 12px; padding-top: 14px; border-top: 1px solid #e2e1d8;">
            Your Rivers This Weekend
          </div>
          ${riverCards}
        </td></tr>

        ${bestBlock}

        <tr><td style="padding: 8px 0 22px; text-align: center;">
          <a href="${accountUrl}" style="display: inline-block; padding: 11px 26px; font-family: monospace; font-size: 12px; font-weight: 500; background: #085041; color: #ffffff; text-decoration: none; border-radius: 6px; letter-spacing: .3px;">
            Check all your rivers \u2192
          </a>
        </td></tr>

        <tr><td style="padding-top: 18px; border-top: 1px solid #e2e1d8;">
          <div style="font-family: monospace; font-size: 10px; color: #aaa99a; text-align: center; line-height: 1.7;">
            You're receiving this because you saved rivers on RiverScout.<br />
            <a href="${accountUrl}" style="color: #1D9E75;">Manage digest preferences</a>
            \u00B7
            <a href="${unsubscribeUrl}" style="color: #aaa99a;">Unsubscribe from digest</a><br />
            <a href="https://riverscout.app" style="color: #aaa99a;">riverscout.app</a> \u00B7 noreply@riverscout.app
          </div>
        </td></tr>
      </table>
    </td></tr>
  </table>
</body></html>`
}

// ── Permit Verification Reminder ─────────────────────────────────
// Annual reminder that goes to the admin every January 15. Lists all
// river_permits rows whose last_verified_year is older than the
// current year, so the project owner has a punch list before the
// spring paddling season starts. Plain admin-ops email — not styled
// like the user-facing newsletters.
export function permitVerificationReminderEmail(
  rows: Array<{
    river_name: string
    state_key: string
    permit_name: string
    managing_agency: string
    last_verified_year: number | null
    info_url: string | null
  }>,
  currentYear: number,
): string {
  const list = rows.map(r => `
    <tr>
      <td style="padding: 8px 12px; border-bottom: 1px solid #e2e1d8; vertical-align: top;">
        <div style="font-family: Georgia, serif; font-size: 14px; font-weight: 700; color: #1a1a18;">
          ${r.river_name} <span style="font-family: monospace; font-size: 11px; color: #aaa99a;">${(r.state_key || '').toUpperCase()}</span>
        </div>
        <div style="font-family: monospace; font-size: 11px; color: #666660; margin-top: 2px;">
          ${r.permit_name} &middot; ${r.managing_agency}
        </div>
        <div style="font-family: monospace; font-size: 10px; color: #aaa99a; margin-top: 4px;">
          Last verified: ${r.last_verified_year ?? 'never'}
          ${r.info_url ? ` &middot; <a href="${r.info_url}" style="color: #1D9E75;">${r.info_url}</a>` : ''}
        </div>
      </td>
    </tr>
  `).join('')

  const empty = `
    <tr>
      <td style="padding: 16px 12px; font-family: monospace; font-size: 12px; color: #666660; text-align: center;">
        All permits are already verified for ${currentYear}. Nothing to do.
      </td>
    </tr>
  `

  return `<!DOCTYPE html>
<html><head><meta charset="utf-8" /></head>
<body style="margin: 0; padding: 0; background: #ffffff; font-family: Georgia, serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="max-width: 640px; margin: 0 auto; padding: 20px;">
    <tr>
      <td style="padding-bottom: 16px; border-bottom: 1px solid #e2e1d8;">
        <span style="font-family: Georgia, serif; font-size: 20px; font-weight: 700; color: #085041;">
          River<span style="color: #185FA5;">Scout</span>
          <span style="font-family: monospace; font-size: 11px; color: #BA7517; margin-left: 6px;">ADMIN</span>
        </span>
      </td>
    </tr>
    <tr>
      <td style="padding: 24px 0;">
        <div style="font-family: monospace; font-size: 10px; color: #BA7517; text-transform: uppercase; letter-spacing: 1.5px; margin-bottom: 6px;">
          Annual Permit Verification Reminder
        </div>
        <div style="font-family: Georgia, serif; font-size: 22px; font-weight: 700; color: #1a1a18; line-height: 1.3; margin-bottom: 16px;">
          ${rows.length} river permit${rows.length === 1 ? '' : 's'} need verification for ${currentYear}
        </div>
        <p style="font-size: 14px; color: #1a1a18; line-height: 1.6; margin-bottom: 20px;">
          Permit rules change annually. Please verify and update the rows below before the spring paddling season starts. Each row links to the agency landing page.
        </p>
      </td>
    </tr>
    <tr>
      <td>
        <table width="100%" cellpadding="0" cellspacing="0" style="border: 1px solid #e2e1d8; border-radius: 8px; overflow: hidden;">
          ${rows.length > 0 ? list : empty}
        </table>
      </td>
    </tr>
    <tr>
      <td style="padding: 20px 0 0;">
        <div style="text-align: center;">
          <a href="https://riverscout.app/admin/permits" style="display: inline-block; padding: 12px 28px; background: #085041; color: #ffffff; font-family: monospace; font-size: 13px; text-decoration: none; border-radius: 6px;">
            Open Admin Permits &rarr;
          </a>
        </div>
      </td>
    </tr>
    <tr>
      <td style="padding: 24px 0 0; border-top: 1px solid #e2e1d8;">
        <div style="font-family: monospace; font-size: 10px; color: #aaa99a; text-align: center; line-height: 1.6;">
          This is an automated annual reminder, sent every January 15.<br />
          Triggered by the cron at <code>/api/permits/verify-reminder</code>.
        </div>
      </td>
    </tr>
  </table>
</body></html>`
}

// ── Release Alert Email Template ─────────────────────────────

// Email sent N days before a scheduled dam release on a river
// the user has subscribed to. Same Georgia/monospace styling as
// the stocking + hatch alerts. Built so the cron at
// /api/cron/release-alerts can fire it directly.
export function releaseAlertEmail(
  riverName: string,
  stateSlug: string,
  riverSlug: string,
  releaseName: string,
  releaseDate: string,        // YYYY-MM-DD
  daysAway: number,            // 1, 2, 3...
  expectedCfs: number | null,
  startTime: string | null,
  endTime: string | null,
  agency: string,
  notes: string | null,
  sourceUrl: string,
  unsubscribeUrl: string,
): string {
  const prettyDate = new Date(releaseDate + 'T12:00:00').toLocaleDateString('en-US', {
    weekday: 'long', month: 'long', day: 'numeric', year: 'numeric',
  })
  const dayPhrase = daysAway === 0 ? 'today'
    : daysAway === 1 ? 'tomorrow'
    : `in ${daysAway} days`

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
        <div style="font-family: monospace; font-size: 10px; color: #BA7517; text-transform: uppercase; letter-spacing: 1.5px; margin-bottom: 6px;">
          \u26A1 Release ${dayPhrase}
        </div>
        <div style="font-family: Georgia, serif; font-size: 22px; font-weight: 700; color: #1a1a18; line-height: 1.3; margin-bottom: 8px;">
          ${riverName}
        </div>
        <div style="font-family: monospace; font-size: 12px; color: #666660; margin-bottom: 16px;">
          ${releaseName}
        </div>
        <table width="100%" cellpadding="0" cellspacing="0" style="background: #f6f5f2; border-radius: 8px; border: 1px solid #e2e1d8;">
          <tr>
            <td style="padding: 16px;">
              <div style="font-family: monospace; font-size: 12px; color: #1a1a18; margin-bottom: 6px;">
                <strong>Date:</strong> ${prettyDate}
              </div>
              ${(startTime || endTime) ? `<div style="font-family: monospace; font-size: 12px; color: #1a1a18; margin-bottom: 6px;"><strong>Window:</strong> ${startTime || ''}${startTime && endTime ? '\u2013' : ''}${endTime || ''}</div>` : ''}
              ${expectedCfs ? `<div style="font-family: monospace; font-size: 12px; color: #1a1a18; margin-bottom: 6px;"><strong>Expected flow:</strong> ${expectedCfs.toLocaleString()} cfs</div>` : ''}
              <div style="font-family: monospace; font-size: 12px; color: #1a1a18; margin-bottom: 6px;">
                <strong>Operating agency:</strong> ${agency}
              </div>
              ${notes ? `<div style="font-family: Georgia, serif; font-size: 12px; color: #666660; line-height: 1.55; margin-top: 10px; padding-top: 10px; border-top: 1px solid #e2e1d8;">${notes}</div>` : ''}
            </td>
          </tr>
        </table>
      </td>
    </tr>
    <tr>
      <td style="padding: 0 0 24px;">
        <div style="background: #FBF3E8; border: 1px solid #BA7517; border-radius: 8px; padding: 12px 16px;">
          <div style="font-family: monospace; font-size: 11px; color: #7A4D0E; line-height: 1.55;">
            <strong>Verify before driving.</strong> Release schedules can change with reservoir conditions. <a href="${sourceUrl}" style="color: #BA7517; text-decoration: underline;">Check the official ${agency.split(' ')[0]} schedule \u2192</a>
          </div>
        </div>
      </td>
    </tr>
    <tr>
      <td style="padding: 0 0 24px; text-align: center;">
        <a href="https://riverscout.app/rivers/${stateSlug}/${riverSlug}" style="display: inline-block; padding: 12px 28px; background: #085041; color: #ffffff; font-family: monospace; font-size: 13px; font-weight: 500; text-decoration: none; border-radius: 6px; letter-spacing: .3px;">
          View ${riverName} Conditions &rarr;
        </a>
      </td>
    </tr>
    <tr>
      <td style="padding: 16px 0 0; border-top: 1px solid #e2e1d8;">
        <div style="font-family: monospace; font-size: 10px; color: #aaa99a; text-align: center; line-height: 1.6;">
          You received this because you subscribed to release alerts for ${riverName} on
          <a href="https://riverscout.app" style="color: #1D9E75;">RiverScout</a>.<br />
          <a href="${unsubscribeUrl}" style="color: #aaa99a;">Unsubscribe</a> &middot;
          <a href="https://riverscout.app/account" style="color: #aaa99a;">Manage all alerts</a>
        </div>
      </td>
    </tr>
  </table>
</body></html>`
}

export { ADMIN_EMAIL }
