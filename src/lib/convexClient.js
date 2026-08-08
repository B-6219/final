import { ConvexReactClient } from 'convex/react'

const convexUrl = import.meta.env.VITE_CONVEX_URL

// `convex` is null until VITE_CONVEX_URL is set in .env.local — every place
// that uses it (AppProviders, hooks) checks for that before calling in.
export const convex = convexUrl ? new ConvexReactClient(convexUrl) : null
