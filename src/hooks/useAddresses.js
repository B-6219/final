import { useState } from 'react'
import { useQuery, useMutation } from 'convex/react'
import { api } from '../../convex/_generated/api'
import { convex } from '@/lib/convexClient'
import { useCurrentUser } from '@/hooks/useCurrentUser'

export function useAddresses() {
  const { convexUser, isSignedIn } = useCurrentUser()
  const canQuery = Boolean(convex && isSignedIn && convexUser)
  const raw = convex ? useQuery(api.addresses.list, canQuery ? { userId: convexUser._id } : 'skip') : undefined
  const createMut = convex ? useMutation(api.addresses.create) : null
  const removeMut = convex ? useMutation(api.addresses.remove) : null

  const [mockAddresses, setMockAddresses] = useState([
    { id: 'a1', label: 'Home', fullName: 'Jane Mwangi', line1: '14 Riverside Drive', city: 'Nairobi', country: 'Kenya', phone: '+254 712 345 678', isDefault: true },
  ])

  if (convex && canQuery) {
    const addresses = (raw ?? []).map((a) => ({ ...a, id: a._id }))
    return {
      addresses,
      isLoading: raw === undefined,
      isConnected: true,
      addAddress: (form) => createMut({ userId: convexUser._id, isDefault: addresses.length === 0, ...form }),
      removeAddress: (id) => removeMut({ id }),
    }
  }

  return {
    addresses: mockAddresses,
    isLoading: false,
    isConnected: false,
    addAddress: (form) =>
      setMockAddresses((prev) => [...prev, { ...form, id: `a${prev.length + 1}`, isDefault: prev.length === 0 }]),
    removeAddress: (id) => setMockAddresses((prev) => prev.filter((a) => a.id !== id)),
  }
}
