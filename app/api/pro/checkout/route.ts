import { NextRequest, NextResponse } from 'next/server'
import { stripe, STRIPE_PRICES } from '@/lib/stripe'
import { createSupabaseClient } from '@/lib/supabase'

// POST /api/pro/checkout — create a Stripe Checkout Session for Pro
export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { userId, email, billing } = body

    if (!userId || !email || !['monthly', 'yearly'].includes(billing)) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }

    const priceId = STRIPE_PRICES.pro[billing as 'monthly' | 'yearly']
    if (!priceId) {
      return NextResponse.json({ error: 'Price not configured' }, { status: 500 })
    }

    // Check if user already has a Stripe customer ID
    const supabase = createSupabaseClient()
    const { data: profile } = await supabase
      .from('user_profiles')
      .select('stripe_customer_id')
      .eq('id', userId)
      .single()

    let customerId = profile?.stripe_customer_id

    // Create Stripe customer if needed
    if (!customerId) {
      const customer = await stripe.customers.create({
        email,
        metadata: { userId },
      })
      customerId = customer.id

      // Save customer ID to profile
      await supabase
        .from('user_profiles')
        .update({ stripe_customer_id: customerId })
        .eq('id', userId)
    }

    // Create checkout session
    const session = await stripe.checkout.sessions.create({
      customer: customerId,
      mode: 'subscription',
      line_items: [{ price: priceId, quantity: 1 }],
      success_url: `${process.env.NEXT_PUBLIC_SITE_URL || 'https://riverscout.app'}/pro/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.NEXT_PUBLIC_SITE_URL || 'https://riverscout.app'}/pro`,
      metadata: { userId, billing },
      subscription_data: {
        metadata: { userId, billing },
      },
      // Terms + Privacy surfaced on the Stripe-hosted checkout page.
      // Markdown-style links render as real anchors above the submit
      // button. Same copy as the login fine print.
      custom_text: {
        submit: {
          message: "By subscribing, you agree to RiverScout's [Terms of Service](https://riverscout.app/terms) and [Privacy Policy](https://riverscout.app/privacy).",
        },
      },
    })

    return NextResponse.json({ url: session.url })
  } catch (err) {
    console.error('Pro checkout error:', err)
    return NextResponse.json({ error: 'Failed to create checkout session' }, { status: 500 })
  }
}
