import { query, mutation } from './_generated/server'
import { v } from 'convex/values'

export const listForUser = query({
  args: { userId: v.id('users') },
  handler: async (ctx, args) =>
    ctx.db.query('orders').withIndex('by_user', (q) => q.eq('userId', args.userId)).order('desc').collect(),
})

export const getById = query({
  args: { id: v.id('orders') },
  handler: async (ctx, args) => ctx.db.get(args.id),
})

// Creates an order from the user's cart. Payment is confirmed separately by
// a Convex action once Stripe/M-Pesa integration is wired in (see the
// `paymentMethod` field — this only records intent, not a completed charge).
export const create = mutation({
  args: {
    userId: v.id('users'),
    addressId: v.id('addresses'),
    items: v.array(v.object({ vehicleId: v.id('vehicles'), price: v.number(), quantity: v.number() })),
    subtotal: v.number(),
    tax: v.number(),
    shipping: v.number(),
    discount: v.number(),
    total: v.number(),
    couponCode: v.optional(v.string()),
    paymentMethod: v.union(v.literal('stripe'), v.literal('mpesa')),
  },
  handler: async (ctx, args) => {
    const now = Date.now()
    const id = await ctx.db.insert('orders', {
      ...args,
      paymentStatus: 'pending',
      orderStatus: 'processing',
      createdAt: now,
      updatedAt: now,
    })

    // Clear the user's cart after the order is placed
    const cartItems = await ctx.db.query('cart').withIndex('by_user', (q) => q.eq('userId', args.userId)).collect()
    await Promise.all(cartItems.map((item) => ctx.db.delete(item._id)))

    return id
  },
})

// ── Admin ────────────────────────────────────────────────────────────────

export const listAll = query({
  args: { status: v.optional(v.string()) },
  handler: async (ctx, args) => {
    let all = await ctx.db.query('orders').order('desc').collect()
    if (args.status) all = all.filter((o) => o.orderStatus === args.status)
    return all
  },
})

export const updateStatus = mutation({
  args: {
    id: v.id('orders'),
    orderStatus: v.union(
      v.literal('processing'),
      v.literal('confirmed'),
      v.literal('out_for_delivery'),
      v.literal('delivered'),
      v.literal('cancelled')
    ),
  },
  handler: async (ctx, args) => {
    await ctx.db.patch(args.id, { orderStatus: args.orderStatus, updatedAt: Date.now() })
  },
})

export const updatePaymentStatus = mutation({
  args: { id: v.id('orders'), paymentStatus: v.union(v.literal('pending'), v.literal('paid'), v.literal('failed'), v.literal('refunded')) },
  handler: async (ctx, args) => {
    await ctx.db.patch(args.id, { paymentStatus: args.paymentStatus, updatedAt: Date.now() })
  },
})
