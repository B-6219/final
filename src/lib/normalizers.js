// Convex vehicle rows use _id, brandId/categoryId references, an `images`
// array, `fuelType`, and a `status` enum. Mock data already matches the
// flat shape VehicleCard/VehicleDetails/etc. expect (id, brand, image,
// fuel, availability...). This normalizer converts the former into the
// latter so no component needs two code paths.
export function normalizeVehicle(v, brandsById = {}, categoriesById = {}) {
  if (!v) return null
  if (!v._id) return v // already mock-shaped — pass through unchanged

  const STATUS_LABEL = { available: 'In Stock', reserved: 'Reserved', sold: 'Sold' }

  return {
    id: v._id,
    brandId: v.brandId,
    brand: brandsById[v.brandId]?.name ?? 'Unknown',
    categoryId: v.categoryId,
    category: categoriesById[v.categoryId]?.name ?? 'Uncategorized',
    model: v.model,
    year: v.year,
    mileage: v.mileage,
    fuel: v.fuelType,
    transmission: v.transmission,
    condition: v.condition,
    color: v.color,
    vin: v.vin,
    price: v.price,
    stock: v.stock,
    description: v.description,
    features: v.features ?? [],
    images: v.images ?? [],
    image: v.images?.[0],
    featured: v.featured,
    availability: STATUS_LABEL[v.status] ?? v.status,
    status: v.status,
    rating: v.ratingAvg ?? 0,
    ratingCount: v.ratingCount ?? 0,
    dealerName: v.dealerName,
    dealerLocation: v.dealerLocation,
  }
}

export function normalizeVehicles(list, brandsById, categoriesById) {
  return (list ?? []).map((v) => normalizeVehicle(v, brandsById, categoriesById))
}

export function keyById(list) {
  return Object.fromEntries((list ?? []).map((item) => [item._id, item]))
}
