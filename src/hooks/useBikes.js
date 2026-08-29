import { useQuery, useMutation } from 'convex/react'
import { api } from '../../convex/_generated/api'
import { convex } from '@/lib/convexClient'
import { ALL_BIKES } from '@/constants/mockBikes'

function normalizeBike(b) {
  if (!b) return null
  if (!b._id) return b // already mock-shaped
  const STATUS_LABEL = { available: 'In Stock', reserved: 'Reserved', sold: 'Sold' }
  return {
    id: b._id,
    brand: b.brand,
    model: b.model,
    year: b.year,
    mileage: b.mileage,
    engineCapacity: b.engineCapacity,
    bikeType: b.bikeType,
    transmission: b.transmission,
    condition: b.condition,
    color: b.color,
    description: b.description,
    features: b.features ?? [],
    images: b.images ?? [],
    image: b.images?.[0],
    featured: b.featured,
    availability: STATUS_LABEL[b.status] ?? b.status,
    rating: b.ratingAvg ?? 0,
    ratingCount: b.ratingCount ?? 0,
    dealerName: b.dealerName,
    dealerLocation: b.dealerLocation,
  }
}

export function useBikeList() {
  const result = convex ? useQuery(api.bikes.list, {}) : undefined
  if (convex) {
    return { bikes: (result ?? []).map(normalizeBike), isLoading: result === undefined }
  }
  return { bikes: ALL_BIKES, isLoading: false }
}

export function useFeaturedBikes() {
  const result = convex ? useQuery(api.bikes.getFeatured) : undefined
  if (convex) {
    return { bikes: (result ?? []).map(normalizeBike), isLoading: result === undefined }
  }
  return { bikes: ALL_BIKES.filter((b) => b.featured), isLoading: false }
}

export function useBike(id) {
  const result = convex ? useQuery(api.bikes.getById, id ? { id } : 'skip') : undefined
  if (convex) {
    return { bike: normalizeBike(result), isLoading: result === undefined }
  }
  return { bike: ALL_BIKES.find((b) => b.id === id) ?? null, isLoading: false }
}

export function useRelatedBikes(bike) {
  const canQuery = Boolean(bike?.id && bike?.bikeType)
  const result = convex
    ? useQuery(api.bikes.getRelated, canQuery ? { id: bike.id, bikeType: bike.bikeType } : 'skip')
    : undefined
  if (convex) {
    return { bikes: (result ?? []).map(normalizeBike), isLoading: canQuery && result === undefined }
  }
  const list = ALL_BIKES.filter((b) => b.bikeType === bike?.bikeType && b.id !== bike?.id).slice(0, 4)
  return { bikes: list, isLoading: false }
}

export function useBikeAdmin() {
  const createBike = convex ? useMutation(api.bikes.create) : null
  const updateBike = convex ? useMutation(api.bikes.update) : null
  const removeBike = convex ? useMutation(api.bikes.remove) : null
  const setFeatured = convex ? useMutation(api.bikes.setFeatured) : null
  return { createBike, updateBike, removeBike, setFeatured, isConnected: Boolean(convex) }
}
