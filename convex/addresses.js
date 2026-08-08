import { query, mutation } from './_generated/server'
import { v } from 'convex/values'

export const list = query({
  args: { userId: v.id('users') },
  handler: async (ctx, args) =>
    ctx.db.query('addresses').withIndex('by_user', (q) => q.eq('userId', args.userId)).collect(),
})

export const create = mutation({
  args: {
    userId: v.id('users'),
    label: v.optional(v.string()),
    fullName: v.string(),
    line1: v.string(),
    line2: v.optional(v.string()),
    city: v.string(),
    state: v.optional(v.string()),
    postalCode: v.string(),
    country: v.string(),
    phone: v.string(),
    isDefault: v.boolean(),
  },
  handler: async (ctx, args) => {
    const now = Date.now()
    return await ctx.db.insert('addresses', { ...args, createdAt: now, updatedAt: now })
  },
})

export const update = mutation({
  args: { id: v.id('addresses'), patch: v.record(v.string(), v.any()) },
  handler: async (ctx, args) => ctx.db.patch(args.id, { ...args.patch, updatedAt: Date.now() }),
})

export const remove = mutation({
  args: { id: v.id('addresses') },
  handler: async (ctx, args) => ctx.db.delete(args.id),
})
