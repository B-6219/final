import { useState } from 'react'
import { NavLink, useLocation } from 'react-router-dom'
import {
  FiUser, FiMapPin, FiPackage, FiClock, FiSettings, FiPlus, FiTrash2, FiEdit2,
} from 'react-icons/fi'
import { Breadcrumbs, EmptyState, Avatar } from '@/components/ui/States'
import Button from '@/components/ui/Button'
import Input from '@/components/ui/Input'
import Modal from '@/components/ui/Modal'
import OrderCard from '@/components/ui/OrderCard'
import { formatPrice, cn } from '@/lib/utils'
import { useCurrentUser } from '@/hooks/useCurrentUser'
import { useToast } from '@/context/ToastContext'
import { useAddresses } from '@/hooks/useAddresses'
import { useUserOrders } from '@/hooks/useOrders'
import { useRecentlyViewed } from '@/hooks/useRecentlyViewed'

const TABS = [
  { key: 'profile', label: 'Profile', icon: FiUser },
  { key: 'addresses', label: 'Addresses', icon: FiMapPin },
  { key: 'orders', label: 'Orders', icon: FiPackage },
  { key: 'recent', label: 'Recently Viewed', icon: FiClock },
  { key: 'settings', label: 'Settings', icon: FiSettings },
]

export default function Dashboard() {
  const location = useLocation()
  const initialTab = location.pathname.split('/dashboard/')[1] || 'profile'
  const [activeTab, setActiveTab] = useState(TABS.some((t) => t.key === initialTab) ? initialTab : 'profile')
  const { clerkUser, isSignedIn } = useCurrentUser()

  return (
    <div className="pt-28 pb-24">
      <div className="mx-auto max-w-7xl px-6 lg:px-10">
        <Breadcrumbs items={[{ label: 'Home', to: '/' }, { label: 'Dashboard' }]} />

        <div className="flex items-center gap-4 mt-4 mb-10">
          <Avatar name={clerkUser?.fullName || 'Guest User'} src={clerkUser?.imageUrl} size={56} />
          <div>
            <h1 className="font-display text-3xl lg:text-4xl uppercase text-bone">
              {isSignedIn ? (clerkUser?.fullName || 'My Account') : 'My Account'}
            </h1>
            <p className="text-silver text-sm">{clerkUser?.primaryEmailAddress?.emailAddress || 'Sign in to see your details'}</p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-[240px_1fr] gap-10">
          {/* Tab nav */}
          <nav className="flex lg:flex-col gap-2 overflow-x-auto lg:overflow-visible pb-2 lg:pb-0">
            {TABS.map((tab) => (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key)}
                className={cn(
                  'flex items-center gap-3 px-4 py-3 text-sm font-display uppercase tracking-wide whitespace-nowrap transition-colors text-left',
                  activeTab === tab.key
                    ? 'bg-racing-red text-bone'
                    : 'text-silver hover:text-bone hover:bg-graphite'
                )}
              >
                <tab.icon size={16} /> {tab.label}
              </button>
            ))}
          </nav>

          {/* Panel */}
          <div>
            {activeTab === 'profile' && <ProfilePanel clerkUser={clerkUser} />}
            {activeTab === 'addresses' && <AddressesPanel />}
            {activeTab === 'orders' && <OrdersPanel />}
            {activeTab === 'recent' && <RecentPanel />}
            {activeTab === 'settings' && <SettingsPanel />}
          </div>
        </div>
      </div>
    </div>
  )
}

function ProfilePanel({ clerkUser }) {
  const { showToast } = useToast()
  const [form, setForm] = useState({
    firstName: clerkUser?.firstName || '',
    lastName: clerkUser?.lastName || '',
    email: clerkUser?.primaryEmailAddress?.emailAddress || '',
    phone: '',
  })

  return (
    <div className="max-w-xl">
      <h2 className="font-display uppercase text-bone text-xl mb-6">Profile</h2>
      <form
        onSubmit={(e) => { e.preventDefault(); showToast('Profile updated', 'success') }}
        className="grid grid-cols-1 sm:grid-cols-2 gap-5"
      >
        <Input label="First Name" value={form.firstName} onChange={(e) => setForm({ ...form, firstName: e.target.value })} />
        <Input label="Last Name" value={form.lastName} onChange={(e) => setForm({ ...form, lastName: e.target.value })} />
        <Input label="Email" type="email" className="sm:col-span-2" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
        <Input label="Phone" className="sm:col-span-2" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} placeholder="+254 7XX XXX XXX" />
        <Button type="submit" className="sm:col-span-2 w-fit mt-2">Save Changes</Button>
      </form>
    </div>
  )
}

function AddressesPanel() {
  const { showToast } = useToast()
  const { addresses, addAddress, removeAddress, isLoading } = useAddresses()
  const [modalOpen, setModalOpen] = useState(false)
  const [form, setForm] = useState({ label: '', fullName: '', line1: '', city: '', country: '', phone: '' })

  const submit = async (e) => {
    e.preventDefault()
    await addAddress({ ...form, postalCode: '00000' })
    setForm({ label: '', fullName: '', line1: '', city: '', country: '', phone: '' })
    setModalOpen(false)
    showToast('Address added', 'success')
  }

  const remove = (id) => {
    removeAddress(id)
    showToast('Address removed', 'info')
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h2 className="font-display uppercase text-bone text-xl">Addresses</h2>
        <Button size="sm" icon={FiPlus} onClick={() => setModalOpen(true)}>Add Address</Button>
      </div>

      {isLoading ? (
        <p className="spec-strip text-silver text-sm uppercase tracking-widest">Loading…</p>
      ) : addresses.length === 0 ? (
        <EmptyState icon={FiMapPin} title="No addresses saved" message="Add a shipping address to speed up checkout." />
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {addresses.map((a) => (
            <div key={a.id} className="border border-graphite-light p-5">
              <div className="flex items-center justify-between mb-2">
                <p className="font-display uppercase text-bone">{a.label || 'Address'}</p>
                {a.isDefault && <span className="text-amber text-xs uppercase tracking-wide">Default</span>}
              </div>
              <p className="text-silver text-sm">{a.fullName}</p>
              <p className="text-silver text-sm">{a.line1}, {a.city}, {a.country}</p>
              <p className="text-silver text-sm mb-4">{a.phone}</p>
              <button onClick={() => remove(a.id)} className="text-racing-red text-xs uppercase tracking-wide flex items-center gap-1 hover:opacity-80">
                <FiTrash2 size={13} /> Remove
              </button>
            </div>
          ))}
        </div>
      )}

      <Modal open={modalOpen} onClose={() => setModalOpen(false)} title="Add Address">
        <form onSubmit={submit} className="grid grid-cols-1 gap-4">
          <Input label="Label" placeholder="Home, Office…" value={form.label} onChange={(e) => setForm({ ...form, label: e.target.value })} />
          <Input label="Full Name" required value={form.fullName} onChange={(e) => setForm({ ...form, fullName: e.target.value })} />
          <Input label="Address" required value={form.line1} onChange={(e) => setForm({ ...form, line1: e.target.value })} />
          <div className="grid grid-cols-2 gap-4">
            <Input label="City" required value={form.city} onChange={(e) => setForm({ ...form, city: e.target.value })} />
            <Input label="Country" required value={form.country} onChange={(e) => setForm({ ...form, country: e.target.value })} />
          </div>
          <Input label="Phone" required value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} />
          <Button type="submit" className="mt-2">Save Address</Button>
        </form>
      </Modal>
    </div>
  )
}

function OrdersPanel() {
  const { orders, isLoading } = useUserOrders()

  if (isLoading) {
    return <p className="spec-strip text-silver text-sm uppercase tracking-widest">Loading orders…</p>
  }

  if (orders.length === 0) {
    return <EmptyState icon={FiPackage} title="No orders yet" message="Your order history will show up here once you check out." />
  }

  return (
    <div>
      <h2 className="font-display uppercase text-bone text-xl mb-6">Order History</h2>
      <div className="flex flex-col gap-4">
        {orders.map((o) => <OrderCard key={o.id} order={o} />)}
      </div>
    </div>
  )
}

function RecentPanel() {
  const { vehicles: recent, isLoading } = useRecentlyViewed()

  if (isLoading) {
    return <p className="spec-strip text-silver text-sm uppercase tracking-widest">Loading…</p>
  }

  if (recent.length === 0) {
    return <EmptyState icon={FiClock} title="Nothing viewed yet" message="Vehicles you look at will show up here for quick access." />
  }

  return (
    <div>
      <h2 className="font-display uppercase text-bone text-xl mb-6">Recently Viewed</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {recent.map((v) => (
          <NavLink key={v.id} to={`/vehicles/${v.id}`} className="flex gap-4 border border-graphite-light p-3 hover:border-silver-dim transition-colors">
            <img src={v.image} alt={v.model} className="w-24 h-16 object-cover shrink-0" />
            <div>
              <p className="text-silver text-xs uppercase">{v.brand}</p>
              <p className="font-display uppercase text-bone">{v.model}</p>
              <p className="text-bone text-sm">{formatPrice(v.price)}</p>
            </div>
          </NavLink>
        ))}
      </div>
    </div>
  )
}

function SettingsPanel() {
  const { showToast } = useToast()
  return (
    <div className="max-w-xl">
      <h2 className="font-display uppercase text-bone text-xl mb-6">Account Settings</h2>
      <div className="flex flex-col gap-4">
        <SettingRow
          icon={FiEdit2}
          title="Password & Security"
          description="Manage your password and sign-in methods via Clerk's account portal."
          action={<Button size="sm" variant="outline" onClick={() => showToast('Opens Clerk account portal', 'info')}>Manage</Button>}
        />
        <SettingRow
          icon={FiSettings}
          title="Email Notifications"
          description="Order updates, price drops, and newsletter preferences."
          action={<Button size="sm" variant="outline" onClick={() => showToast('Preferences saved', 'success')}>Update</Button>}
        />
        <SettingRow
          icon={FiTrash2}
          title="Delete Account"
          description="Permanently remove your account and all associated data."
          action={<Button size="sm" variant="outline" className="border-racing-red text-racing-red hover:bg-racing-red hover:text-bone" onClick={() => showToast('This is a placeholder — no account was deleted', 'info')}>Delete</Button>}
        />
      </div>
    </div>
  )
}

function SettingRow({ icon: Icon, title, description, action }) {
  return (
    <div className="flex items-center justify-between gap-4 border border-graphite-light p-5">
      <div className="flex items-start gap-4">
        <Icon size={20} className="text-amber mt-1 shrink-0" />
        <div>
          <p className="font-display uppercase text-bone">{title}</p>
          <p className="text-silver text-sm mt-1">{description}</p>
        </div>
      </div>
      {action}
    </div>
  )
}
