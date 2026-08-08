import { query, mutation } from './_generated/server'
import { v } from 'convex/values'

export const listForUser = query({
  args: { userId: v.id('users') },
  handler: async (ctx, args) => {
    const items = await ctx.db
      .query('recentlyViewed')
      .withIndex('by_user', (q) => q.eq('userId', args.userId))
      .order('desc')
      .take(12)
    return Promise.all(items.map(async (item) => ({ ...item, vehicle: await ctx.db.get(item.vehicleId) })))
  },
})

// Upserts a "viewed" record — called when a user opens a Vehicle Details page.
export const record = mutation({
  args: { userId: v.id('users'), vehicleId: v.id('vehicles') },
  handler: async (ctx, args) => {
    const existing = await ctx.db
      .query('recentlyViewed')
      .withIndex('by_user_and_vehicle', (q) => q.eq('userId', args.userId).eq('vehicleId', args.vehicleId))
      .unique()

    if (existing) {
      await ctx.db.patch(existing._id, { viewedAt: Date.now() })
      return existing._id
    }

    return await ctx.db.insert('recentlyViewed', { userId: args.userId, vehicleId: args.vehicleId, viewedAt: Date.now() })
  },
})
