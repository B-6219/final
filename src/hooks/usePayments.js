import { useAction, useQuery } from 'convex/react'
import { api } from '../../convex/_generated/api'
import { convex } from '@/lib/convexClient'

/**
 * Returns { chargeWithStripe, chargeWithMpesa, stripeConfigured,
 * mpesaConfigured, isConnected, statusLoaded }.
 *
 * Checks convex/payments.js's getProviderStatus query first, so callers
 * can skip invoking an unconfigured action entirely — that avoids Convex
 * logging a server-error to the console for an outcome we already expect
 * (missing keys during setup), while still calling the real Stripe/M-Pesa
 * APIs once keys are set via `npx convex env set ...`.
 */
export function usePayments() {
  const status = convex ? useQuery(api.payments.getProviderStatus) : undefined
  const stripeAction = convex ? useAction(api.payments.createStripePaymentIntent) : null
  const mpesaAction = convex ? useAction(api.payments.initiateMpesaStkPush) : null

  const stripeConfigured = Boolean(status?.stripeConfigured)
  const mpesaConfigured = Boolean(status?.mpesaConfigured)

  return {
    isConnected: Boolean(convex),
    statusLoaded: !convex || status !== undefined,
    stripeConfigured,
    mpesaConfigured,
    chargeWithStripe: async ({ amount, currency, orderId }) => {
      if (!stripeAction) {
        throw new Error('Connect Convex first (see .env.local) to enable Stripe payments.')
      }
      if (!stripeConfigured) {
        throw new Error('Stripe is not configured yet — run `npx convex env set STRIPE_SECRET_KEY sk_test_...`.')
      }
      return stripeAction({ amount, currency, orderId })
    },
    chargeWithMpesa: async ({ phone, amount, orderId, callbackUrl }) => {
      if (!mpesaAction) {
        throw new Error('Connect Convex first (see .env.local) to enable M-Pesa payments.')
      }
      if (!mpesaConfigured) {
        throw new Error('M-Pesa is not configured yet — run `npx convex env set MPESA_SHORTCODE ...` (and CONSUMER_KEY/SECRET, PASSKEY).')
      }
      return mpesaAction({ phone, amount, orderId, callbackUrl })
    },
  }
}
