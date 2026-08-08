import { query, mutation } from './_generated/server'
import { v } from 'convex/values'

// List vehicles with optional filters + sorting. Used by the Shop page.
export const list = query({
  args: {
    brandId: v.optional(v.id('brands')),
    categoryId: v.optional(v.id('categories')),
    minPrice: v.optional(v.number()),
    maxPrice: v.optional(v.number()),
    minYear: v.optional(v.number()),
    maxYear: v.optional(v.number()),
    fuelType: v.optional(v.string()),
    transmission: v.optional(v.string()),
    condition: v.optional(v.string()),
    featuredOnly: v.optional(v.boolean()),
    sortBy: v.optional(
      v.union(v.literal('price_asc'), v.literal('price_desc'), v.literal('newest'), v.literal('oldest'), v.literal('popular'))
    ),
  },
  handler: async (ctx, args) => {
    let results = await ctx.db
      .query('vehicles')
      .withIndex('by_status', (q) => q.eq('status', 'available'))
      .collect()

    if (args.brandId) results = results.filter((v) => v.brandId === args.brandId)
    if (args.categoryId) results = results.filter((v) => v.categoryId === args.categoryId)
    if (args.minPrice != null) results = results.filter((v) => v.price >= args.minPrice)
    if (args.maxPrice != null) results = results.filter((v) => v.price <= args.maxPrice)
    if (args.minYear != null) results = results.filter((v) => v.year >= args.minYear)
    if (args.maxYear != null) results = results.filter((v) => v.year <= args.maxYear)
    if (args.fuelType) results = results.filter((v) => v.fuelType === args.fuelType)
    if (args.transmission) results = results.filter((v) => v.transmission === args.transmission)
    if (args.condition) results = results.filter((v) => v.condition === args.condition)
    if (args.featuredOnly) results = results.filter((v) => v.featured)

    switch (args.sortBy) {
      case 'price_asc':
        results.sort((a, b) => a.price - b.price)
        break
      case 'price_desc':
        results.sort((a, b) => b.price - a.price)
        break
      case 'oldest':
        results.sort((a, b) => a.createdAt - b.createdAt)
        break
      case 'popular':
        results.sort((a, b) => b.ratingCount - a.ratingCount)
        break
      case 'newest':
      default:
        results.sort((a, b) => b.createdAt - a.createdAt)
    }

    return results
  },
})

export const getFeatured = query({
  args: {},
  handler: async (ctx) => {
    return await ctx.db
      .query('vehicles')
      .withIndex('by_featured', (q) => q.eq('featured', true))
      .take(8)
  },
})

export const getById = query({
  args: { id: v.id('vehicles') },
  handler: async (ctx, args) => ctx.db.get(args.id),
})

export const getRelated = query({
  args: { id: v.id('vehicles'), categoryId: v.id('categories') },
  handler: async (ctx, args) => {
    const results = await ctx.db
      .query('vehicles')
      .withIndex('by_category', (q) => q.eq('categoryId', args.categoryId))
      .collect()
    return results.filter((v) => v._id !== args.id).slice(0, 4)
  },
})

export const search = query({
  args: { term: v.string() },
  handler: async (ctx, args) => {
    const term = args.term.toLowerCase()
    const all = await ctx.db.query('vehicles').collect()
    return all.filter((v) => v.model.toLowerCase().includes(term) || v.description.toLowerCase().includes(term))
  },
})

// ── Admin mutations ────────────────────────────────────────────────────────

export const create = mutation({
  args: {
    brandId: v.id('brands'),
    categoryId: v.id('categories'),
    model: v.string(),
    year: v.number(),
    price: v.number(),
    mileage: v.number(),
    fuelType: v.string(),
    transmission: v.string(),
    condition: v.string(),
    color: v.string(),
    vin: v.optional(v.string()),
    description: v.string(),
    features: v.array(v.string()),
    images: v.array(v.string()),
    stock: v.number(),
    featured: v.boolean(),
    dealerName: v.optional(v.string()),
    dealerLocation: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const now = Date.now()
    return await ctx.db.insert('vehicles', {
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
    id: v.id('vehicles'),
    patch: v.record(v.string(), v.any()),
  },
  handler: async (ctx, args) => {
    await ctx.db.patch(args.id, { ...args.patch, updatedAt: Date.now() })
  },
})

export const remove = mutation({
  args: { id: v.id('vehicles') },
  handler: async (ctx, args) => {
    await ctx.db.delete(args.id)
  },
})

export const setFeatured = mutation({
  args: { id: v.id('vehicles'), featured: v.boolean() },
  handler: async (ctx, args) => {
    await ctx.db.patch(args.id, { featured: args.featured, updatedAt: Date.now() })
  },
})
