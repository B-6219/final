import { action, query } from './_generated/server'
import { v } from 'convex/values'

// Lets the client check which providers are ready *before* attempting a
// charge, so an unconfigured provider results in a quiet, expected UI
// message instead of calling the action and having Convex log a server
// error to the console (which happens for any thrown action error,
// caught or not — it's Convex's own debug logging, separate from your
// app's try/catch). Only returns booleans, never the actual secret values.
export const getProviderStatus = query({
  args: {},
  handler: async () => ({
    stripeConfigured: Boolean(process.env.STRIPE_SECRET_KEY),
    mpesaConfigured: Boolean(
      process.env.MPESA_CONSUMER_KEY &&
      process.env.MPESA_CONSUMER_SECRET &&
      process.env.MPESA_SHORTCODE &&
      process.env.MPESA_PASSKEY
    ),
  }),
})

// ─────────────────────────────────────────────────────────────────────────
// Stripe — creates a PaymentIntent server-side (never expose the secret key
// to the browser). The frontend confirms it with Stripe.js using the
// returned client_secret. Set STRIPE_SECRET_KEY with:
//   npx convex env set STRIPE_SECRET_KEY sk_test_...
// ─────────────────────────────────────────────────────────────────────────
export const createStripePaymentIntent = action({
  args: {
    amount: v.number(), // in the currency's smallest unit, e.g. cents
    currency: v.optional(v.string()),
    orderId: v.string(),
  },
  handler: async (ctx, { amount, currency = 'usd', orderId }) => {
    const secretKey = process.env.STRIPE_SECRET_KEY
    if (!secretKey) {
      throw new Error(
        'Stripe is not configured — run `npx convex env set STRIPE_SECRET_KEY sk_test_...` and try again.'
      )
    }

    const body = new URLSearchParams({
      amount: String(Math.round(amount)),
      currency,
      'metadata[orderId]': orderId,
      'automatic_payment_methods[enabled]': 'true',
    })

    const res = await fetch('https://api.stripe.com/v1/payment_intents', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${secretKey}`,
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body,
    })

    const data = await res.json()
    if (!res.ok) {
      throw new Error(data?.error?.message || 'Stripe payment intent creation failed')
    }

    return { clientSecret: data.client_secret, paymentIntentId: data.id }
  },
})

// ─────────────────────────────────────────────────────────────────────────
// M-Pesa Daraja — STK Push. Two calls: OAuth token, then the push itself.
// Set these with `npx convex env set NAME value`:
//   MPESA_CONSUMER_KEY, MPESA_CONSUMER_SECRET, MPESA_SHORTCODE, MPESA_PASSKEY
// MPESA_ENV controls sandbox vs production host (defaults to sandbox).
// ─────────────────────────────────────────────────────────────────────────
function mpesaBaseUrl() {
  return process.env.MPESA_ENV === 'production'
    ? 'https://api.safaricom.co.ke'
    : 'https://sandbox.safaricom.co.ke'
}

async function getMpesaToken() {
  const key = process.env.MPESA_CONSUMER_KEY
  const secret = process.env.MPESA_CONSUMER_SECRET
  if (!key || !secret) {
    throw new Error(
      'M-Pesa is not configured — run `npx convex env set MPESA_CONSUMER_KEY ...` and `MPESA_CONSUMER_SECRET ...`.'
    )
  }
  const credentials = btoa(`${key}:${secret}`)
  const res = await fetch(`${mpesaBaseUrl()}/oauth/v1/generate?grant_type=client_credentials`, {
    headers: { Authorization: `Basic ${credentials}` },
  })
  const data = await res.json()
  if (!res.ok) throw new Error(data?.errorMessage || 'Failed to authenticate with M-Pesa')
  return data.access_token
}

export const initiateMpesaStkPush = action({
  args: {
    phone: v.string(), // format 2547XXXXXXXX
    amount: v.number(),
    orderId: v.string(),
    callbackUrl: v.string(), // your deployed HTTP action / webhook endpoint
  },
  handler: async (ctx, { phone, amount, orderId, callbackUrl }) => {
    const shortcode = process.env.MPESA_SHORTCODE
    const passkey = process.env.MPESA_PASSKEY
    if (!shortcode || !passkey) {
      throw new Error(
        'M-Pesa is not configured — run `npx convex env set MPESA_SHORTCODE ...` and `MPESA_PASSKEY ...`.'
      )
    }

    const token = await getMpesaToken()
    const timestamp = new Date().toISOString().replace(/[^0-9]/g, '').slice(0, 14)
    const password = btoa(`${shortcode}${passkey}${timestamp}`)

    const res = await fetch(`${mpesaBaseUrl()}/mpesa/stkpush/v1/processrequest`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        BusinessShortCode: shortcode,
        Password: password,
        Timestamp: timestamp,
        TransactionType: 'CustomerPayBillOnline',
        Amount: Math.round(amount),
        PartyA: phone,
        PartyB: shortcode,
        PhoneNumber: phone,
        CallBackURL: callbackUrl,
        AccountReference: orderId,
        TransactionDesc: `Chief Motors order ${orderId}`,
      }),
    })

    const data = await res.json()
    if (!res.ok) {
      throw new Error(data?.errorMessage || 'M-Pesa STK push failed')
    }

    return {
      merchantRequestId: data.MerchantRequestID,
      checkoutRequestId: data.CheckoutRequestID,
      customerMessage: data.CustomerMessage,
    }
  },
})
