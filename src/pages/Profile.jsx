import { useState } from 'react'
import { NavLink } from 'react-router-dom'
import { useClerk } from '@clerk/clerk-react'
import { useMutation } from 'convex/react'
import {
  FiEdit2, FiShield, FiPackage, FiHeart, FiShoppingCart, FiMapPin,
  FiLogOut, FiTrash2, FiCheckCircle, FiSettings, FiArrowRight, FiAward,
} from 'react-icons/fi'
import { Breadcrumbs, Avatar, EmptyState } from '@/components/ui/States'
import Button from '@/components/ui/Button'
import Badge from '@/components/ui/Badge'
import Modal from '@/components/ui/Modal'
import Input from '@/components/ui/Input'
import OrderCard from '@/components/ui/OrderCard'
import { formatPrice } from '@/lib/utils'
import { useToast } from '@/context/ToastContext'
import { useCurrentUser } from '@/hooks/useCurrentUser'
import { useUserOrders } from '@/hooks/useOrders'
import { useWishlist } from '@/hooks/useWishlist'
import { useCart } from '@/hooks/useCart'
import { useAddresses } from '@/hooks/useAddresses'
import { api } from '../../convex/_generated/api'
import { convex } from '@/lib/convexClient'

/**
 * The account hub — this is where the navbar's person icon lands for a
 * signed-in customer (admins go straight to /admin instead). Pulls
 * together identity (Clerk), and orders/wishlist/cart/addresses (Convex,
 * with mock fallback) into one page, with quick links out to the fuller
 * management views on /dashboard and Clerk's own security portal.
 */
export default function Profile() {
  const { showToast } = useToast()
  const { clerkUser, convexUser, isSignedIn } = useCurrentUser()
  const { openUserProfile, signOut } = useClerk()
  const { orders } = useUserOrders()
  const { items: wishlistItems } = useWishlist()
  const { items: cartItems } = useCart()
  const { addresses } = useAddresses()
  const updatePhoneMut = convex ? useMutation(api.users.updateProfile) : null

  const [editOpen, setEditOpen] = useState(false)
  const [form, setForm] = useState({
    firstName: clerkUser?.firstName || '',
    lastName: clerkUser?.lastName || '',
    phone: convexUser?.phone || '',
  })
  const [saving, setSaving] = useState(false)

  const isAdmin = convexUser?.role === 'admin'
  const memberSince = convexUser?.createdAt ?? clerkUser?.createdAt
  const activeCartCount = cartItems.filter((i) => !i.savedForLater).length

  const saveProfile = async (e) => {
    e.preventDefault()
    setSaving(true)
    try {
      if (clerkUser?.update) {
        await clerkUser.update({ firstName: form.firstName, lastName: form.lastName })
      }
      if (updatePhoneMut && convexUser) {
        await updatePhoneMut({ id: convexUser._id, phone: form.phone })
      }
      showToast('Profile updated', 'success')
      setEditOpen(false)
    } catch (err) {
      showToast(err.message || 'Could not update profile', 'error')
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="pt-28 pb-24">
      <div className="mx-auto max-w-6xl px-6 lg:px-10">
        <Breadcrumbs items={[{ label: 'Home', to: '/' }, { label: 'Profile' }]} />

        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center gap-6 mt-6 mb-12">
          <Avatar name={clerkUser?.fullName || 'Guest User'} src={clerkUser?.imageUrl} size={88} />
          <div className="flex-1">
            <div className="flex flex-wrap items-center gap-3">
              <h1 className="font-display text-3xl lg:text-4xl uppercase text-bone">
                {clerkUser?.fullName || 'My Profile'}
              </h1>
              {isAdmin && <Badge variant="red">Admin</Badge>}
              {!isAdmin && isSignedIn && <Badge variant="amber">Verified Buyer</Badge>}
            </div>
            <p className="text-silver text-sm mt-1">{clerkUser?.primaryEmailAddress?.emailAddress}</p>
            {memberSince && (
              <p className="text-silver-dim text-xs mt-1 spec-strip uppercase">
                Member since {new Date(memberSince).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
              </p>
            )}
          </div>
          <Button variant="outline" icon={FiEdit2} onClick={() => setEditOpen(true)}>Edit Profile</Button>
        </div>

        {isAdmin && (
          <NavLink
            to="/admin"
            className="flex items-center justify-between gap-4 border border-racing-red/40 bg-racing-red/5 px-5 py-4 mb-10 hover:border-racing-red transition-colors"
          >
            <div className="flex items-center gap-3">
              <FiShield className="text-racing-red" size={20} />
              <div>
                <p className="font-display uppercase text-bone text-sm">Admin Dashboard</p>
                <p className="text-silver text-xs mt-0.5">Manage inventory, orders, and customers</p>
              </div>
            </div>
            <FiArrowRight className="text-racing-red" size={18} />
          </NavLink>
        )}

        {/* Quick stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-12">
          <StatLink to="/dashboard/orders" icon={FiPackage} label="Orders" value={orders.length} />
          <StatLink to="/wishlist" icon={FiHeart} label="Wishlist" value={wishlistItems.length} />
          <StatLink to="/cart" icon={FiShoppingCart} label="In Cart" value={activeCartCount} />
          <StatLink to="/dashboard/addresses" icon={FiMapPin} label="Addresses" value={addresses.length} />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Personal info */}
          <Section title="Personal Information">
            <InfoRow label="First Name" value={clerkUser?.firstName || '—'} />
            <InfoRow label="Last Name" value={clerkUser?.lastName || '—'} />
            <InfoRow label="Email" value={clerkUser?.primaryEmailAddress?.emailAddress || '—'} />
            <InfoRow label="Phone" value={convexUser?.phone || '—'} />
          </Section>

          {/* Security */}
          <Section title="Security">
            <RowAction
              icon={FiCheckCircle}
              title="Password & Two-Factor"
              description="Manage sign-in methods and security settings via Clerk."
              action={<Button size="sm" variant="outline" onClick={() => openUserProfile()}>Manage</Button>}
            />
            <RowAction
              icon={FiSettings}
              title="Account Preferences"
              description="Notification and order-update preferences."
              action={<NavLink to="/dashboard/settings"><Button size="sm" variant="outline">Open</Button></NavLink>}
            />
            <RowAction
              icon={FiLogOut}
              title="Sign Out"
              description="End your session on this device."
              action={<Button size="sm" variant="outline" onClick={() => signOut()}>Sign Out</Button>}
            />
            <RowAction
              icon={FiTrash2}
              title="Delete Account"
              description="Permanently remove your account and data."
              action={
                <Button
                  size="sm" variant="outline"
                  className="border-racing-red text-racing-red hover:bg-racing-red hover:text-bone"
                  onClick={() => showToast('This is a placeholder — no account was deleted', 'info')}
                >
                  Delete
                </Button>
              }
            />
          </Section>

          {/* Recent orders */}
          <Section
            title="Recent Orders"
            action={<NavLink to="/dashboard/orders" className="text-xs text-silver hover:text-bone uppercase tracking-wide flex items-center gap-1">View all <FiArrowRight size={12} /></NavLink>}
          >
            {orders.length === 0 ? (
              <EmptyState icon={FiPackage} title="No orders yet" message="Your orders will show up here." />
            ) : (
              <div className="flex flex-col gap-3">
                {orders.slice(0, 3).map((o) => <OrderCard key={o.id} order={o} />)}
              </div>
            )}
          </Section>

          {/* Addresses */}
          <Section
            title="Saved Addresses"
            action={<NavLink to="/dashboard/addresses" className="text-xs text-silver hover:text-bone uppercase tracking-wide flex items-center gap-1">Manage <FiArrowRight size={12} /></NavLink>}
          >
            {addresses.length === 0 ? (
              <EmptyState icon={FiMapPin} title="No addresses saved" message="Add one at checkout or from your dashboard." />
            ) : (
              <div className="flex flex-col gap-3">
                {addresses.slice(0, 2).map((a) => (
                  <div key={a.id} className="border border-graphite-light p-4">
                    <div className="flex items-center justify-between">
                      <p className="font-display uppercase text-bone text-sm">{a.label || 'Address'}</p>
                      {a.isDefault && <FiAward size={14} className="text-amber" />}
                    </div>
                    <p className="text-silver text-xs mt-1">{a.line1}, {a.city}, {a.country}</p>
                  </div>
                ))}
              </div>
            )}
          </Section>
        </div>
      </div>

      {/* Edit modal */}
      <Modal open={editOpen} onClose={() => setEditOpen(false)} title="Edit Profile">
        <form onSubmit={saveProfile} className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Input label="First Name" value={form.firstName} onChange={(e) => setForm({ ...form, firstName: e.target.value })} />
          <Input label="Last Name" value={form.lastName} onChange={(e) => setForm({ ...form, lastName: e.target.value })} />
          <Input
            label="Phone"
            className="sm:col-span-2"
            value={form.phone}
            onChange={(e) => setForm({ ...form, phone: e.target.value })}
            placeholder="+254 7XX XXX XXX"
          />
          <p className="sm:col-span-2 text-silver-dim text-xs">
            Email is managed by Clerk — update it via Security → Manage below.
          </p>
          <Button type="submit" disabled={saving} className="sm:col-span-2 mt-1">
            {saving ? 'Saving…' : 'Save Changes'}
          </Button>
        </form>
      </Modal>
    </div>
  )
}

function Section({ title, action, children }) {
  return (
    <div className="border border-graphite-light p-6">
      <div className="flex items-center justify-between mb-5">
        <h2 className="font-display uppercase text-bone text-lg">{title}</h2>
        {action}
      </div>
      <div className="flex flex-col gap-4">{children}</div>
    </div>
  )
}

function InfoRow({ label, value }) {
  return (
    <div className="flex items-center justify-between border-b border-graphite-light pb-3 last:border-0 last:pb-0">
      <span className="text-silver-dim text-xs uppercase tracking-wide">{label}</span>
      <span className="text-bone text-sm">{value}</span>
    </div>
  )
}

function RowAction({ icon: Icon, title, description, action }) {
  return (
    <div className="flex items-center justify-between gap-4">
      <div className="flex items-start gap-3">
        <Icon size={18} className="text-amber mt-0.5 shrink-0" />
        <div>
          <p className="text-bone text-sm">{title}</p>
          <p className="text-silver-dim text-xs mt-0.5">{description}</p>
        </div>
      </div>
      {action}
    </div>
  )
}

function StatLink({ to, icon: Icon, label, value }) {
  return (
    <NavLink to={to} className="border border-graphite-light p-5 flex flex-col gap-3 hover:border-amber transition-colors group">
      <Icon size={20} className="text-amber" />
      <div>
        <p className="font-display text-2xl text-bone">{value}</p>
        <p className="text-silver-dim text-xs uppercase tracking-wide group-hover:text-silver transition-colors">{label}</p>
      </div>
    </NavLink>
  )
}
