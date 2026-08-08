import { query, mutation } from './_generated/server'
import { v } from 'convex/values'

export const getWishlist = query({
  args: { userId: v.id('users') },
  handler: async (ctx, args) => {
    const items = await ctx.db.query('wishlist').withIndex('by_user', (q) => q.eq('userId', args.userId)).collect()
    return Promise.all(items.map(async (item) => ({ ...item, vehicle: await ctx.db.get(item.vehicleId) })))
  },
})

export const toggle = mutation({
  args: { userId: v.id('users'), vehicleId: v.id('vehicles') },
  handler: async (ctx, args) => {
    const existing = await ctx.db
      .query('wishlist')
      .withIndex('by_user_and_vehicle', (q) => q.eq('userId', args.userId).eq('vehicleId', args.vehicleId))
      .unique()

    if (existing) {
      await ctx.db.delete(existing._id)
      return { wishlisted: false }
    }

    await ctx.db.insert('wishlist', { userId: args.userId, vehicleId: args.vehicleId, createdAt: Date.now() })
    return { wishlisted: true }
  },
})

export const remove = mutation({
  args: { id: v.id('wishlist') },
  handler: async (ctx, args) => ctx.db.delete(args.id),
})
