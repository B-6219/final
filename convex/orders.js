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

// No in-app checkout anymore (cart + payment integrations were removed —
// this dealership sells over WhatsApp). This mutation is kept so admin can
// still log a sale manually for record-keeping after a deal is agreed;
// nothing in the storefront calls it automatically.
export const create = mutation({
  args: {
    userId: v.id('users'),
    addressId: v.optional(v.id('addresses')),
    items: v.array(v.object({ vehicleId: v.id('vehicles'), price: v.optional(v.number()), quantity: v.number() })),
    subtotal: v.optional(v.number()),
    tax: v.optional(v.number()),
    shipping: v.optional(v.number()),
    discount: v.optional(v.number()),
    total: v.optional(v.number()),
    couponCode: v.optional(v.string()),
    paymentMethod: v.optional(v.string()), // e.g. "cash", "bank transfer"
  },
  handler: async (ctx, args) => {
    const now = Date.now()
    return await ctx.db.insert('orders', {
      ...args,
      paymentStatus: 'pending',
      orderStatus: 'processing',
      createdAt: now,
      updatedAt: now,
    })
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
