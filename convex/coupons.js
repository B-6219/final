import { query, mutation } from './_generated/server'
import { v } from 'convex/values'

export const validate = query({
  args: { code: v.string(), subtotal: v.number() },
  handler: async (ctx, args) => {
    const coupon = await ctx.db.query('coupons').withIndex('by_code', (q) => q.eq('code', args.code)).unique()
    if (!coupon || !coupon.active) return { valid: false, reason: 'Coupon not found or inactive' }
    if (coupon.expiresAt && coupon.expiresAt < Date.now()) return { valid: false, reason: 'Coupon has expired' }
    if (coupon.minSpend && args.subtotal < coupon.minSpend) return { valid: false, reason: `Minimum spend of $${coupon.minSpend} required` }
    if (coupon.usageLimit && coupon.usedCount >= coupon.usageLimit) return { valid: false, reason: 'Coupon usage limit reached' }

    const discount = coupon.type === 'percentage' ? (args.subtotal * coupon.value) / 100 : coupon.value
    return { valid: true, discount, coupon }
  },
})

export const list = query({
  args: {},
  handler: async (ctx) => ctx.db.query('coupons').collect(),
})

export const create = mutation({
  args: {
    code: v.string(),
    type: v.union(v.literal('percentage'), v.literal('fixed')),
    value: v.number(),
    minSpend: v.optional(v.number()),
    expiresAt: v.optional(v.number()),
    usageLimit: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    const now = Date.now()
    return await ctx.db.insert('coupons', { ...args, active: true, usedCount: 0, createdAt: now, updatedAt: now })
  },
})

export const remove = mutation({
  args: { id: v.id('coupons') },
  handler: async (ctx, args) => ctx.db.delete(args.id),
})
