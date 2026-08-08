import { useState } from 'react'
import { useQuery, useMutation } from 'convex/react'
import { api } from '../../convex/_generated/api'
import { convex } from '@/lib/convexClient'

export function useCustomers(search = '') {
  const raw = convex ? useQuery(api.users.list, { search: search || undefined }) : undefined
  const setStatusMut = convex ? useMutation(api.users.setStatus) : null
  const removeMut = convex ? useMutation(api.users.remove) : null

  const [mockCustomers, setMockCustomers] = useState([
    { id: 'u1', name: 'Jane Mwangi', email: 'jane@example.com', status: 'active' },
    { id: 'u2', name: 'David Otieno', email: 'david@example.com', status: 'active' },
    { id: 'u3', name: 'Amara Chen', email: 'amara@example.com', status: 'suspended' },
  ])

  if (convex) {
    const customers = (raw ?? []).map((u) => ({
      id: u._id,
      name: `${u.firstName ?? ''} ${u.lastName ?? ''}`.trim() || u.email,
      email: u.email,
      status: u.status,
    }))
    return {
      customers,
      isLoading: raw === undefined,
      isConnected: true,
      toggleSuspend: (id, currentStatus) =>
        setStatusMut({ id, status: currentStatus === 'active' ? 'suspended' : 'active' }),
      remove: (id) => removeMut({ id }),
    }
  }

  const filtered = search
    ? mockCustomers.filter((c) => c.name.toLowerCase().includes(search.toLowerCase()) || c.email.toLowerCase().includes(search.toLowerCase()))
    : mockCustomers

  return {
    customers: filtered,
    isLoading: false,
    isConnected: false,
    toggleSuspend: (id) =>
      setMockCustomers((prev) => prev.map((c) => (c.id === id ? { ...c, status: c.status === 'active' ? 'suspended' : 'active' } : c))),
    remove: (id) => setMockCustomers((prev) => prev.filter((c) => c.id !== id)),
  }
}
