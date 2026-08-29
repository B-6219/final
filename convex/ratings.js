import { query, mutation } from './_generated/server'
import { v } from 'convex/values'

// The default category set new ratings use. Admin can rate any of these
// per listing; each score is independent, which is what makes two cars
// end up with genuinely different rating profiles instead of one shared
// number.
export const RATING_CATEGORIES = ['Engine', 'Comfort', 'Exterior', 'Value for Money']

export const listForItem = query({
  args: { itemType: v.union(v.literal('vehicle'), v.literal('bike')), itemId: v.string() },
  handler: async (ctx, args) => {
    return await ctx.db
      .query('ratings')
      .withIndex('by_item', (q) => q.eq('itemType', args.itemType).eq('itemId', args.itemId))
      .collect()
  },
})

// Returns { overall, breakdown: [{ category, score }] } — one score per
// category (most recent submission wins for that category), plus an
// overall average across categories.
export const summaryForItem = query({
  args: { itemType: v.union(v.literal('vehicle'), v.literal('bike')), itemId: v.string() },
  handler: async (ctx, args) => {
    const rows = await ctx.db
      .query('ratings')
      .withIndex('by_item', (q) => q.eq('itemType', args.itemType).eq('itemId', args.itemId))
      .collect()

    const latestByCategory = new Map()
    for (const row of rows) {
      const existing = latestByCategory.get(row.category)
      if (!existing || row.createdAt > existing.createdAt) latestByCategory.set(row.category, row)
    }

    const breakdown = Array.from(latestByCategory.values())
      .map((r) => ({ category: r.category, score: r.score }))
      .sort((a, b) => RATING_CATEGORIES.indexOf(a.category) - RATING_CATEGORIES.indexOf(b.category))

    const overall = breakdown.length
      ? breakdown.reduce((sum, b) => sum + b.score, 0) / breakdown.length
      : 0

    return { overall, breakdown }
  },
})

// Admin sets/updates a category score for a listing. Upserts by
// itemType+itemId+category so re-rating a category replaces it rather than
// piling up duplicate rows.
export const setRating = mutation({
  args: {
    itemType: v.union(v.literal('vehicle'), v.literal('bike')),
    itemId: v.string(),
    category: v.string(),
    score: v.number(),
  },
  handler: async (ctx, args) => {
    const existing = await ctx.db
      .query('ratings')
      .withIndex('by_item', (q) => q.eq('itemType', args.itemType).eq('itemId', args.itemId))
      .collect()

    const match = existing.find((r) => r.category === args.category)
    if (match) {
      await ctx.db.patch(match._id, { score: args.score, createdAt: Date.now() })
      return match._id
    }
    return await ctx.db.insert('ratings', { ...args, createdAt: Date.now() })
  },
})
