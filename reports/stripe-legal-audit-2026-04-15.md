## Stripe + Legal Pre-Launch Audit — 2026-04-15

### 1. Webhook handler — subscription lifecycle ✅

`app/api/webhooks/stripe/route.ts` handles four events:

| Event | Handling |
|---|---|
| `checkout.session.completed` | Sets `is_pro=true`, stores `stripe_customer_id` + `stripe_subscription_id`, sends welcome email |
| `customer.subscription.updated` | Mirrors `sub.status` to `is_pro` (`active` or `trialing` → true), updates `pro_expires_at` from `current_period_end` |
| `customer.subscription.deleted` | Clears `is_pro`, `pro_tier`, `stripe_subscription_id` |
| `invoice.payment_failed` | Emails the user a billing-portal link to update their card. **Does NOT immediately revoke `is_pro`** (intentional). |

**Coverage assessment**: the four events cover the 95% case. Two events worth considering for hardening:
- `customer.subscription.trial_will_end` — for sending pre-trial-end nudges (no trials configured today, so unused)
- `invoice.payment_succeeded` — currently relied on via `subscription.updated`; explicit handler not required

### 2. Pro feature gating ✅

- Profile column `is_pro` (boolean) is the single source of truth, set by webhook.
- Server-side checks in `app/api/alerts/check/route.ts`, `app/api/hatch-alerts/route.ts`, `app/api/stocking/alerts/route.ts`, `app/api/pro/status/route.ts` all read `is_pro` from `user_profiles`.
- UI `SHOW_PRO_TIER` flag (now ON by default, `lib/features.ts`) gates marketing surfaces.
- Account page `app/account/page.tsx:402` shows Pro badge when `profile.is_pro === true`; otherwise renders the Upgrade prompt.

**Verdict**: a Pro user sees full feature set; free user sees upgrade CTAs. Confirmed.

### 3. Cancellation flow ✅

`app/account/page.tsx:418` "Manage Subscription" button → `POST /api/stripe/portal` → returns Stripe billing portal session URL → user cancels there.

When user picks "cancel at end of period" in the portal:
- Stripe sets `cancel_at_period_end=true` on the sub but `status` stays `'active'`
- Our `customer.subscription.updated` handler keeps `is_pro=true` (because `active`)
- At period end, Stripe fires `customer.subscription.deleted`, our handler clears `is_pro`

**Verdict**: graceful — Pro features remain available until the period the user paid for actually ends.

### 4. Failed-payment grace ✅ (exceeds spec)

Spec required ≥3 days. Implementation:
- First failure → email with portal link, `is_pro` left unchanged
- Stripe retries on its default schedule (4 retries over ~21 days for monthly subs)
- After final retry, sub goes to `unpaid` → `subscription.deleted` → `is_pro=false`

**Effective grace period: ~3 weeks**, far above spec.

Watch-outs:
- Email send relies on `sendEmail()` returning successfully; failures are logged but not retried. Acceptable for first-pass.
- No email after the 2nd or 3rd failed attempt — could add a "last reminder" email when status flips to `past_due`.

### 5. Mobile checkout ✅

Checkout is hosted by Stripe (`app/api/stripe/pro-checkout/route.ts:56` creates a Stripe Checkout session and redirects). Stripe's hosted Checkout page is mobile-responsive by default — no work required from us.

The pre-checkout `/pro` page (`app/pro/page.tsx`) was inspected briefly. Pricing tiles use `display: 'flex'` with `flexWrap`; should reflow on small screens. Recommend manual verification at <400px viewport before launch.

### 6. /terms and /privacy ❌ → ✅ (created in this commit)

Both pages did not exist as of audit start. Created placeholder versions:
- `app/terms/page.tsx` — covers service use, accounts, Pro subscription, user content, outfitter listings, liability, contact
- `app/privacy/page.tsx` — covers data collection, cookies, email, user rights, children, contact

**Both are placeholders.** Replace with reviewed legal copy before public launch / before Stripe's compliance check on the live merchant account.

---

### Action items for you

1. **Update Stripe price object** in your Stripe dashboard to $2.99/month (and $29/year if you want the new yearly to match). Then update env vars in Vercel:
   - `STRIPE_PRICE_PRO_MONTHLY` → new monthly price ID
   - `STRIPE_PRICE_PRO_YEARLY` → new yearly price ID (if changed)
   Redeploy.
2. **Have an attorney review** `/terms` and `/privacy` before formal launch.
3. **Manual mobile checkout test** — open `/pro` on a phone, click monthly, complete a $0.50 test charge in Stripe test mode end-to-end.
4. Consider adding `customer.subscription.trial_will_end` handler if you ever introduce trials.
