import { NavLink } from 'react-router-dom'
import { FiHeart, FiShoppingCart, FiTrash2 } from 'react-icons/fi'
import { Breadcrumbs, EmptyState } from '@/components/ui/States'
import Button from '@/components/ui/Button'
import { formatPrice, formatMileage } from '@/lib/utils'
import { useToast } from '@/context/ToastContext'
import { useWishlist } from '@/hooks/useWishlist'
import { useCart } from '@/hooks/useCart'

export default function Wishlist() {
  const { showToast } = useToast()
  const { items, remove, isLoading } = useWishlist()
  const { addItem } = useCart()

  const moveToCart = (wishlistId, vehicleId) => {
    addItem(vehicleId)
    remove(wishlistId)
    showToast('Moved to cart', 'success')
  }

  const handleRemove = (wishlistId) => {
    remove(wishlistId)
    showToast('Removed from wishlist', 'info')
  }

  if (isLoading) {
    return (
      <div className="pt-28 min-h-[50vh] flex items-center justify-center">
        <p className="spec-strip text-silver text-sm uppercase tracking-widest">Loading wishlist…</p>
      </div>
    )
  }

  return (
    <div className="pt-28 pb-24">
      <div className="mx-auto max-w-7xl px-6 lg:px-10">
        <Breadcrumbs items={[{ label: 'Home', to: '/' }, { label: 'Wishlist' }]} />
        <h1 className="font-display text-4xl lg:text-5xl uppercase text-bone mt-4 mb-10">Wishlist</h1>

        {items.length === 0 ? (
          <EmptyState
            icon={FiHeart}
            title="Your wishlist is empty"
            message="Save vehicles you're considering so they're easy to find later."
            action={<NavLink to="/shop"><Button>Browse Inventory</Button></NavLink>}
          />
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {items.map(({ wishlistId, vehicle: v }) => {
              if (!v) return null
              return (
                <div key={wishlistId} className="bg-graphite border border-graphite-light group">
                  <div className="relative aspect-[4/3] overflow-hidden">
                    <NavLink to={`/vehicles/${v.id}`}>
                      <img
                        src={v.image}
                        alt={`${v.year} ${v.brand} ${v.model}`}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                    </NavLink>
                    <button
                      onClick={() => handleRemove(wishlistId)}
                      aria-label="Remove from wishlist"
                      className="absolute top-3 right-3 p-2 bg-obsidian/80 backdrop-blur-sm text-racing-red hover:bg-racing-red hover:text-bone transition-colors"
                    >
                      <FiTrash2 size={16} />
                    </button>
                  </div>
                  <div className="p-5">
                    <p className="text-silver text-xs uppercase tracking-widest">{v.brand}</p>
                    <h3 className="font-display text-xl text-bone uppercase leading-tight">{v.model}</h3>
                    <p className="spec-strip text-silver text-xs mt-2">
                      {v.year} · {formatMileage(v.mileage)} · {v.fuel}
                    </p>
                    <div className="mt-4 flex items-center justify-between">
                      <p className="font-display text-xl text-bone">{formatPrice(v.price)}</p>
                      <Button size="sm" icon={FiShoppingCart} onClick={() => moveToCart(wishlistId, v.id)}>
                        Add to Cart
                      </Button>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}
