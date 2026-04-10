import { NextRequest, NextResponse } from 'next/server'
import { stripe, STRIPE_PRICES } from '@/lib/stripe'
import { createSupabaseClient } from '@/lib/supabase'
import { sendEmail } from '@/lib/email'
import Stripe from 'stripe'

const PRO_PRICE_IDS = new Set([STRIPE_PRICES.pro.monthly, STRIPE_PRICES.pro.yearly].filter(Boolean))

function isProSubscription(sub: Stripe.Subscription): boolean {
  return sub.items.data.some(item => PRO_PRICE_IDS.has(item.price.id))
}

function getProUserId(meta: Record<string, string>): string | null {
  // Support both old format (userId/billing) and new format (user_id/tier)
  return meta.user_id || meta.userId || null
}

function getProTier(meta: Record<string, string>): string {
  return meta.tier || meta.billing || 'monthly'
}

function isProCheckout(meta: Record<string, string>): boolean {
  const userId = getProUserId(meta)
  // Pro checkouts have a user_id but no business_name or outfitter tier markers
  return !!userId && !meta.business_name && !meta.river_id && !meta.river_ids
}

// POST /api/webhooks/stripe — handle Stripe webhook events
export async function POST(req: NextRequest) {
  const body = await req.text()
  const sig = req.headers.get('stripe-signature')

  if (!sig) {
    return NextResponse.json({ error: 'Missing signature' }, { status: 400 })
  }

  let event: Stripe.Event
  try {
    event = stripe.webhooks.constructEvent(
      body,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET!,
    )
  } catch (err) {
    console.error('Webhook signature verification failed:', err)
    return NextResponse.json({ error: 'Invalid signature' }, { status: 400 })
  }

  const supabase = createSupabaseClient()

  switch (event.type) {
    case 'checkout.session.completed': {
      const session = event.data.object as Stripe.Checkout.Session
      const meta = (session.metadata || {}) as Record<string, string>
      const customerId = session.customer as string
      const subscriptionId = session.subscription as string
      const email = session.customer_email

      // ── Pro subscription checkout ──
      if (isProCheckout(meta)) {
        const userId = getProUserId(meta)!
        const tier = getProTier(meta)

        console.log(`[STRIPE] Pro checkout completed: ${userId} (${tier}) — ${email}`)

        await supabase
          .from('user_profiles')
          .update({
            is_pro: true,
            pro_tier: tier,
            stripe_customer_id: customerId,
            stripe_subscription_id: subscriptionId,
            pro_started_at: new Date().toISOString(),
            pro_expires_at: null,
            updated_at: new Date().toISOString(),
          })
          .eq('id', userId)

        // Send welcome email
        if (email) {
          try {
            await sendEmail({
              to: email,
              subject: 'Welcome to RiverScout Pro',
              html: `<!DOCTYPE html>
<html><head><meta charset="utf-8" /></head>
<body style="margin: 0; padding: 0; background: #ffffff; font-family: Georgia, serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="max-width: 520px; margin: 0 auto; padding: 20px;">
    <tr>
      <td style="padding-bottom: 16px; border-bottom: 1px solid #e2e1d8;">
        <span style="font-family: Georgia, serif; font-size: 20px; font-weight: 700; color: #085041;">
          River<span style="color: #185FA5;">Scout</span> <span style="font-family: monospace; font-size: 11px; color: #1D9E75; background: #E1F5EE; padding: 2px 8px; border-radius: 4px;">PRO</span>
        </span>
      </td>
    </tr>
    <tr>
      <td style="padding: 24px 0;">
        <div style="font-family: Georgia, serif; font-size: 22px; font-weight: 700; color: #085041; margin-bottom: 16px;">
          Welcome to Pro
        </div>
        <p style="font-size: 15px; color: #1a1a18; line-height: 1.7; margin-bottom: 20px;">
          Thank you for supporting RiverScout and independent river data. Your Pro subscription is now active.
        </p>
        <div style="background: #E1F5EE; border: 1px solid #9FE1CB; border-radius: 8px; padding: 16px; margin-bottom: 20px;">
          <div style="font-family: monospace; font-size: 10px; color: #085041; text-transform: uppercase; letter-spacing: 1px; margin-bottom: 10px;">Your Pro Features</div>
          <div style="font-family: monospace; font-size: 12px; color: #1a1a18; line-height: 2;">
            &#9889; Flow alert emails &mdash; when your river hits optimal CFS<br/>
            &#9889; Stocking alert emails &mdash; the moment your river is stocked<br/>
            &#9889; Hatch alert emails &mdash; when water temp hits the trigger<br/>
            &#9889; 10-year historical flow analysis<br/>
            &#9889; AI forecast interpretation<br/>
            &#9889; Custom CFS ranges per river<br/>
            &#9889; Offline river pages
          </div>
        </div>
        <div style="text-align: center; margin: 24px 0;">
          <a href="https://riverscout.app/alerts" style="display: inline-block; padding: 12px 28px; background: #085041; color: #ffffff; font-family: monospace; font-size: 13px; text-decoration: none; border-radius: 6px;">
            Set Up Your Alerts
          </a>
        </div>
        <p style="font-family: monospace; font-size: 11px; color: #aaa99a; text-align: center;">
          Questions? Reply to this email or reach us at outfitters@riverscout.app
        </p>
      </td>
    </tr>
  </table>
</body></html>`,
            })
          } catch (emailErr) {
            console.error('[STRIPE] Failed to send Pro welcome email:', emailErr)
          }
        }

        break
      }

      // ── Outfitter subscription checkout ──
      console.log(`[STRIPE] Checkout completed: ${meta.business_name} (${meta.tier}) — ${email}`)

      const riverIds = meta.river_ids ? JSON.parse(meta.river_ids) : (meta.river_id ? [meta.river_id] : [])

      const { data: existing } = await supabase
        .from('outfitters')
        .select('id')
        .eq('stripe_customer_id', customerId)
        .limit(1)

      if (existing && existing.length > 0) {
        await supabase
          .from('outfitters')
          .update({
            tier: meta.tier,
            stripe_subscription_id: subscriptionId,
            stripe_price_id: meta.billing === 'yearly'
              ? `yearly_${meta.tier}`
              : `monthly_${meta.tier}`,
            river_ids: riverIds,
            active: true,
            updated_at: new Date().toISOString(),
          })
          .eq('id', existing[0].id)
      } else {
        await supabase
          .from('outfitters')
          .insert({
            business_name: meta.business_name || 'Unnamed Business',
            tier: meta.tier || 'featured',
            river_ids: riverIds,
            stripe_customer_id: customerId,
            stripe_subscription_id: subscriptionId,
            stripe_price_id: meta.billing === 'yearly'
              ? `yearly_${meta.tier}`
              : `monthly_${meta.tier}`,
            active: true,
          })
      }
      break
    }

    case 'customer.subscription.updated': {
      const sub = event.data.object as Stripe.Subscription
      const customerId = sub.customer as string
      const active = sub.status === 'active' || sub.status === 'trialing'

      console.log(`[STRIPE] Subscription updated: ${customerId} — status: ${sub.status}`)

      if (isProSubscription(sub)) {
        const periodEnd = sub.items.data[0]?.current_period_end
        const currentPeriodEnd = periodEnd
          ? new Date(periodEnd * 1000).toISOString()
          : null

        await supabase
          .from('user_profiles')
          .update({
            is_pro: active,
            pro_expires_at: currentPeriodEnd,
            stripe_subscription_id: sub.id,
            updated_at: new Date().toISOString(),
          })
          .eq('stripe_customer_id', customerId)
      } else {
        await supabase
          .from('outfitters')
          .update({
            active,
            stripe_subscription_id: sub.id,
            updated_at: new Date().toISOString(),
          })
          .eq('stripe_customer_id', customerId)
      }
      break
    }

    case 'customer.subscription.deleted': {
      const sub = event.data.object as Stripe.Subscription
      const customerId = sub.customer as string

      console.log(`[STRIPE] Subscription cancelled: ${customerId}`)

      if (isProSubscription(sub)) {
        await supabase
          .from('user_profiles')
          .update({
            is_pro: false,
            pro_tier: null,
            stripe_subscription_id: null,
            updated_at: new Date().toISOString(),
          })
          .eq('stripe_customer_id', customerId)
      } else {
        await supabase
          .from('outfitters')
          .update({
            active: false,
            updated_at: new Date().toISOString(),
          })
          .eq('stripe_customer_id', customerId)
      }
      break
    }

    case 'invoice.payment_failed': {
      const invoice = event.data.object as Stripe.Invoice
      const customerId = invoice.customer as string

      console.log(`[STRIPE] Payment failed: ${customerId}`)

      // Check if this is a Pro subscriber
      const { data: proUser } = await supabase
        .from('user_profiles')
        .select('email')
        .eq('stripe_customer_id', customerId)
        .eq('is_pro', true)
        .single()

      if (proUser?.email) {
        // Build Stripe customer portal link
        try {
          const portalSession = await stripe.billingPortal.sessions.create({
            customer: customerId,
            return_url: `${process.env.NEXT_PUBLIC_SITE_URL || 'https://riverscout.app'}/pro`,
          })

          await sendEmail({
            to: proUser.email,
            subject: 'Your RiverScout Pro payment failed',
            html: `<!DOCTYPE html>
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
        <div style="font-family: Georgia, serif; font-size: 18px; font-weight: 700; color: #A32D2D; margin-bottom: 12px;">
          Payment failed
        </div>
        <p style="font-size: 14px; color: #1a1a18; line-height: 1.7; margin-bottom: 16px;">
          We couldn't process your RiverScout Pro payment. Please update your payment method to keep your Pro features active.
        </p>
        <p style="font-size: 14px; color: #666660; line-height: 1.7; margin-bottom: 20px;">
          Your flow alerts and stocking alerts will continue for now, but will be paused if payment isn't resolved.
        </p>
        <div style="text-align: center;">
          <a href="${portalSession.url}" style="display: inline-block; padding: 12px 28px; background: #085041; color: #ffffff; font-family: monospace; font-size: 13px; text-decoration: none; border-radius: 6px;">
            Update Payment Method
          </a>
        </div>
      </td>
    </tr>
  </table>
</body></html>`,
          })
        } catch (emailErr) {
          console.error('[STRIPE] Failed to send payment failed email:', emailErr)
        }
      }

      // Don't deactivate immediately — Stripe retries
      // After final retry fails, subscription.deleted will fire
      break
    }

    default:
      // Unhandled event type
      break
  }

  return NextResponse.json({ received: true })
}
