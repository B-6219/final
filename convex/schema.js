import { defineSchema, defineTable } from 'convex/server'
import { v } from 'convex/values'

export default defineSchema({
  // ── Users ──────────────────────────────────────────────────────────────
  // Mirrors the Clerk user. `clerkId` links the two; role drives admin access.
  users: defineTable({
    clerkId: v.string(),
    email: v.string(),
    firstName: v.optional(v.string()),
    lastName: v.optional(v.string()),
    imageUrl: v.optional(v.string()),
    phone: v.optional(v.string()),
    role: v.union(v.literal('customer'), v.literal('admin')),
    status: v.union(v.literal('active'), v.literal('suspended')),
    createdAt: v.number(),
    updatedAt: v.number(),
  })
    .index('by_clerkId', ['clerkId'])
    .index('by_email', ['email'])
    .index('by_role', ['role']),

  // ── Brands ─────────────────────────────────────────────────────────────
  brands: defineTable({
    name: v.string(),
    slug: v.string(),
    logoUrl: v.optional(v.string()),
    description: v.optional(v.string()),
    createdAt: v.number(),
    updatedAt: v.number(),
  }).index('by_slug', ['slug']),

  // ── Categories ─────────────────────────────────────────────────────────
  categories: defineTable({
    name: v.string(),
    slug: v.string(),
    description: v.optional(v.string()),
    imageUrl: v.optional(v.string()),
    createdAt: v.number(),
    updatedAt: v.number(),
  }).index('by_slug', ['slug']),

  // ── Vehicles ───────────────────────────────────────────────────────────
  vehicles: defineTable({
    brandId: v.id('brands'),
    categoryId: v.id('categories'),
    model: v.string(),
    year: v.number(),
    price: v.number(),
    mileage: v.number(),
    fuelType: v.union(v.literal('Petrol'), v.literal('Diesel'), v.literal('Electric'), v.literal('Hybrid')),
    transmission: v.union(v.literal('Automatic'), v.literal('Manual'), v.literal('PDK'), v.literal('CVT')),
    condition: v.union(v.literal('New'), v.literal('Used'), v.literal('Certified Pre-Owned')),
    color: v.string(),
    vin: v.optional(v.string()),
    description: v.string(),
    features: v.array(v.string()),
    images: v.array(v.string()), // Cloudinary URLs
    stock: v.number(),
    featured: v.boolean(),
    status: v.union(v.literal('available'), v.literal('sold'), v.literal('reserved')),
    dealerName: v.optional(v.string()),
    dealerLocation: v.optional(v.string()),
    ratingAvg: v.number(),
    ratingCount: v.number(),
    createdAt: v.number(),
    updatedAt: v.number(),
  })
    .index('by_brand', ['brandId'])
    .index('by_category', ['categoryId'])
    .index('by_status', ['status'])
    .index('by_featured', ['featured'])
    .index('by_price', ['price'])
    .index('by_year', ['year']),

  // ── Addresses ──────────────────────────────────────────────────────────
  addresses: defineTable({
    userId: v.id('users'),
    label: v.optional(v.string()), // "Home", "Office"
    fullName: v.string(),
    line1: v.string(),
    line2: v.optional(v.string()),
    city: v.string(),
    state: v.optional(v.string()),
    postalCode: v.string(),
    country: v.string(),
    phone: v.string(),
    isDefault: v.boolean(),
    createdAt: v.number(),
    updatedAt: v.number(),
  }).index('by_user', ['userId']),

  // ── Cart ───────────────────────────────────────────────────────────────
  cart: defineTable({
    userId: v.id('users'),
    vehicleId: v.id('vehicles'),
    quantity: v.number(),
    savedForLater: v.boolean(),
    createdAt: v.number(),
    updatedAt: v.number(),
  })
    .index('by_user', ['userId'])
    .index('by_user_and_vehicle', ['userId', 'vehicleId']),

  // ── Wishlist ───────────────────────────────────────────────────────────
  wishlist: defineTable({
    userId: v.id('users'),
    vehicleId: v.id('vehicles'),
    createdAt: v.number(),
  })
    .index('by_user', ['userId'])
    .index('by_user_and_vehicle', ['userId', 'vehicleId']),

  // ── Orders ─────────────────────────────────────────────────────────────
  orders: defineTable({
    userId: v.id('users'),
    addressId: v.id('addresses'),
    items: v.array(
      v.object({
        vehicleId: v.id('vehicles'),
        price: v.number(),
        quantity: v.number(),
      })
    ),
    subtotal: v.number(),
    tax: v.number(),
    shipping: v.number(),
    discount: v.number(),
    total: v.number(),
    couponCode: v.optional(v.string()),
    paymentMethod: v.union(v.literal('stripe'), v.literal('mpesa')),
    paymentStatus: v.union(v.literal('pending'), v.literal('paid'), v.literal('failed'), v.literal('refunded')),
    orderStatus: v.union(
      v.literal('processing'),
      v.literal('confirmed'),
      v.literal('out_for_delivery'),
      v.literal('delivered'),
      v.literal('cancelled')
    ),
    createdAt: v.number(),
    updatedAt: v.number(),
  })
    .index('by_user', ['userId'])
    .index('by_status', ['orderStatus']),

  // ── Reviews ────────────────────────────────────────────────────────────
  reviews: defineTable({
    userId: v.id('users'),
    vehicleId: v.id('vehicles'),
    rating: v.number(), // 1–5
    title: v.optional(v.string()),
    comment: v.string(),
    createdAt: v.number(),
    updatedAt: v.number(),
  })
    .index('by_vehicle', ['vehicleId'])
    .index('by_user', ['userId'])
    .index('by_user_and_vehicle', ['userId', 'vehicleId']),

  // ── Coupons ────────────────────────────────────────────────────────────
  coupons: defineTable({
    code: v.string(),
    type: v.union(v.literal('percentage'), v.literal('fixed')),
    value: v.number(),
    minSpend: v.optional(v.number()),
    expiresAt: v.optional(v.number()),
    active: v.boolean(),
    usageLimit: v.optional(v.number()),
    usedCount: v.number(),
    createdAt: v.number(),
    updatedAt: v.number(),
  }).index('by_code', ['code']),

  // ── Notifications ──────────────────────────────────────────────────────
  notifications: defineTable({
    userId: v.id('users'),
    type: v.union(
      v.literal('order_update'),
      v.literal('price_drop'),
      v.literal('back_in_stock'),
      v.literal('system')
    ),
    title: v.string(),
    message: v.string(),
    read: v.boolean(),
    createdAt: v.number(),
  })
    .index('by_user', ['userId'])
    .index('by_user_and_read', ['userId', 'read']),

  // ── Recently Viewed ────────────────────────────────────────────────────
  recentlyViewed: defineTable({
    userId: v.id('users'),
    vehicleId: v.id('vehicles'),
    viewedAt: v.number(),
  })
    .index('by_user', ['userId'])
    .index('by_user_and_vehicle', ['userId', 'vehicleId']),
})
