import { query, mutation } from './_generated/server'
import { v } from 'convex/values'

export const listForVehicle = query({
  args: { vehicleId: v.id('vehicles') },
  handler: async (ctx, args) => {
    const reviews = await ctx.db.query('reviews').withIndex('by_vehicle', (q) => q.eq('vehicleId', args.vehicleId)).collect()
    return Promise.all(reviews.map(async (r) => ({ ...r, user: await ctx.db.get(r.userId) })))
  },
})

export const create = mutation({
  args: { userId: v.id('users'), vehicleId: v.id('vehicles'), rating: v.number(), title: v.optional(v.string()), comment: v.string() },
  handler: async (ctx, args) => {
    const now = Date.now()
    const id = await ctx.db.insert('reviews', { ...args, createdAt: now, updatedAt: now })

    // Recalculate the vehicle's aggregate rating
    const all = await ctx.db.query('reviews').withIndex('by_vehicle', (q) => q.eq('vehicleId', args.vehicleId)).collect()
    const avg = all.reduce((sum, r) => sum + r.rating, 0) / all.length
    await ctx.db.patch(args.vehicleId, { ratingAvg: avg, ratingCount: all.length })

    return id
  },
})

export const update = mutation({
  args: { id: v.id('reviews'), rating: v.number(), title: v.optional(v.string()), comment: v.string() },
  handler: async (ctx, args) => {
    await ctx.db.patch(args.id, { rating: args.rating, title: args.title, comment: args.comment, updatedAt: Date.now() })
  },
})

export const remove = mutation({
  args: { id: v.id('reviews') },
  handler: async (ctx, args) => ctx.db.delete(args.id),
})
