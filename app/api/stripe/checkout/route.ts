import { NextRequest, NextResponse } from 'next/server'
import { stripe, getStripePrice } from '@/lib/stripe'

// POST /api/stripe/checkout — create a Stripe Checkout Session
export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { tier, billing, businessName, email, riverId, riverIds } = body

    if (!tier || !billing || !email) {
      return NextResponse.json({ error: 'tier, billing, and email required' }, { status: 400 })
    }

    const priceId = getStripePrice(tier, billing)
    if (!priceId) {
      return NextResponse.json({ error: 'Invalid tier or billing cycle' }, { status: 400 })
    }

    const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://riverscout.app'

    const session = await stripe.checkout.sessions.create({
      mode: 'subscription',
      payment_method_types: ['card'],
      line_items: [{ price: priceId, quantity: 1 }],
      customer_email: email,
      metadata: {
        tier,
        billing,
        business_name: businessName || '',
        river_id: riverId || '',
        river_ids: JSON.stringify(riverIds || []),
      },
      success_url: `${baseUrl}/outfitters/success?tier=${tier}&billing=${billing}&session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${baseUrl}/outfitters/cancel`,
      // Terms + Privacy on the Stripe-hosted checkout page.
      custom_text: {
        submit: {
          message: "By subscribing, you agree to RiverScout's [Terms of Service](https://riverscout.app/terms) and [Privacy Policy](https://riverscout.app/privacy).",
        },
      },
    })

    return NextResponse.json({ url: session.url })
  } catch (err) {
    console.error('Stripe checkout error:', err)
    return NextResponse.json({ error: 'Failed to create checkout session' }, { status: 500 })
  }
}
