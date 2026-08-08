import { query, mutation } from './_generated/server'
import { v } from 'convex/values'

export const list = query({
  args: {},
  handler: async (ctx) => ctx.db.query('categories').collect(),
})

export const getBySlug = query({
  args: { slug: v.string() },
  handler: async (ctx, args) =>
    ctx.db.query('categories').withIndex('by_slug', (q) => q.eq('slug', args.slug)).unique(),
})

export const create = mutation({
  args: {
    name: v.string(),
    slug: v.string(),
    description: v.optional(v.string()),
    imageUrl: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const now = Date.now()
    return await ctx.db.insert('categories', { ...args, createdAt: now, updatedAt: now })
  },
})

export const remove = mutation({
  args: { id: v.id('categories') },
  handler: async (ctx, args) => ctx.db.delete(args.id),
})
