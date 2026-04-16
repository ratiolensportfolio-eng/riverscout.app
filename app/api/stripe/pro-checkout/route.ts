import { NextRequest, NextResponse } from 'next/server'
import { stripe, STRIPE_PRICES } from '@/lib/stripe'
import { createSupabaseClient } from '@/lib/supabase'

// POST /api/stripe/pro-checkout — create Stripe Checkout Session for Pro subscription
export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { userId, email, tier } = body

    if (!userId || !email || !['monthly', 'yearly'].includes(tier)) {
      return NextResponse.json({ error: 'Missing required fields: userId, email, tier (monthly|yearly)' }, { status: 400 })
    }

    const priceId = STRIPE_PRICES.pro[tier as 'monthly' | 'yearly']
    if (!priceId) {
      return NextResponse.json({ error: 'Pro price not configured' }, { status: 500 })
    }

    const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://riverscout.app'
    const supabase = createSupabaseClient()

    // Look up or create Stripe customer
    const { data: profile } = await supabase
      .from('user_profiles')
      .select('stripe_customer_id, is_pro')
      .eq('id', userId)
      .single()

    if (profile?.is_pro) {
      return NextResponse.json({ error: 'Already a Pro subscriber' }, { status: 400 })
    }

    let customerId = profile?.stripe_customer_id

    if (!customerId) {
      const customer = await stripe.customers.create({
        email,
        metadata: { user_id: userId },
      })
      customerId = customer.id

      await supabase
        .from('user_profiles')
        .update({ stripe_customer_id: customerId })
        .eq('id', userId)
    }

    // Create checkout session
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      mode: 'subscription',
      customer: customerId,
      customer_email: customerId ? undefined : email,
      line_items: [{
        price: priceId,
        quantity: 1,
      }],
      success_url: `${baseUrl}/pro/success`,
      cancel_url: `${baseUrl}/pro`,
      metadata: {
        user_id: userId,
        tier,
      },
      subscription_data: {
        metadata: {
          user_id: userId,
        },
      },
      // Terms + Privacy on the Stripe-hosted checkout page.
      custom_text: {
        submit: {
          message: "By subscribing, you agree to RiverScout's [Terms of Service](https://riverscout.app/terms) and [Privacy Policy](https://riverscout.app/privacy).",
        },
      },
    })

    return NextResponse.json({ url: session.url, sessionId: session.id })
  } catch (err) {
    console.error('Pro checkout error:', err)
    return NextResponse.json({ error: 'Failed to create checkout session' }, { status: 500 })
  }
}
