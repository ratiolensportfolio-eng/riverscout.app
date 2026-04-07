import Stripe from 'stripe'

export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2025-03-31.basil',
})

// Map tier + billing cycle to Stripe Price IDs
// Set these in your Vercel env vars
export const STRIPE_PRICES: Record<string, { monthly: string; yearly: string }> = {
  featured: {
    monthly: process.env.STRIPE_PRICE_FEATURED_MONTHLY || '',
    yearly: process.env.STRIPE_PRICE_FEATURED_YEARLY || '',
  },
  sponsored: {
    monthly: process.env.STRIPE_PRICE_SPONSORED_MONTHLY || '',
    yearly: process.env.STRIPE_PRICE_SPONSORED_YEARLY || '',
  },
  guide: {
    monthly: process.env.STRIPE_PRICE_GUIDE_MONTHLY || '',
    yearly: process.env.STRIPE_PRICE_GUIDE_YEARLY || '',
  },
  destination: {
    monthly: process.env.STRIPE_PRICE_DESTINATION_MONTHLY || '',
    yearly: '', // annual only, contact sales — no self-serve yearly
  },
}

export function getStripePrice(tier: string, billing: 'monthly' | 'yearly'): string | null {
  const prices = STRIPE_PRICES[tier]
  if (!prices) return null
  return prices[billing] || null
}
