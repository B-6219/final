import { useState } from 'react'
import { useQuery, useMutation } from 'convex/react'
import { api } from '../../convex/_generated/api'
import { convex } from '@/lib/convexClient'
import { useCurrentUser } from '@/hooks/useCurrentUser'
import { normalizeVehicle } from '@/lib/normalizers'
import { ALL_VEHICLES } from '@/constants/mockVehicles'

/**
 * Returns { items, isLoading, isConnected, addItem, updateQuantity,
 * toggleSavedForLater, removeItem, clearCart }.
 *
 * `items` is always shaped as [{ id, quantity, savedForLater, vehicle }]
 * regardless of source, where `vehicle` is already normalized to the flat
 * shape VehicleCard/Cart expect.
 *
 * Falls back to component-local state (seeded from mock vehicles) when
 * Convex/Clerk aren't connected yet, so Cart still works during setup.
 */
export function useCart() {
  const { convexUser, isSignedIn } = useCurrentUser()
  const canQuery = Boolean(convex && isSignedIn && convexUser)

  const raw = convex ? useQuery(api.cart.getCart, canQuery ? { userId: convexUser._id } : 'skip') : undefined
  const addItemMut = convex ? useMutation(api.cart.addItem) : null
  const updateQuantityMut = convex ? useMutation(api.cart.updateQuantity) : null
  const toggleSavedMut = convex ? useMutation(api.cart.toggleSavedForLater) : null
  const removeItemMut = convex ? useMutation(api.cart.removeItem) : null
  const clearCartMut = convex ? useMutation(api.cart.clearCart) : null

  const [mockItems, setMockItems] = useState(() =>
    ALL_VEHICLES.slice(0, 2).map((v) => ({ id: v.id, quantity: 1, savedForLater: false, vehicle: v }))
  )

  if (convex && canQuery) {
    const items = (raw ?? []).map((item) => ({
      id: item._id,
      quantity: item.quantity,
      savedForLater: item.savedForLater,
      vehicle: normalizeVehicle(item.vehicle),
    }))

    return {
      items,
      isLoading: raw === undefined,
      isConnected: true,
      addItem: (vehicleId, quantity = 1) => addItemMut({ userId: convexUser._id, vehicleId, quantity }),
      updateQuantity: (id, quantity) => updateQuantityMut({ id, quantity }),
      toggleSavedForLater: (id, savedForLater) => toggleSavedMut({ id, savedForLater }),
      removeItem: (id) => removeItemMut({ id }),
      clearCart: () => clearCartMut({ userId: convexUser._id }),
    }
  }

  // Mock fallback — local optimistic state only.
  return {
    items: mockItems,
    isLoading: false,
    isConnected: false,
    addItem: (vehicleId) => {
      const vehicle = ALL_VEHICLES.find((v) => v.id === vehicleId)
      if (!vehicle) return
      setMockItems((prev) =>
        prev.some((i) => i.id === vehicleId)
          ? prev.map((i) => (i.id === vehicleId ? { ...i, quantity: i.quantity + 1 } : i))
          : [...prev, { id: vehicleId, quantity: 1, savedForLater: false, vehicle }]
      )
    },
    updateQuantity: (id, quantity) =>
      setMockItems((prev) => prev.map((i) => (i.id === id ? { ...i, quantity } : i))),
    toggleSavedForLater: (id, savedForLater) =>
      setMockItems((prev) => prev.map((i) => (i.id === id ? { ...i, savedForLater } : i))),
    removeItem: (id) => setMockItems((prev) => prev.filter((i) => i.id !== id)),
    clearCart: () => setMockItems([]),
  }
}
