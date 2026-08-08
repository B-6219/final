import { useState } from 'react'
import { useQuery, useMutation } from 'convex/react'
import { api } from '../../convex/_generated/api'
import { convex } from '@/lib/convexClient'
import { useCurrentUser } from '@/hooks/useCurrentUser'

const MOCK_REVIEWS = [
  { id: 'r1', user: { firstName: 'Amara', lastName: 'Chen' }, rating: 5, title: 'Exceptional condition', comment: 'Exactly as described — inspection report matched the car perfectly. Delivery was smooth.', createdAt: Date.now() - 86400000 * 6 },
  { id: 'r2', user: { firstName: 'David', lastName: 'Otieno' }, rating: 4, title: 'Great buying experience', comment: 'Very responsive dealer, minor delay on paperwork but the car itself is fantastic.', createdAt: Date.now() - 86400000 * 18 },
]

export function useReviews(vehicleId) {
  const { convexUser, isSignedIn } = useCurrentUser()
  const raw = convex ? useQuery(api.reviews.listForVehicle, vehicleId ? { vehicleId } : 'skip') : undefined
  const createMut = convex ? useMutation(api.reviews.create) : null
  const updateMut = convex ? useMutation(api.reviews.update) : null
  const removeMut = convex ? useMutation(api.reviews.remove) : null

  const [mockReviews, setMockReviews] = useState(MOCK_REVIEWS)

  if (convex) {
    const reviews = (raw ?? []).map((r) => ({
      id: r._id,
      user: r.user,
      rating: r.rating,
      title: r.title,
      comment: r.comment,
      createdAt: r.createdAt,
    }))
    return {
      reviews,
      isLoading: Boolean(vehicleId) && raw === undefined,
      isConnected: true,
      canReview: isSignedIn,
      addReview: ({ rating, title, comment }) =>
        createMut({ userId: convexUser._id, vehicleId, rating, title, comment }),
      removeReview: (id) => removeMut({ id }),
    }
  }

  return {
    reviews: mockReviews,
    isLoading: false,
    isConnected: false,
    canReview: true,
    addReview: ({ rating, title, comment }) =>
      setMockReviews((prev) => [
        { id: `r${prev.length + 1}`, user: { firstName: 'You' }, rating, title, comment, createdAt: Date.now() },
        ...prev,
      ]),
    removeReview: (id) => setMockReviews((prev) => prev.filter((r) => r.id !== id)),
  }
}
