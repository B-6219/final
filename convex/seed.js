import { mutation } from './_generated/server'

// Dev convenience only — populates a handful of brands, categories, and
// vehicles so the Shop/Home pages have real data to query against.
// Run once from the Convex dashboard's "Functions" tab (or `npx convex run seed:run`)
// after your schema is deployed. Safe to re-run — it checks for existing data first.
export const run = mutation({
  args: {},
  handler: async (ctx) => {
    const existing = await ctx.db.query('brands').first()
    if (existing) return { skipped: true, reason: 'Data already seeded' }

    const now = Date.now()

    const brandNames = ['Mercedes-Benz', 'Porsche', 'BMW', 'Range Rover', 'Audi', 'Bentley', 'Ferrari', 'Lexus']
    const brandIds = {}
    for (const name of brandNames) {
      brandIds[name] = await ctx.db.insert('brands', {
        name,
        slug: name.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
        createdAt: now,
        updatedAt: now,
      })
    }

    const categoryNames = ['Sedans', 'SUVs', 'Coupes', 'Convertibles', 'Electric', 'Trucks']
    const categoryIds = {}
    for (const name of categoryNames) {
      categoryIds[name] = await ctx.db.insert('categories', {
        name,
        slug: name.toLowerCase(),
        createdAt: now,
        updatedAt: now,
      })
    }

    const vehicles = [
      { brand: 'Mercedes-Benz', model: 'G 63 AMG', category: 'SUVs', year: 2024, mileage: 1200, price: 189000, fuelType: 'Petrol', transmission: 'Automatic', featured: true },
      { brand: 'Porsche', model: '911 Turbo S', category: 'Coupes', year: 2023, mileage: 4500, price: 216000, fuelType: 'Petrol', transmission: 'PDK', featured: true },
      { brand: 'Range Rover', model: 'Autobiography', category: 'SUVs', year: 2024, mileage: 800, price: 142000, fuelType: 'Diesel', transmission: 'Automatic', featured: false },
      { brand: 'BMW', model: 'M4 Competition', category: 'Coupes', year: 2023, mileage: 6200, price: 98000, fuelType: 'Petrol', transmission: 'Automatic', featured: true },
    ]

    for (const veh of vehicles) {
      await ctx.db.insert('vehicles', {
        brandId: brandIds[veh.brand],
        categoryId: categoryIds[veh.category],
        model: veh.model,
        year: veh.year,
        price: veh.price,
        mileage: veh.mileage,
        fuelType: veh.fuelType,
        transmission: veh.transmission,
        condition: 'Used',
        color: 'Black',
        description: `A pristine ${veh.year} ${veh.brand} ${veh.model}, fully inspected and dealer-certified.`,
        features: ['Leather Interior', 'Adaptive Cruise Control', 'Panoramic Roof', 'Premium Sound System'],
        images: [],
        stock: 1,
        featured: veh.featured,
        status: 'available',
        ratingAvg: 4.8,
        ratingCount: 12,
        createdAt: now,
        updatedAt: now,
      })
    }

    return { skipped: false, brands: brandNames.length, categories: categoryNames.length, vehicles: vehicles.length }
  },
})
