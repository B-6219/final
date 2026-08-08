import { Navigate, useLocation } from 'react-router-dom'
import { useCurrentUser } from '@/hooks/useCurrentUser'
import { FiLock } from 'react-icons/fi'

const clerkConfigured = Boolean(import.meta.env.VITE_CLERK_PUBLISHABLE_KEY)

/**
 * Wrap any route that requires sign-in (cart, checkout, wishlist, profile,
 * orders...). `adminOnly` additionally requires role === 'admin' on the
 * Convex `users` record, kept in sync with Clerk by useCurrentUser.
 */
export default function ProtectedRoute({ children, adminOnly = false }) {
  const location = useLocation()

  if (!clerkConfigured) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center text-center px-6 pt-20">
        <FiLock size={28} className="text-amber mb-4" />
        <p className="spec-strip text-racing-red text-xs uppercase tracking-[0.3em] mb-3">Setup required</p>
        <h1 className="font-display text-bone text-3xl uppercase mb-3">This page needs Clerk auth</h1>
        <p className="text-silver max-w-md text-sm">
          Add your Clerk publishable key to <code className="text-amber">.env.local</code> as{' '}
          <code className="text-amber">VITE_CLERK_PUBLISHABLE_KEY</code> and restart the dev server to unlock
          sign-in–protected pages.
        </p>
      </div>
    )
  }

  const { isLoaded, isSignedIn, convexUser } = useCurrentUser()

  if (!isLoaded) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <p className="spec-strip text-silver text-sm uppercase tracking-widest">Checking session…</p>
      </div>
    )
  }

  if (!isSignedIn) {
    return <Navigate to="/sign-in" state={{ from: location }} replace />
  }

  if (adminOnly && convexUser && convexUser.role !== 'admin') {
    return <Navigate to="/" replace />
  }

  return children
}
