import { useQuery, useMutation } from 'convex/react'
import { api } from '../../convex/_generated/api'
import { convex } from '@/lib/convexClient'
import { useBrands, useCategories } from '@/hooks/useTaxonomy'
import { normalizeVehicle, normalizeVehicles, keyById } from '@/lib/normalizers'
import { ALL_VEHICLES, FEATURED_VEHICLES } from '@/constants/mockVehicles'

/** Full catalog — used by Shop, which does its own client-side filter/sort
 * over the result either way, so no filter args are passed through here. */
export function useVehicleList() {
  const { brands } = useBrands()
  const { categories } = useCategories()
  const result = convex ? useQuery(api.vehicles.list, {}) : undefined

  if (convex) {
    return {
      vehicles: normalizeVehicles(result, keyById(brands), keyById(categories)),
      isLoading: result === undefined,
    }
  }
  return { vehicles: ALL_VEHICLES, isLoading: false }
}

export function useFeaturedVehicles() {
  const { brands } = useBrands()
  const { categories } = useCategories()
  const result = convex ? useQuery(api.vehicles.getFeatured) : undefined

  if (convex) {
    return {
      vehicles: normalizeVehicles(result, keyById(brands), keyById(categories)),
      isLoading: result === undefined,
    }
  }
  return { vehicles: FEATURED_VEHICLES, isLoading: false }
}

export function useVehicle(id) {
  const { brands } = useBrands()
  const { categories } = useCategories()
  const result = convex ? useQuery(api.vehicles.getById, id ? { id } : 'skip') : undefined

  if (convex) {
    return {
      vehicle: normalizeVehicle(result, keyById(brands), keyById(categories)),
      isLoading: result === undefined,
    }
  }
  return { vehicle: ALL_VEHICLES.find((v) => v.id === id) ?? null, isLoading: false }
}

export function useRelatedVehicles(vehicle) {
  const { brands } = useBrands()
  const { categories } = useCategories()
  const canQuery = Boolean(vehicle?.id && vehicle?.categoryId)
  const result = convex
    ? useQuery(api.vehicles.getRelated, canQuery ? { id: vehicle.id, categoryId: vehicle.categoryId } : 'skip')
    : undefined

  if (convex) {
    return {
      vehicles: normalizeVehicles(result, keyById(brands), keyById(categories)),
      isLoading: canQuery && result === undefined,
    }
  }
  const list = ALL_VEHICLES.filter((v) => v.category === vehicle?.category && v.id !== vehicle?.id).slice(0, 4)
  return { vehicles: list, isLoading: false }
}

/** Admin CRUD — only meaningful once Convex is connected; callers should
 * keep their own optimistic local state as a UI-layer fallback otherwise
 * (see AdminDashboard, which already does this). */
export function useVehicleAdmin() {
  const createVehicle = convex ? useMutation(api.vehicles.create) : null
  const updateVehicle = convex ? useMutation(api.vehicles.update) : null
  const removeVehicle = convex ? useMutation(api.vehicles.remove) : null
  const setFeatured = convex ? useMutation(api.vehicles.setFeatured) : null

  return { createVehicle, updateVehicle, removeVehicle, setFeatured, isConnected: Boolean(convex) }
}
