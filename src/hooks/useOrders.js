import { useState } from 'react'
import { useQuery, useMutation } from 'convex/react'
import { api } from '../../convex/_generated/api'
import { convex } from '@/lib/convexClient'
import { useCurrentUser } from '@/hooks/useCurrentUser'

const MOCK_ORDERS = [
  { id: '48213', createdAt: Date.now() - 86400000 * 3, itemsSummary: 'Porsche 911 Turbo S', itemCount: 1, status: 'confirmed', total: 216000 },
  { id: '48109', createdAt: Date.now() - 86400000 * 21, itemsSummary: 'BMW M4 Competition', itemCount: 1, status: 'delivered', total: 98000 },
]

/** Signed-in user's own order history — used on the Dashboard. */
export function useUserOrders() {
  const { convexUser, isSignedIn } = useCurrentUser()
  const canQuery = Boolean(convex && isSignedIn && convexUser)
  const raw = convex ? useQuery(api.orders.listForUser, canQuery ? { userId: convexUser._id } : 'skip') : undefined

  if (convex && canQuery) {
    const orders = (raw ?? []).map((o) => ({
      id: o._id,
      createdAt: o.createdAt,
      itemsSummary: `${o.items.length} vehicle${o.items.length !== 1 ? 's' : ''}`,
      itemCount: o.items.length,
      status: o.orderStatus,
      total: o.total,
    }))
    return { orders, isLoading: raw === undefined, isConnected: true }
  }

  return { orders: MOCK_ORDERS, isLoading: false, isConnected: false }
}

/** Places an order from a given cart-item shape + address + payment method.
 * Falls back to a fake order id when Convex isn't connected so the
 * Checkout confirmation step still works during setup. */
export function useCreateOrder() {
  const { convexUser } = useCurrentUser()
  const createMut = convex ? useMutation(api.orders.create) : null

  return async ({ items, addressId, subtotal, tax, shipping, discount, total, couponCode, paymentMethod }) => {
    if (convex && createMut && convexUser) {
      return await createMut({
        userId: convexUser._id,
        addressId,
        items,
        subtotal,
        tax,
        shipping,
        discount,
        total,
        couponCode,
        paymentMethod,
      })
    }
    // Mock fallback — just generate a plausible order id for the UI to show.
    return `CM-${Math.floor(100000 + Math.random() * 900000)}`
  }
}

/** Admin — all orders across every customer, with status updates. */
export function useAdminOrders() {
  const raw = convex ? useQuery(api.orders.listAll, {}) : undefined
  const updateStatusMut = convex ? useMutation(api.orders.updateStatus) : null

  const [mockOrders, setMockOrders] = useState([
    { id: '48213', customer: 'Jane Mwangi', total: 216000, status: 'confirmed' },
    { id: '48109', customer: 'David Otieno', total: 98000, status: 'delivered' },
    { id: '48098', customer: 'Amara Chen', total: 189000, status: 'processing' },
  ])

  if (convex) {
    const orders = (raw ?? []).map((o) => ({
      id: o._id,
      customer: o.userId, // resolved to a name once a users join is added server-side
      total: o.total,
      status: o.orderStatus,
    }))
    return {
      orders,
      isLoading: raw === undefined,
      isConnected: true,
      setStatus: (id, orderStatus) => updateStatusMut({ id, orderStatus }),
    }
  }

  return {
    orders: mockOrders,
    isLoading: false,
    isConnected: false,
    setStatus: (id, status) => setMockOrders((prev) => prev.map((o) => (o.id === id ? { ...o, status } : o))),
  }
}
