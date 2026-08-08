import { query, mutation } from './_generated/server'
import { v } from 'convex/values'

export const list = query({
  args: {},
  handler: async (ctx) => ctx.db.query('brands').collect(),
})

export const getBySlug = query({
  args: { slug: v.string() },
  handler: async (ctx, args) =>
    ctx.db.query('brands').withIndex('by_slug', (q) => q.eq('slug', args.slug)).unique(),
})

export const create = mutation({
  args: { name: v.string(), slug: v.string(), logoUrl: v.optional(v.string()), description: v.optional(v.string()) },
  handler: async (ctx, args) => {
    const now = Date.now()
    return await ctx.db.insert('brands', { ...args, createdAt: now, updatedAt: now })
  },
})

export const remove = mutation({
  args: { id: v.id('brands') },
  handler: async (ctx, args) => ctx.db.delete(args.id),
})
