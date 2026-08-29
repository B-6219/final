import { query, mutation } from './_generated/server'
import { v } from 'convex/values'

export const list = query({
  args: {
    bikeType: v.optional(v.string()),
    condition: v.optional(v.string()),
    featuredOnly: v.optional(v.boolean()),
  },
  handler: async (ctx, args) => {
    let results = await ctx.db
      .query('bikes')
      .withIndex('by_status', (q) => q.eq('status', 'available'))
      .collect()

    if (args.bikeType) results = results.filter((b) => b.bikeType === args.bikeType)
    if (args.condition) results = results.filter((b) => b.condition === args.condition)
    if (args.featuredOnly) results = results.filter((b) => b.featured)

    results.sort((a, b) => b.createdAt - a.createdAt)
    return results
  },
})

export const getFeatured = query({
  args: {},
  handler: async (ctx) => {
    return await ctx.db
      .query('bikes')
      .withIndex('by_featured', (q) => q.eq('featured', true))
      .take(8)
  },
})

export const getById = query({
  args: { id: v.id('bikes') },
  handler: async (ctx, args) => ctx.db.get(args.id),
})

export const getRelated = query({
  args: { id: v.id('bikes'), bikeType: v.string() },
  handler: async (ctx, args) => {
    const results = await ctx.db
      .query('bikes')
      .withIndex('by_type', (q) => q.eq('bikeType', args.bikeType))
      .collect()
    return results.filter((b) => b._id !== args.id).slice(0, 4)
  },
})

export const search = query({
  args: { term: v.string() },
  handler: async (ctx, args) => {
    const term = args.term.toLowerCase()
    const all = await ctx.db.query('bikes').collect()
    return all.filter((b) => `${b.brand} ${b.model}`.toLowerCase().includes(term) || b.description.toLowerCase().includes(term))
  },
})

// ── Admin mutations ────────────────────────────────────────────────────────

export const create = mutation({
  args: {
    brand: v.string(),
    model: v.string(),
    year: v.number(),
    price: v.optional(v.number()),
    mileage: v.number(),
    engineCapacity: v.number(),
    bikeType: v.string(),
    transmission: v.string(),
    condition: v.string(),
    color: v.string(),
    description: v.string(),
    features: v.array(v.string()),
    images: v.array(v.string()),
    featured: v.boolean(),
    dealerName: v.optional(v.string()),
    dealerLocation: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const now = Date.now()
    return await ctx.db.insert('bikes', {
      ...args,
      status: 'available',
      ratingAvg: 0,
      ratingCount: 0,
      createdAt: now,
      updatedAt: now,
    })
  },
})

export const update = mutation({
  args: {
    id: v.id('bikes'),
    patch: v.record(v.string(), v.any()),
  },
  handler: async (ctx, args) => {
    await ctx.db.patch(args.id, { ...args.patch, updatedAt: Date.now() })
  },
})

export const remove = mutation({
  args: { id: v.id('bikes') },
  handler: async (ctx, args) => {
    await ctx.db.delete(args.id)
  },
})

export const setFeatured = mutation({
  args: { id: v.id('bikes'), featured: v.boolean() },
  handler: async (ctx, args) => {
    await ctx.db.patch(args.id, { featured: args.featured, updatedAt: Date.now() })
  },
})
