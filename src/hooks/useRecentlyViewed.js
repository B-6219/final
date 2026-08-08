import { useEffect } from 'react'
import { useQuery, useMutation } from 'convex/react'
import { api } from '../../convex/_generated/api'
import { convex } from '@/lib/convexClient'
import { useCurrentUser } from '@/hooks/useCurrentUser'
import { normalizeVehicle } from '@/lib/normalizers'
import { ALL_VEHICLES } from '@/constants/mockVehicles'

/** Call from VehicleDetails to record a view once per mount. No-ops
 * gracefully when Convex/Clerk aren't connected or the user isn't signed in. */
export function useRecordView(vehicleId) {
  const { convexUser, isSignedIn } = useCurrentUser()
  const recordMut = convex ? useMutation(api.recentlyViewed.record) : null

  useEffect(() => {
    if (convex && isSignedIn && convexUser && vehicleId && recordMut) {
      recordMut({ userId: convexUser._id, vehicleId })
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [vehicleId, isSignedIn, convexUser?._id])
}

export function useRecentlyViewed() {
  const { convexUser, isSignedIn } = useCurrentUser()
  const canQuery = Boolean(convex && isSignedIn && convexUser)
  const raw = convex ? useQuery(api.recentlyViewed.listForUser, canQuery ? { userId: convexUser._id } : 'skip') : undefined

  if (convex && canQuery) {
    return {
      vehicles: (raw ?? []).map((item) => normalizeVehicle(item.vehicle)),
      isLoading: raw === undefined,
    }
  }
  return { vehicles: ALL_VEHICLES.slice(4, 8), isLoading: false }
}
