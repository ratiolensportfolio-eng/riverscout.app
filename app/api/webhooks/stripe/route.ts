import { NextRequest, NextResponse } from 'next/server'
import { stripe } from '@/lib/stripe'
import { createSupabaseClient } from '@/lib/supabase'
import Stripe from 'stripe'

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
      const meta = session.metadata || {}
      const customerId = session.customer as string
      const subscriptionId = session.subscription as string
      const email = session.customer_email

      console.log(`[STRIPE] Checkout completed: ${meta.business_name} (${meta.tier}) — ${email}`)

      // Create or update the outfitter listing
      const riverIds = meta.river_ids ? JSON.parse(meta.river_ids) : (meta.river_id ? [meta.river_id] : [])

      // Check if this email already has a listing
      const { data: existing } = await supabase
        .from('outfitters')
        .select('id')
        .eq('stripe_customer_id', customerId)
        .limit(1)

      if (existing && existing.length > 0) {
        // Update existing listing
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
        // Create new listing
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

      await supabase
        .from('outfitters')
        .update({
          active,
          stripe_subscription_id: sub.id,
          updated_at: new Date().toISOString(),
        })
        .eq('stripe_customer_id', customerId)
      break
    }

    case 'customer.subscription.deleted': {
      const sub = event.data.object as Stripe.Subscription
      const customerId = sub.customer as string

      console.log(`[STRIPE] Subscription cancelled: ${customerId}`)

      await supabase
        .from('outfitters')
        .update({
          active: false,
          updated_at: new Date().toISOString(),
        })
        .eq('stripe_customer_id', customerId)
      break
    }

    case 'invoice.payment_failed': {
      const invoice = event.data.object as Stripe.Invoice
      const customerId = invoice.customer as string

      console.log(`[STRIPE] Payment failed: ${customerId}`)

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
