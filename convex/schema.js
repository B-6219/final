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
    price: v.optional(v.number()), // internal reference only — never shown to customers; WhatsApp handles pricing
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

  // ── Bikes ──────────────────────────────────────────────────────────────
  // Separate catalog from vehicles — mirrors its structure but with
  // motorcycle-specific fields (engine cc, bike type) in place of
  // fuelType/transmission. Brand is a free-text field here rather than a
  // brands-table reference, since car and bike brands don't overlap much
  // and this keeps the admin form simple.
  bikes: defineTable({
    brand: v.string(),
    model: v.string(),
    year: v.number(),
    price: v.optional(v.number()), // internal reference only — never shown to customers
    mileage: v.number(),
    engineCapacity: v.number(), // cc
    bikeType: v.union(
      v.literal('Sport'), v.literal('Cruiser'), v.literal('Naked'),
      v.literal('Touring'), v.literal('Scooter'), v.literal('Off-Road')
    ),
    transmission: v.union(v.literal('Manual'), v.literal('Automatic'), v.literal('Semi-Automatic')),
    condition: v.union(v.literal('New'), v.literal('Used'), v.literal('Certified Pre-Owned')),
    color: v.string(),
    description: v.string(),
    features: v.array(v.string()),
    images: v.array(v.string()),
    featured: v.boolean(),
    status: v.union(v.literal('available'), v.literal('sold'), v.literal('reserved')),
    dealerName: v.optional(v.string()),
    dealerLocation: v.optional(v.string()),
    ratingAvg: v.number(),
    ratingCount: v.number(),
    createdAt: v.number(),
    updatedAt: v.number(),
  })
    .index('by_status', ['status'])
    .index('by_featured', ['featured'])
    .index('by_type', ['bikeType']),

  // ── Ratings ────────────────────────────────────────────────────────────
  // Multi-category breakdown (Engine, Comfort, Exterior, Value for Money,
  // etc.) per listing, on top of the single ratingAvg/ratingCount already
  // on vehicles/bikes — this is what lets each car show a distinct,
  // specific rating profile instead of one generic number. itemType +
  // itemId is a loose polymorphic reference (itemId stored as a plain
  // string) since Convex ids are table-typed and this needs to point at
  // either vehicles or bikes.
  ratings: defineTable({
    itemType: v.union(v.literal('vehicle'), v.literal('bike')),
    itemId: v.string(),
    category: v.string(), // e.g. "Engine", "Comfort", "Exterior", "Value for Money"
    score: v.number(), // 1–5
    createdAt: v.number(),
  }).index('by_item', ['itemType', 'itemId']),

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

  // ── Wishlist ───────────────────────────────────────────────────────────
  wishlist: defineTable({
    userId: v.id('users'),
    vehicleId: v.id('vehicles'),
    createdAt: v.number(),
  })
    .index('by_user', ['userId'])
    .index('by_user_and_vehicle', ['userId', 'vehicleId']),

  // ── Orders ─────────────────────────────────────────────────────────────
  // Kept for the dealership's internal record-keeping (admin can track a
  // sale after it's negotiated over WhatsApp) even though there's no
  // in-app checkout anymore — payment integrations were removed, so
  // paymentMethod/paymentStatus are informational only.
  orders: defineTable({
    userId: v.id('users'),
    addressId: v.optional(v.id('addresses')),
    items: v.array(
      v.object({
        vehicleId: v.id('vehicles'),
        price: v.optional(v.number()),
        quantity: v.number(),
      })
    ),
    subtotal: v.optional(v.number()),
    tax: v.optional(v.number()),
    shipping: v.optional(v.number()),
    discount: v.optional(v.number()),
    total: v.optional(v.number()),
    couponCode: v.optional(v.string()),
    paymentMethod: v.optional(v.string()), // e.g. "cash", "bank transfer" — recorded manually by admin
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
