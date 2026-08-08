import { ClerkProvider } from '@clerk/clerk-react'
import { ConvexProviderWithClerk } from 'convex/react-clerk'
import { ConvexProvider } from 'convex/react'
import { useAuth } from '@clerk/clerk-react'
import { convex } from '@/lib/convexClient'

const clerkKey = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY

/**
 * Wraps the app in Clerk + Convex once their keys are present in
 * .env.local. Until then it renders children directly so the UI still
 * runs (with mock data) — nothing crashes just because keys aren't set yet.
 *
 * Once both keys exist:
 *   - ClerkProvider gives us useUser(), <SignedIn>, <SignedOut>, etc.
 *   - ConvexProviderWithClerk passes the Clerk session token to Convex so
 *     ctx.auth.getUserIdentity() works inside Convex functions.
 */
export default function AppProviders({ children }) {
  if (!clerkKey && !convex) {
    return children
  }

  if (clerkKey && convex) {
    return (
      <ClerkProvider publishableKey={clerkKey} afterSignOutUrl="/">
        <ConvexProviderWithClerk client={convex} useAuth={useAuth}>
          {children}
        </ConvexProviderWithClerk>
      </ClerkProvider>
    )
  }

  // Only one of the two is configured — still useful during setup.
  if (clerkKey) {
    return <ClerkProvider publishableKey={clerkKey} afterSignOutUrl="/">{children}</ClerkProvider>
  }

  return <ConvexProvider client={convex}>{children}</ConvexProvider>
}
