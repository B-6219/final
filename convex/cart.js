import { query, mutation } from './_generated/server'
import { v } from 'convex/values'

export const getCart = query({
  args: { userId: v.id('users') },
  handler: async (ctx, args) => {
    const items = await ctx.db.query('cart').withIndex('by_user', (q) => q.eq('userId', args.userId)).collect()
    const withVehicles = await Promise.all(
      items.map(async (item) => ({ ...item, vehicle: await ctx.db.get(item.vehicleId) }))
    )
    return withVehicles
  },
})

export const addItem = mutation({
  args: { userId: v.id('users'), vehicleId: v.id('vehicles'), quantity: v.optional(v.number()) },
  handler: async (ctx, args) => {
    const existing = await ctx.db
      .query('cart')
      .withIndex('by_user_and_vehicle', (q) => q.eq('userId', args.userId).eq('vehicleId', args.vehicleId))
      .unique()

    if (existing) {
      await ctx.db.patch(existing._id, {
        quantity: existing.quantity + (args.quantity ?? 1),
        updatedAt: Date.now(),
      })
      return existing._id
    }

    const now = Date.now()
    return await ctx.db.insert('cart', {
      userId: args.userId,
      vehicleId: args.vehicleId,
      quantity: args.quantity ?? 1,
      savedForLater: false,
      createdAt: now,
      updatedAt: now,
    })
  },
})

export const updateQuantity = mutation({
  args: { id: v.id('cart'), quantity: v.number() },
  handler: async (ctx, args) => {
    await ctx.db.patch(args.id, { quantity: args.quantity, updatedAt: Date.now() })
  },
})

export const toggleSavedForLater = mutation({
  args: { id: v.id('cart'), savedForLater: v.boolean() },
  handler: async (ctx, args) => {
    await ctx.db.patch(args.id, { savedForLater: args.savedForLater, updatedAt: Date.now() })
  },
})

export const removeItem = mutation({
  args: { id: v.id('cart') },
  handler: async (ctx, args) => ctx.db.delete(args.id),
})

export const clearCart = mutation({
  args: { userId: v.id('users') },
  handler: async (ctx, args) => {
    const items = await ctx.db.query('cart').withIndex('by_user', (q) => q.eq('userId', args.userId)).collect()
    await Promise.all(items.map((item) => ctx.db.delete(item._id)))
  },
})
