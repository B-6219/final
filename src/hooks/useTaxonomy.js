import { useQuery } from 'convex/react'
import { api } from '../../convex/_generated/api'
import { convex } from '@/lib/convexClient'
import { BRANDS, CATEGORIES } from '@/constants/mockVehicles'

/** Returns [{ _id, name, slug, ... }] from Convex, or mock brand names
 * wrapped in the same shape, so callers never need to branch. */
export function useBrands() {
  const result = convex ? useQuery(api.brands.list) : undefined

  if (convex) {
    return { brands: result ?? [], isLoading: result === undefined }
  }
  return {
    brands: BRANDS.map((name, i) => ({ _id: `mock-brand-${i}`, name, slug: name.toLowerCase().replace(/\s+/g, '-') })),
    isLoading: false,
  }
}

export function useCategories() {
  const result = convex ? useQuery(api.categories.list) : undefined

  if (convex) {
    return { categories: result ?? [], isLoading: result === undefined }
  }
  return {
    categories: CATEGORIES.map((c, i) => ({
      _id: `mock-cat-${i}`,
      name: c.name,
      slug: c.name.toLowerCase().replace(/\s+/g, '-'),
      count: c.count,
    })),
    isLoading: false,
  }
}
