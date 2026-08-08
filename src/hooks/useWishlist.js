import { useState } from 'react'
import { useQuery, useMutation } from 'convex/react'
import { api } from '../../convex/_generated/api'
import { convex } from '@/lib/convexClient'
import { useCurrentUser } from '@/hooks/useCurrentUser'
import { normalizeVehicle } from '@/lib/normalizers'
import { ALL_VEHICLES } from '@/constants/mockVehicles'

export function useWishlist() {
  const { convexUser, isSignedIn } = useCurrentUser()
  const canQuery = Boolean(convex && isSignedIn && convexUser)

  const raw = convex ? useQuery(api.wishlist.getWishlist, canQuery ? { userId: convexUser._id } : 'skip') : undefined
  const toggleMut = convex ? useMutation(api.wishlist.toggle) : null
  const removeMut = convex ? useMutation(api.wishlist.remove) : null

  const [mockItems, setMockItems] = useState(() => ALL_VEHICLES.slice(2, 6))

  if (convex && canQuery) {
    const items = (raw ?? []).map((item) => ({ wishlistId: item._id, vehicle: normalizeVehicle(item.vehicle) }))
    const vehicleIds = new Set(items.map((i) => i.vehicle?.id))

    return {
      items,
      isLoading: raw === undefined,
      isConnected: true,
      has: (vehicleId) => vehicleIds.has(vehicleId),
      toggle: (vehicleId) => toggleMut({ userId: convexUser._id, vehicleId }),
      remove: (wishlistId) => removeMut({ id: wishlistId }),
    }
  }

  const vehicleIds = new Set(mockItems.map((v) => v.id))
  return {
    items: mockItems.map((v) => ({ wishlistId: v.id, vehicle: v })),
    isLoading: false,
    isConnected: false,
    has: (vehicleId) => vehicleIds.has(vehicleId),
    toggle: (vehicleId) => {
      const vehicle = ALL_VEHICLES.find((v) => v.id === vehicleId)
      setMockItems((prev) =>
        prev.some((v) => v.id === vehicleId) ? prev.filter((v) => v.id !== vehicleId) : vehicle ? [...prev, vehicle] : prev
      )
    },
    remove: (vehicleId) => setMockItems((prev) => prev.filter((v) => v.id !== vehicleId)),
  }
}
