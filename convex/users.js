import { query, mutation } from './_generated/server'
import { v } from 'convex/values'

// Called from a Clerk webhook (or first-login check) to keep our users
// table in sync with Clerk. Upserts by clerkId.
export const upsertFromClerk = mutation({
  args: {
    clerkId: v.string(),
    email: v.string(),
    firstName: v.optional(v.string()),
    lastName: v.optional(v.string()),
    imageUrl: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const existing = await ctx.db
      .query('users')
      .withIndex('by_clerkId', (q) => q.eq('clerkId', args.clerkId))
      .unique()

    if (existing) {
      await ctx.db.patch(existing._id, { ...args, updatedAt: Date.now() })
      return existing._id
    }

    const now = Date.now()
    return await ctx.db.insert('users', {
      ...args,
      role: 'customer',
      status: 'active',
      createdAt: now,
      updatedAt: now,
    })
  },
})

export const getByClerkId = query({
  args: { clerkId: v.string() },
  handler: async (ctx, args) =>
    ctx.db.query('users').withIndex('by_clerkId', (q) => q.eq('clerkId', args.clerkId)).unique(),
})

// ── Admin: customer management ─────────────────────────────────────────────

export const list = query({
  args: { search: v.optional(v.string()) },
  handler: async (ctx, args) => {
    let all = await ctx.db.query('users').collect()
    if (args.search) {
      const term = args.search.toLowerCase()
      all = all.filter(
        (u) =>
          u.email.toLowerCase().includes(term) ||
          `${u.firstName ?? ''} ${u.lastName ?? ''}`.toLowerCase().includes(term)
      )
    }
    return all
  },
})

export const setStatus = mutation({
  args: { id: v.id('users'), status: v.union(v.literal('active'), v.literal('suspended')) },
  handler: async (ctx, args) => {
    await ctx.db.patch(args.id, { status: args.status, updatedAt: Date.now() })
  },
})

export const remove = mutation({
  args: { id: v.id('users') },
  handler: async (ctx, args) => ctx.db.delete(args.id),
})
