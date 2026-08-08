import { useState, useMemo } from 'react'
import { NavLink } from 'react-router-dom'
import { FiTrash2, FiBookmark, FiArrowUpRight } from 'react-icons/fi'
import { Breadcrumbs, EmptyState } from '@/components/ui/States'
import Button from '@/components/ui/Button'
import { formatPrice } from '@/lib/utils'
import { useToast } from '@/context/ToastContext'
import { useCart } from '@/hooks/useCart'

export default function Cart() {
  const { showToast } = useToast()
  const { items, updateQuantity, removeItem, toggleSavedForLater, isLoading } = useCart()
  const [coupon, setCoupon] = useState('')
  const [discount, setDiscount] = useState(0)

  const activeItems = items.filter((i) => !i.savedForLater)
  const savedItems = items.filter((i) => i.savedForLater)

  const subtotal = useMemo(
    () => activeItems.reduce((sum, i) => sum + (i.vehicle?.price ?? 0) * i.quantity, 0),
    [activeItems]
  )
  const tax = subtotal * 0.08
  const shipping = activeItems.length > 0 ? 1200 : 0
  const total = subtotal + tax + shipping - discount

  const applyCoupon = () => {
    if (coupon.trim().toUpperCase() === 'CHIEF10') {
      setDiscount(subtotal * 0.1)
      showToast('Coupon applied — 10% off', 'success')
    } else {
      setDiscount(0)
      showToast('Invalid or expired coupon code', 'error')
    }
  }

  if (isLoading) {
    return (
      <div className="pt-28 min-h-[50vh] flex items-center justify-center">
        <p className="spec-strip text-silver text-sm uppercase tracking-widest">Loading cart…</p>
      </div>
    )
  }

  if (items.length === 0) {
    return (
      <div className="pt-28">
        <EmptyState
          title="Your cart is empty"
          message="Browse the inventory and add a vehicle to get started."
          action={<NavLink to="/shop"><Button>Browse Inventory</Button></NavLink>}
        />
      </div>
    )
  }

  return (
    <div className="pt-28 pb-24">
      <div className="mx-auto max-w-7xl px-6 lg:px-10">
        <Breadcrumbs items={[{ label: 'Home', to: '/' }, { label: 'Cart' }]} />
        <h1 className="font-display text-4xl lg:text-5xl uppercase text-bone mt-4 mb-10">Shopping Cart</h1>

        <div className="grid grid-cols-1 lg:grid-cols-[1fr_360px] gap-10">
          <div className="flex flex-col gap-4">
            {activeItems.map((item) => (
              <CartRow key={item.id} item={item} onQty={updateQuantity} onRemove={removeItem} onSave={toggleSavedForLater} />
            ))}

            {savedItems.length > 0 && (
              <div className="mt-8">
                <h3 className="font-display uppercase text-silver text-sm mb-4">Saved For Later</h3>
                <div className="flex flex-col gap-4">
                  {savedItems.map((item) => (
                    <CartRow key={item.id} item={item} onQty={updateQuantity} onRemove={removeItem} onSave={toggleSavedForLater} saved />
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Order summary */}
          <aside className="border border-graphite-light p-6 h-fit sticky top-28">
            <h3 className="font-display uppercase text-bone text-lg mb-6">Order Summary</h3>
            <div className="flex flex-col gap-3 text-sm">
              <Row label="Subtotal" value={formatPrice(subtotal)} />
              <Row label="Estimated Tax" value={formatPrice(tax)} />
              <Row label="Shipping" value={formatPrice(shipping)} />
              {discount > 0 && <Row label="Discount" value={`-${formatPrice(discount)}`} highlight />}
            </div>

            <div className="flex gap-2 my-5">
              <input
                value={coupon}
                onChange={(e) => setCoupon(e.target.value)}
                placeholder="Discount code (try CHIEF10)"
                className="flex-1 bg-obsidian border border-graphite-light px-3 py-2 text-sm text-bone placeholder:text-silver-dim focus:outline-none focus:border-amber"
              />
              <Button size="sm" variant="outline" onClick={applyCoupon}>Apply</Button>
            </div>

            <div className="border-t border-graphite-light pt-4 flex items-center justify-between">
              <span className="font-display uppercase text-bone">Total</span>
              <span className="font-display text-2xl text-bone">{formatPrice(total)}</span>
            </div>

            <NavLink to="/checkout">
              <Button size="lg" className="w-full mt-6" icon={FiArrowUpRight} iconPosition="right">
                Proceed to Checkout
              </Button>
            </NavLink>
          </aside>
        </div>
      </div>
    </div>
  )
}

function CartRow({ item, onQty, onRemove, onSave, saved }) {
  const v = item.vehicle
  if (!v) return null
  return (
    <div className="flex gap-4 border border-graphite-light p-4">
      <img src={v.image} alt={v.model} className="w-28 h-20 object-cover shrink-0" />
      <div className="flex-1">
        <p className="text-silver text-xs uppercase">{v.brand}</p>
        <h4 className="font-display uppercase text-bone">{v.model}</h4>
        <p className="text-bone text-sm mt-1">{formatPrice(v.price)}</p>
      </div>
      <div className="flex flex-col items-end justify-between">
        <div className="flex gap-3 text-silver">
          <button onClick={() => onSave(item.id, !item.savedForLater)} aria-label="Save for later" className={saved ? 'text-amber' : 'hover:text-bone'}>
            <FiBookmark size={16} />
          </button>
          <button onClick={() => onRemove(item.id)} aria-label="Remove" className="hover:text-racing-red">
            <FiTrash2 size={16} />
          </button>
        </div>
        {!saved && (
          <div className="flex items-center border border-graphite-light">
            <button onClick={() => onQty(item.id, Math.max(1, item.quantity - 1))} className="px-2.5 py-1 text-silver hover:text-bone">–</button>
            <span className="px-3 text-bone text-sm">{item.quantity}</span>
            <button onClick={() => onQty(item.id, item.quantity + 1)} className="px-2.5 py-1 text-silver hover:text-bone">+</button>
          </div>
        )}
      </div>
    </div>
  )
}

function Row({ label, value, highlight }) {
  return (
    <div className="flex justify-between">
      <span className="text-silver">{label}</span>
      <span className={highlight ? 'text-amber' : 'text-bone'}>{value}</span>
    </div>
  )
}
