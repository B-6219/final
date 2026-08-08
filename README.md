# Chief Motors — Premium Car E-Commerce Platform

## Phase 1 of N: Project Foundation ✅

This phase delivers the scaffold, design system, routing, and Home page UI.
Later phases add Convex (data), Clerk (auth), Cloudinary (images), cart/checkout
logic, and the admin dashboard, layered on top of this foundation.

### What's included in Phase 1

- Vite + React 19 + Tailwind CSS v4
- React Router with all top-level routes wired (most render placeholders
  for now — they'll be filled in as we go, phase by phase)
- Framer Motion page/section animations, React Icons, TanStack Query wired
  into the app shell (ready for Convex queries in Phase 3)
- Design system: color tokens, type scale (Oswald/Inter/JetBrains Mono),
  reusable Button, Badge, spec-strip utility class
- Layout: Navbar (with mobile drawer), Footer, MainLayout
- Home page: Hero w/ search bar, Brands strip, Featured Vehicles (using the
  signature spec-sheet styled VehicleCard), Categories grid, Why Choose Us
- Scalable folder architecture matching the brief exactly (components,
  features, layouts, pages, hooks, lib, services, utils, routes, constants,
  providers, context, convex/)

### Run it

```bash
npm install
npm run dev
```

Then open the printed local URL (usually http://localhost:5173).

### What's mocked for now

src/constants/mockVehicles.js holds placeholder vehicle/brand/category data
so the UI has something real to render. This file is retired in the Convex
phase once convex/vehicles.js queries replace it — nothing else needs to
change since components already consume data through props.

## Phase 2 of N: Backend, Auth & Every Page ✅

### What's new in Phase 2

- **Convex backend** — full schema (`convex/schema.js`) for all 12 entities:
  users, vehicles, brands, categories, orders, cart, wishlist, reviews,
  coupons, notifications, recentlyViewed, addresses — plus complete
  query/mutation files for each, and a `seed.js` to populate starter data.
  A hand-written `convex/_generated/` stub is included so the app runs
  before you've connected a real Convex deployment; `npx convex dev`
  overwrites it with the real typed version the first time you run it.
- **Clerk auth** — `AppProviders` wires `ClerkProvider` +
  `ConvexProviderWithClerk` together, `useCurrentUser()` keeps a Convex
  `users` row in sync with the signed-in Clerk user, and `ProtectedRoute`
  guards `/cart`, `/wishlist`, `/checkout`, `/dashboard`, and `/admin`
  (with role checking for admin-only routes).
- **`.env.local` + `.env.example`** — paste your real keys for Convex,
  Clerk, Cloudinary, Stripe, and M-Pesa Daraja. Nothing crashes if a key
  is still blank — each integration degrades gracefully with a clear
  "not configured yet" message until you add it.
- **Every page built out**: Shop (filters/sort/pagination), Vehicle
  Details (gallery/specs/reviews/related), Cart, Wishlist, a full 4-step
  Checkout (shipping → payment → review → confirmation, with Stripe/M-Pesa
  tabs), a tabbed user Dashboard (profile/addresses/orders/recently
  viewed/settings), a tabbed Admin Dashboard (overview/vehicles/orders/
  customers/analytics with Recharts), About, Contact, FAQ, Privacy, Terms,
  Sign In, Sign Up, 404.

### Connecting real services

1. **Convex**: run `npx convex dev` in this folder. It creates a project
   and writes `VITE_CONVEX_URL` for you. Then run the `seed:run` mutation
   from the Convex dashboard (or `npx convex run seed:run`) to populate
   starter brands/categories/vehicles.
2. **Clerk**: create an app at https://dashboard.clerk.com, copy the
   publishable key into `VITE_CLERK_PUBLISHABLE_KEY`.
3. **Cloudinary / Stripe / M-Pesa**: add keys as you build out those
   integrations in a later phase — the checkout UI already has clearly
   marked integration points for both payment providers.

### What's still mocked

Every page currently reads from `src/constants/mockVehicles.js` or local
component state, with a `NOTE:` comment at the top of each file showing
the exact Convex hook to swap in once your backend is connected. The UI
itself won't need to change — only the data source.

## Phase 3 of N: Real Data, Image Uploads & Payment Actions ✅

### What's new in Phase 3

- **Every page now reads/writes real Convex data** when connected, with
  transparent mock fallback otherwise — same UI, no page rewrites needed
  later. New hooks: `useVehicles`, `useTaxonomy`, `useCart`, `useWishlist`,
  `useReviews`, `useOrders`, `useAddresses`, `useCustomers`,
  `useRecentlyViewed`. A `normalizeVehicle()` helper converts Convex's
  `brandId`/`categoryId` references + `images[]` into the flat shape
  components already expected, so VehicleCard etc. never needed changes.
- **Cloudinary image uploads** — `src/lib/cloudinary.js` does unsigned
  browser uploads (cloud name + upload preset only, never the API secret),
  and `ImageUploader` in the Admin → Vehicles form lets you drag/select up
  to 8 photos per listing.
- **Admin "Add Vehicle" now writes real data** — brand/category dropdowns
  populate from Convex, and Create calls `vehicles.create` with proper
  `brandId`/`categoryId` references (previously this only updated local
  table state).
- **Stripe + M-Pesa payment actions** — `convex/payments.js` has two real
  server-side actions: `createStripePaymentIntent` (calls Stripe's REST
  API) and `initiateMpesaStkPush` (OAuth + STK push against the Daraja
  API). Checkout calls whichever matches the selected payment tab right
  after the order is created. Neither has real keys in this build — each
  action throws a clear, readable error until you set them via
  `npx convex env set STRIPE_SECRET_KEY ...` / the `MPESA_*` equivalents —
  and Checkout catches that gracefully (order still confirms as pending
  payment) rather than blocking the flow.

### Connecting real services

1. **Convex**: run `npx convex dev`. It writes `VITE_CONVEX_URL` for you.
   Then seed starter data: `npx convex run seed:run`.
2. **Clerk**: paste your publishable key into `VITE_CLERK_PUBLISHABLE_KEY`.
3. **Cloudinary**: create an unsigned upload preset at
   https://cloudinary.com/console/settings/upload, then set
   `VITE_CLOUDINARY_CLOUD_NAME` and `VITE_CLOUDINARY_UPLOAD_PRESET`.
4. **Stripe**: `npx convex env set STRIPE_SECRET_KEY sk_test_...` (and add
   `VITE_STRIPE_PUBLISHABLE_KEY` to `.env.local` once you wire Stripe.js
   client-side to confirm the returned `client_secret`).
5. **M-Pesa**: `npx convex env set MPESA_CONSUMER_KEY ...` /
   `MPESA_CONSUMER_SECRET` / `MPESA_SHORTCODE` / `MPESA_PASSKEY`. Update
   the hardcoded `callbackUrl` in `Checkout.jsx` to your deployed webhook
   once you have one (Safaricom requires a real HTTPS endpoint).

### Roadmap (next phases)

1. ~~Foundation: scaffold, design system, routing, Home page~~ — done
2. ~~Convex backend, Clerk auth, env file, all pages~~ — done
3. ~~Real Convex queries everywhere, Cloudinary uploads, payment actions~~ — done (this phase)
4. Stripe.js client-side confirmation (turn the PaymentIntent into an
   actual completed charge with a card form), M-Pesa webhook handler
   (Convex HTTP action to receive the Daraja callback and mark orders paid)
5. Polish pass — code splitting (bundle is a single ~990kb chunk),
   accessibility audit, loading-state consistency, seed data richness

Each phase is delivered as complete, compiling code — no partial or
placeholder logic for whatever that phase covers.
