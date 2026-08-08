import { useUser } from '@clerk/clerk-react'
import { useQuery, useMutation } from 'convex/react'
import { useEffect } from 'react'
import { api } from '../../convex/_generated/api'
import { convex } from '@/lib/convexClient'

const clerkAvailable = Boolean(import.meta.env.VITE_CLERK_PUBLISHABLE_KEY)

/**
 * Returns { clerkUser, convexUser, isLoaded, isSignedIn }.
 * Also upserts the Convex `users` row on first load so every signed-in
 * person has a matching record (role, addresses, cart, etc. all key off it).
 *
 * Safe to call before Clerk/Convex keys are set — everything comes back
 * null/false instead of throwing. Hooks are always called unconditionally
 * (Convex's "skip" sentinel is used instead of branching) so hook order
 * never changes between renders.
 */
export function useCurrentUser() {
  const { user, isLoaded, isSignedIn } = clerkAvailable
    ? useUser()
    : { user: null, isLoaded: true, isSignedIn: false }

  const convexUser = convex
    ? useQuery(api.users.getByClerkId, isSignedIn ? { clerkId: user.id } : 'skip')
    : null

  const upsert = convex ? useMutation(api.users.upsertFromClerk) : null

  useEffect(() => {
    if (isSignedIn && user && upsert) {
      upsert({
        clerkId: user.id,
        email: user.primaryEmailAddress?.emailAddress ?? '',
        firstName: user.firstName ?? undefined,
        lastName: user.lastName ?? undefined,
        imageUrl: user.imageUrl ?? undefined,
      })
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isSignedIn, user?.id])

  return { clerkUser: user ?? null, convexUser: convexUser ?? null, isLoaded, isSignedIn: Boolean(isSignedIn) }
}
