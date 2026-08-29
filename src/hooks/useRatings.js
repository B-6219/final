import { useMutation, useQuery } from 'convex/react'
import { api } from '../../convex/_generated/api'
import { convex } from '@/lib/convexClient'

export const RATING_CATEGORIES = ['Engine', 'Comfort', 'Exterior', 'Value for Money']

// Small deterministic hash so mock ratings are stable across renders but
// genuinely different per item+category — this is what makes "each car has
// different ratings" true even before Convex is connected.
function pseudoScore(seed) {
  let hash = 0
  for (let i = 0; i < seed.length; i++) {
    hash = (hash * 31 + seed.charCodeAt(i)) >>> 0
  }
  // Map to a 3.4–5.0 range, one decimal place — plausible dealership ratings.
  return Math.round((3.4 + (hash % 17) / 10) * 10) / 10
}

function mockSummary(itemId) {
  const breakdown = RATING_CATEGORIES.map((category) => ({
    category,
    score: pseudoScore(`${itemId}-${category}`),
  }))
  const overall = breakdown.reduce((sum, b) => sum + b.score, 0) / breakdown.length
  return { overall: Math.round(overall * 10) / 10, breakdown }
}

/** Returns { overall, breakdown, isLoading }. `itemType` is 'vehicle' | 'bike'. */
export function useRatings(itemType, itemId) {
  const result = convex
    ? useQuery(api.ratings.summaryForItem, itemId ? { itemType, itemId } : 'skip')
    : undefined

  if (convex) {
    return {
      overall: result?.overall ?? 0,
      breakdown: result?.breakdown ?? [],
      isLoading: Boolean(itemId) && result === undefined,
    }
  }
  return { ...mockSummary(itemId ?? 'default'), isLoading: false }
}

/** Admin-only: set/update one category's score for an item. */
export function useSetRating() {
  const setRatingMut = convex ? useMutation(api.ratings.setRating) : null
  return async ({ itemType, itemId, category, score }) => {
    if (!setRatingMut) return
    return setRatingMut({ itemType, itemId, category, score })
  }
}
