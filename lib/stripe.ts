import Stripe from 'stripe'

export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2026-03-25.dahlia',
})

// Map tier + billing cycle to Stripe Price IDs
// Set these in your Vercel env vars
export const STRIPE_PRICES: Record<string, { monthly: string; yearly: string }> = {
  pro: {
    monthly: process.env.STRIPE_PRICE_PRO_MONTHLY || 'price_1TJz5fB5JFquRqxBGh0g0XOW',
    yearly: process.env.STRIPE_PRICE_PRO_YEARLY || 'price_1TJz6NB5JFquRqxBMoDgSPNE',
  },
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
