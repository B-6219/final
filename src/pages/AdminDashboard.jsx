import { useEffect, useState } from 'react'
import {
  FiDollarSign, FiShoppingBag, FiUsers, FiBox, FiPlus, FiEdit2, FiTrash2,
  FiSearch, FiStar, FiTrendingUp, FiPieChart, FiAlertCircle,
} from 'react-icons/fi'
import {
  ResponsiveContainer, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip,
  BarChart, Bar,
} from 'recharts'
import { Breadcrumbs } from '@/components/ui/States'
import Button from '@/components/ui/Button'
import Badge from '@/components/ui/Badge'
import Modal from '@/components/ui/Modal'
import Input from '@/components/ui/Input'
import DashboardCard from '@/components/ui/DashboardCard'
import { formatPrice, cn } from '@/lib/utils'
import { useToast } from '@/context/ToastContext'
import { useVehicleList, useVehicleAdmin } from '@/hooks/useVehicles'
import { useBrands, useCategories } from '@/hooks/useTaxonomy'
import ImageUploader from '@/components/admin/ImageUploader'
import { useAdminOrders } from '@/hooks/useOrders'
import { useCustomers } from '@/hooks/useCustomers'

const TABS = [
  { key: 'overview', label: 'Overview' },
  { key: 'vehicles', label: 'Vehicles' },
  { key: 'orders', label: 'Orders' },
  { key: 'customers', label: 'Customers' },
  { key: 'analytics', label: 'Analytics' },
]

const REVENUE_DATA = [
  { month: 'Feb', revenue: 412000 }, { month: 'Mar', revenue: 498000 },
  { month: 'Apr', revenue: 386000 }, { month: 'May', revenue: 561000 },
  { month: 'Jun', revenue: 623000 }, { month: 'Jul', revenue: 702000 },
]

const POPULAR_DATA = [
  { model: 'G 63 AMG', views: 842 }, { model: '911 Turbo S', views: 731 },
  { model: 'M4 Comp.', views: 604 }, { model: 'LX 600', views: 512 },
  { model: 'iX xDrive50', views: 398 },
]

export default function AdminDashboard() {
  const [tab, setTab] = useState('overview')
  const { vehicles } = useVehicleList()

  return (
    <div className="pt-28 pb-24">
      <div className="mx-auto max-w-7xl px-6 lg:px-10">
        <Breadcrumbs items={[{ label: 'Home', to: '/' }, { label: 'Admin' }]} />
        <h1 className="font-display text-4xl lg:text-5xl uppercase text-bone mt-4 mb-10">Admin Dashboard</h1>

        <div className="flex gap-1 border-b border-graphite-light mb-10 overflow-x-auto">
          {TABS.map((t) => (
            <button
              key={t.key}
              onClick={() => setTab(t.key)}
              className={cn(
                'px-5 py-3 font-display text-sm uppercase tracking-wide whitespace-nowrap border-b-2 -mb-px transition-colors',
                tab === t.key ? 'border-racing-red text-bone' : 'border-transparent text-silver hover:text-bone'
              )}
            >
              {t.label}
            </button>
          ))}
        </div>

        {tab === 'overview' && <OverviewTab vehicleCount={vehicles.length} />}
        {tab === 'vehicles' && <VehiclesTab />}
        {tab === 'orders' && <OrdersTab />}
        {tab === 'customers' && <CustomersTab />}
        {tab === 'analytics' && <AnalyticsTab />}
      </div>
    </div>
  )
}

function OverviewTab({ vehicleCount }) {
  return (
    <div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
        <DashboardCard label="Total Sales" value="1,284" delta="+8.2%" icon={FiShoppingBag} accent="amber" />
        <DashboardCard label="Revenue" value={formatPrice(3182000)} delta="+12.4%" icon={FiDollarSign} accent="amber" />
        <DashboardCard label="Customers" value="946" delta="+3.1%" icon={FiUsers} accent="silver" />
        <DashboardCard label="Inventory" value={String(vehicleCount)} delta="-1.4%" icon={FiBox} accent="red" />
      </div>

      <div className="border border-graphite-light p-6">
        <h3 className="font-display uppercase text-bone text-lg mb-6">Recent Activity</h3>
        <div className="flex flex-col divide-y divide-graphite-light">
          {[
            { text: 'New order placed for Porsche 911 Turbo S', time: '12 minutes ago' },
            { text: 'Vehicle "BMW M4 Competition" marked as featured', time: '1 hour ago' },
            { text: 'Customer Jane M. suspended for policy violation', time: '3 hours ago' },
            { text: 'New review submitted — 5 stars for G 63 AMG', time: 'Yesterday' },
          ].map((a) => (
            <div key={a.text} className="flex items-center justify-between py-3">
              <p className="text-silver text-sm">{a.text}</p>
              <p className="text-silver-dim text-xs shrink-0 ml-4">{a.time}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

// NOTE: create/edit here update local table state directly (optimistic UI)
// and additionally call the real Convex mutation when connected. Full
// brand/category dropdown wiring (so "Add Vehicle" writes real brandId/
// categoryId references) is the natural next increment — for now new rows
// reuse the first available brand/category once Convex is connected.
// NOTE: with Convex connected, "Add Vehicle" now writes real brandId/
// categoryId references and uploads images to Cloudinary before saving —
// this is a fully real create path, not just an optimistic local row.
// Editing still patches whatever fields changed via vehicles.update.
function VehiclesTab() {
  const { showToast } = useToast()
  const { vehicles, isLoading } = useVehicleList()
  const { brands } = useBrands()
  const { categories } = useCategories()
  const { updateVehicle, removeVehicle, setFeatured, createVehicle, isConnected } = useVehicleAdmin()

  const [localVehicles, setLocalVehicles] = useState(vehicles)
  useEffect(() => { setLocalVehicles(vehicles) }, [vehicles.length, isLoading])

  const [search, setSearch] = useState('')
  const [modalOpen, setModalOpen] = useState(false)
  const [editing, setEditing] = useState(null)
  const [saving, setSaving] = useState(false)

  const filtered = localVehicles.filter((v) =>
    `${v.brand} ${v.model}`.toLowerCase().includes(search.toLowerCase())
  )

  const emptyForm = {
    brandId: brands[0]?._id ?? '',
    categoryId: categories[0]?._id ?? '',
    brand: brands[0]?.name ?? '',
    model: '',
    year: new Date().getFullYear(),
    price: '',
    mileage: 0,
    fuelType: 'Petrol',
    transmission: 'Automatic',
    condition: 'Used',
    color: '',
    description: '',
    stock: 1,
    featured: false,
    images: [],
  }

  const openNew = () => {
    if (isConnected && (brands.length === 0 || categories.length === 0)) {
      showToast(
        'No brands/categories yet — run `npx convex run seed:run` in your project folder first.',
        'error'
      )
      return
    }
    setEditing(emptyForm)
    setModalOpen(true)
  }
  const openEdit = (v) => { setEditing({ ...emptyForm, ...v }); setModalOpen(true) }

  const save = async (e) => {
    e.preventDefault()
    if (isConnected && !editing.id && (!editing.brandId || !editing.categoryId)) {
      showToast('Select a brand and category before saving.', 'error')
      return
    }
    setSaving(true)
    try {
      if (editing.id) {
        setLocalVehicles((prev) => prev.map((v) => (v.id === editing.id ? { ...v, ...editing } : v)))
        if (isConnected) {
          await updateVehicle({
            id: editing.id,
            patch: {
              model: editing.model, year: editing.year, price: editing.price, stock: editing.stock,
              mileage: editing.mileage, fuelType: editing.fuelType, transmission: editing.transmission,
              condition: editing.condition, color: editing.color, description: editing.description,
              images: editing.images,
            },
          })
        }
        showToast('Vehicle updated', 'success')
      } else if (isConnected) {
        const id = await createVehicle({
          brandId: editing.brandId,
          categoryId: editing.categoryId,
          model: editing.model,
          year: Number(editing.year),
          price: Number(editing.price),
          mileage: Number(editing.mileage) || 0,
          fuelType: editing.fuelType,
          transmission: editing.transmission,
          condition: editing.condition,
          color: editing.color || 'Unspecified',
          description: editing.description || `${editing.year} ${editing.model}`,
          features: [],
          images: editing.images,
          stock: Number(editing.stock) || 1,
          featured: editing.featured,
        })
        const brandName = brands.find((b) => b._id === editing.brandId)?.name
        setLocalVehicles((prev) => [
          { ...editing, id, brand: brandName, price: Number(editing.price), image: editing.images[0] },
          ...prev,
        ])
        showToast('Vehicle added', 'success')
      } else {
        const newVehicle = {
          ...editing, id: `v${localVehicles.length + 1}`, price: Number(editing.price),
          rating: 0, image: editing.images[0] ?? localVehicles[0]?.image,
        }
        setLocalVehicles((prev) => [newVehicle, ...prev])
        showToast('Vehicle added', 'success')
      }
      setModalOpen(false)
    } finally {
      setSaving(false)
    }
  }

  const remove = async (id) => {
    setLocalVehicles((prev) => prev.filter((v) => v.id !== id))
    if (isConnected) await removeVehicle({ id })
    showToast('Vehicle deleted', 'info')
  }

  const toggleFeatured = async (id) => {
    const next = !localVehicles.find((v) => v.id === id)?.featured
    setLocalVehicles((prev) => prev.map((v) => (v.id === id ? { ...v, featured: next } : v)))
    if (isConnected) await setFeatured({ id, featured: next })
  }

  const needsSeed = isConnected && (brands.length === 0 || categories.length === 0)

  return (
    <div>
      {needsSeed && (
        <div className="flex items-center gap-3 border border-amber/40 bg-amber/5 px-4 py-3 mb-6 text-sm text-amber">
          <FiAlertCircle size={16} className="shrink-0" />
          <span>
            No brands or categories in your Convex database yet. Run{' '}
            <code className="text-bone">npx convex run seed:run</code> in your project folder, then refresh.
          </span>
        </div>
      )}

      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div className="relative">
          <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-silver" size={16} />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search vehicles…"
            className="bg-graphite border border-graphite-light pl-9 pr-4 py-2.5 text-sm text-bone placeholder:text-silver-dim focus:outline-none focus:border-amber w-full sm:w-72"
          />
        </div>
        <Button size="sm" icon={FiPlus} onClick={openNew} disabled={needsSeed} title={needsSeed ? 'Seed brands/categories first' : undefined}>
          Add Vehicle
        </Button>
      </div>

      <div className="overflow-x-auto border border-graphite-light">
        <table className="w-full text-sm min-w-[720px]">
          <thead>
            <tr className="border-b border-graphite-light text-left text-silver text-xs uppercase tracking-wide">
              <th className="p-4">Vehicle</th>
              <th className="p-4">Year</th>
              <th className="p-4">Price</th>
              <th className="p-4">Stock</th>
              <th className="p-4">Featured</th>
              <th className="p-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((v) => (
              <tr key={v.id} className="border-b border-graphite-light last:border-0">
                <td className="p-4">
                  <p className="text-bone font-display uppercase">{v.brand} {v.model}</p>
                </td>
                <td className="p-4 text-silver spec-strip">{v.year}</td>
                <td className="p-4 text-bone">{formatPrice(v.price)}</td>
                <td className="p-4 text-silver spec-strip">{v.stock ?? 1}</td>
                <td className="p-4">
                  <button onClick={() => toggleFeatured(v.id)}>
                    <FiStar size={16} className={v.featured ? 'text-amber fill-amber' : 'text-silver-dim'} />
                  </button>
                </td>
                <td className="p-4">
                  <div className="flex items-center justify-end gap-3">
                    <button onClick={() => openEdit(v)} className="text-silver hover:text-bone" aria-label="Edit"><FiEdit2 size={15} /></button>
                    <button onClick={() => remove(v.id)} className="text-silver hover:text-racing-red" aria-label="Delete"><FiTrash2 size={15} /></button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <Modal open={modalOpen} onClose={() => setModalOpen(false)} title={editing?.id ? 'Edit Vehicle' : 'Add Vehicle'}>
        {editing && (
          <form onSubmit={save} className="grid grid-cols-2 gap-4 max-h-[70vh] overflow-y-auto pr-1">
            <div className="col-span-2">
              <p className="text-xs uppercase tracking-wide text-silver font-display mb-2">Photos</p>
              <ImageUploader images={editing.images ?? []} onChange={(images) => setEditing({ ...editing, images })} />
            </div>

            <Select label="Brand" value={editing.brandId} onChange={(v) => setEditing({ ...editing, brandId: v })} options={brands.map((b) => ({ value: b._id, label: b.name }))} />
            <Select label="Category" value={editing.categoryId} onChange={(v) => setEditing({ ...editing, categoryId: v })} options={categories.map((c) => ({ value: c._id, label: c.name }))} />

            <Input label="Model" required value={editing.model} onChange={(e) => setEditing({ ...editing, model: e.target.value })} />
            <Input label="Year" type="number" required value={editing.year} onChange={(e) => setEditing({ ...editing, year: e.target.value })} />
            <Input label="Price" type="number" required value={editing.price} onChange={(e) => setEditing({ ...editing, price: e.target.value })} />
            <Input label="Mileage" type="number" value={editing.mileage} onChange={(e) => setEditing({ ...editing, mileage: e.target.value })} />

            <Select label="Fuel Type" value={editing.fuelType} onChange={(v) => setEditing({ ...editing, fuelType: v })} options={['Petrol', 'Diesel', 'Hybrid', 'Electric', 'LPG'].map((f) => ({ value: f, label: f }))} />
            <Select label="Transmission" value={editing.transmission} onChange={(v) => setEditing({ ...editing, transmission: v })} options={['Automatic', 'Manual', 'PDK', 'CVT'].map((t) => ({ value: t, label: t }))} />
            <Select label="Condition" value={editing.condition} onChange={(v) => setEditing({ ...editing, condition: v })} options={['New', 'Used', 'Certified Pre-Owned'].map((c) => ({ value: c, label: c }))} />
            <Input label="Color" value={editing.color} onChange={(e) => setEditing({ ...editing, color: e.target.value })} />

            <Input label="Stock" type="number" value={editing.stock} onChange={(e) => setEditing({ ...editing, stock: e.target.value })} />
            <label className="flex items-center gap-2 mt-6">
              <input type="checkbox" checked={editing.featured} onChange={(e) => setEditing({ ...editing, featured: e.target.checked })} />
              <span className="text-sm text-silver">Featured</span>
            </label>

            <Input label="Description" as="textarea" rows={3} className="col-span-2 resize-none" value={editing.description} onChange={(e) => setEditing({ ...editing, description: e.target.value })} />

            <Button type="submit" disabled={saving} className="col-span-2 mt-2">{saving ? 'Saving…' : 'Save Vehicle'}</Button>
          </form>
        )}
      </Modal>
    </div>
  )
}

function Select({ label, value, onChange, options }) {
  return (
    <div className="flex flex-col gap-2">
      <label className="text-xs uppercase tracking-wide text-silver font-display">{label}</label>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="bg-graphite border border-graphite-light px-4 py-3 text-sm text-bone focus:outline-none focus:border-amber"
      >
        {options.map((opt) => (
          <option key={opt.value} value={opt.value}>{opt.label}</option>
        ))}
      </select>
    </div>
  )
}


function OrdersTab() {
  const { showToast } = useToast()
  const { orders, setStatus, isLoading } = useAdminOrders()

  const STATUS_VARIANT = { processing: 'silver', confirmed: 'amber', delivered: 'red', cancelled: 'silver' }

  const handleStatusChange = (id, status) => {
    setStatus(id, status)
    showToast(`Order #${id} marked ${status}`, 'success')
  }

  if (isLoading) return <p className="spec-strip text-silver text-sm uppercase tracking-widest">Loading orders…</p>

  return (
    <div className="overflow-x-auto border border-graphite-light">
      <table className="w-full text-sm min-w-[640px]">
        <thead>
          <tr className="border-b border-graphite-light text-left text-silver text-xs uppercase tracking-wide">
            <th className="p-4">Order</th>
            <th className="p-4">Customer</th>
            <th className="p-4">Total</th>
            <th className="p-4">Status</th>
            <th className="p-4 text-right">Update</th>
          </tr>
        </thead>
        <tbody>
          {orders.map((o) => (
            <tr key={o.id} className="border-b border-graphite-light last:border-0">
              <td className="p-4 spec-strip text-bone">#{String(o.id).slice(-6)}</td>
              <td className="p-4 text-silver">{o.customer}</td>
              <td className="p-4 text-bone">{formatPrice(o.total)}</td>
              <td className="p-4"><Badge variant={STATUS_VARIANT[o.status] ?? 'silver'}>{o.status}</Badge></td>
              <td className="p-4">
                <select
                  value={o.status}
                  onChange={(e) => handleStatusChange(o.id, e.target.value)}
                  className="bg-graphite border border-graphite-light px-3 py-1.5 text-xs text-bone focus:outline-none focus:border-amber float-right"
                >
                  <option value="processing">Processing</option>
                  <option value="confirmed">Confirmed</option>
                  <option value="out_for_delivery">Out for Delivery</option>
                  <option value="delivered">Delivered</option>
                  <option value="cancelled">Cancelled</option>
                </select>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

function CustomersTab() {
  const { showToast } = useToast()
  const [search, setSearch] = useState('')
  const { customers, toggleSuspend, remove, isLoading } = useCustomers(search)

  const handleSuspend = (id, status) => {
    toggleSuspend(id, status)
    showToast('Customer status updated', 'success')
  }

  const handleRemove = (id) => {
    remove(id)
    showToast('Customer removed', 'info')
  }

  return (
    <div>
      <div className="relative mb-6 max-w-xs">
        <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-silver" size={16} />
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search customers…"
          className="bg-graphite border border-graphite-light pl-9 pr-4 py-2.5 text-sm text-bone placeholder:text-silver-dim focus:outline-none focus:border-amber w-full"
        />
      </div>

      {isLoading ? (
        <p className="spec-strip text-silver text-sm uppercase tracking-widest">Loading customers…</p>
      ) : (
        <div className="overflow-x-auto border border-graphite-light">
          <table className="w-full text-sm min-w-[560px]">
            <thead>
              <tr className="border-b border-graphite-light text-left text-silver text-xs uppercase tracking-wide">
                <th className="p-4">Name</th>
                <th className="p-4">Email</th>
                <th className="p-4">Status</th>
                <th className="p-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {customers.map((c) => (
                <tr key={c.id} className="border-b border-graphite-light last:border-0">
                  <td className="p-4 text-bone">{c.name}</td>
                  <td className="p-4 text-silver">{c.email}</td>
                  <td className="p-4"><Badge variant={c.status === 'active' ? 'amber' : 'silver'}>{c.status}</Badge></td>
                  <td className="p-4">
                    <div className="flex items-center justify-end gap-4">
                      <button onClick={() => handleSuspend(c.id, c.status)} className="text-xs text-silver hover:text-bone uppercase tracking-wide">
                        {c.status === 'active' ? 'Suspend' : 'Reinstate'}
                      </button>
                      <button onClick={() => handleRemove(c.id)} className="text-silver hover:text-racing-red" aria-label="Delete"><FiTrash2 size={15} /></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}

function AnalyticsTab() {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <div className="border border-graphite-light p-6">
        <div className="flex items-center gap-2 mb-6">
          <FiTrendingUp className="text-amber" size={18} />
          <h3 className="font-display uppercase text-bone">Revenue — Last 6 Months</h3>
        </div>
        <ResponsiveContainer width="100%" height={260}>
          <LineChart data={REVENUE_DATA}>
            <CartesianGrid stroke="#232428" vertical={false} />
            <XAxis dataKey="month" stroke="#9ca0a8" fontSize={12} tickLine={false} axisLine={false} />
            <YAxis stroke="#9ca0a8" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(v) => `$${v / 1000}k`} />
            <Tooltip
              contentStyle={{ background: '#1a1b1e', border: '1px solid #232428', fontSize: 12 }}
              labelStyle={{ color: '#f6f5f2' }}
              formatter={(v) => formatPrice(v)}
            />
            <Line type="monotone" dataKey="revenue" stroke="#d91c2b" strokeWidth={2} dot={{ fill: '#d91c2b', r: 3 }} />
          </LineChart>
        </ResponsiveContainer>
      </div>

      <div className="border border-graphite-light p-6">
        <div className="flex items-center gap-2 mb-6">
          <FiPieChart className="text-amber" size={18} />
          <h3 className="font-display uppercase text-bone">Most Viewed Vehicles</h3>
        </div>
        <ResponsiveContainer width="100%" height={260}>
          <BarChart data={POPULAR_DATA} layout="vertical" margin={{ left: 20 }}>
            <CartesianGrid stroke="#232428" horizontal={false} />
            <XAxis type="number" stroke="#9ca0a8" fontSize={12} tickLine={false} axisLine={false} />
            <YAxis type="category" dataKey="model" stroke="#9ca0a8" fontSize={12} tickLine={false} axisLine={false} width={90} />
            <Tooltip contentStyle={{ background: '#1a1b1e', border: '1px solid #232428', fontSize: 12 }} labelStyle={{ color: '#f6f5f2' }} />
            <Bar dataKey="views" fill="#c6992f" />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}
