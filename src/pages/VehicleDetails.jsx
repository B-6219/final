import { useState } from 'react'
import { useParams, NavLink } from 'react-router-dom'
import { FiHeart, FiShuffle, FiStar, FiCheck, FiPhone, FiMapPin } from 'react-icons/fi'
import { Breadcrumbs, Avatar } from '@/components/ui/States'
import Button from '@/components/ui/Button'
import Badge from '@/components/ui/Badge'
import VehicleCard from '@/components/vehicle/VehicleCard'
import ReviewCard from '@/components/ui/ReviewCard'
import Modal from '@/components/ui/Modal'
import { formatPrice, formatMileage } from '@/lib/utils'
import { useToast } from '@/context/ToastContext'
import { useVehicle, useRelatedVehicles } from '@/hooks/useVehicles'
import { useReviews } from '@/hooks/useReviews'
import { useRecordView } from '@/hooks/useRecentlyViewed'
import { useCart } from '@/hooks/useCart'
import { useWishlist } from '@/hooks/useWishlist'

const DEFAULT_FEATURES = [
  'Leather Interior', 'Adaptive Cruise Control', 'Panoramic Sunroof', 'Premium Sound System',
  'Heated & Ventilated Seats', 'Lane Keep Assist', '360° Camera', 'Wireless CarPlay',
]

export default function VehicleDetails() {
  const { id } = useParams()
  const { showToast } = useToast()
  const { vehicle, isLoading } = useVehicle(id)
  const { vehicles: related } = useRelatedVehicles(vehicle)
  const { reviews, addReview, canReview } = useReviews(vehicle?.id)
  const { addItem } = useCart()
  const { has, toggle } = useWishlist()
  const [activeImage, setActiveImage] = useState(0)
  const [reviewModalOpen, setReviewModalOpen] = useState(false)
  const [reviewForm, setReviewForm] = useState({ rating: 5, title: '', comment: '' })

  useRecordView(vehicle?.id)

  if (isLoading || !vehicle) {
    return (
      <div className="pt-28 pb-24 min-h-[60vh] flex items-center justify-center">
        <p className="spec-strip text-silver text-sm uppercase tracking-widest">Loading vehicle…</p>
      </div>
    )
  }

  const gallery = vehicle.images?.length ? vehicle.images : [vehicle.image, vehicle.image, vehicle.image]
  const features = vehicle.features?.length ? vehicle.features : DEFAULT_FEATURES
  const wishlisted = has(vehicle.id)

  const submitReview = (e) => {
    e.preventDefault()
    addReview(reviewForm)
    setReviewModalOpen(false)
    setReviewForm({ rating: 5, title: '', comment: '' })
    showToast('Review submitted', 'success')
  }

  return (
    <div className="pt-28 pb-24">
      <div className="mx-auto max-w-7xl px-6 lg:px-10">
        <Breadcrumbs items={[{ label: 'Home', to: '/' }, { label: 'Shop', to: '/shop' }, { label: vehicle.model }]} />

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mt-8">
          {/* Gallery */}
          <div>
            <div className="aspect-[4/3] overflow-hidden bg-graphite border border-graphite-light mb-3">
              <img src={gallery[activeImage]} alt={vehicle.model} className="w-full h-full object-cover" />
            </div>
            <div className="grid grid-cols-3 gap-3">
              {gallery.map((img, i) => (
                <button
                  key={i}
                  onClick={() => setActiveImage(i)}
                  className={`aspect-[4/3] overflow-hidden border ${i === activeImage ? 'border-amber' : 'border-graphite-light'}`}
                >
                  <img src={img} alt="" className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          </div>

          {/* Info */}
          <div>
            <div className="flex items-center justify-between">
              <p className="text-silver text-sm uppercase tracking-widest">{vehicle.brand}</p>
              {vehicle.featured && <Badge variant="amber">Featured</Badge>}
            </div>
            <h1 className="font-display text-4xl lg:text-5xl uppercase text-bone mt-1">{vehicle.model}</h1>

            <div className="flex items-center gap-2 mt-3 text-amber text-sm">
              {Array.from({ length: 5 }).map((_, i) => (
                <FiStar key={i} size={14} className={i < Math.round(vehicle.rating) ? 'fill-amber' : 'text-graphite-light'} />
              ))}
              <span className="text-silver">{vehicle.rating.toFixed(1)} · {reviews.length} review{reviews.length !== 1 ? 's' : ''}</span>
            </div>

            <p className="font-display text-4xl text-bone mt-6">{formatPrice(vehicle.price)}</p>

            {/* Spec strip */}
            <div className="spec-strip grid grid-cols-2 sm:grid-cols-4 gap-px bg-graphite-light mt-6 border border-graphite-light">
              {[
                ['Year', vehicle.year],
                ['Mileage', formatMileage(vehicle.mileage)],
                ['Fuel', vehicle.fuel],
                ['Transmission', vehicle.transmission],
              ].map(([label, value]) => (
                <div key={label} className="bg-graphite p-3">
                  <p className="text-[10px] text-silver-dim uppercase">{label}</p>
                  <p className="text-bone text-sm mt-1">{value}</p>
                </div>
              ))}
            </div>

            <p className="text-silver text-sm leading-relaxed mt-6">
              {vehicle.description ||
                `A pristine ${vehicle.year} ${vehicle.brand} ${vehicle.model}, fully inspected and dealer-certified. Finished in a striking factory color with a meticulously maintained service history — this vehicle is ready for immediate delivery.`}
            </p>

            {/* Actions */}
            <div className="flex flex-col sm:flex-row gap-3 mt-8">
              <Button className="flex-1" onClick={() => { addItem(vehicle.id); showToast('Added to cart', 'success') }}>
                Add to Cart
              </Button>
              <NavLink to="/checkout" className="flex-1">
                <Button variant="amber" className="w-full" onClick={() => addItem(vehicle.id)}>Buy Now</Button>
              </NavLink>
            </div>
            <div className="flex gap-3 mt-3">
              <Button
                variant="outline"
                icon={FiHeart}
                onClick={() => { toggle(vehicle.id); showToast(wishlisted ? 'Removed from wishlist' : 'Saved to wishlist', 'success') }}
                className={`flex-1 ${wishlisted ? 'border-racing-red text-racing-red' : ''}`}
              >
                {wishlisted ? 'Wishlisted' : 'Wishlist'}
              </Button>
              <Button variant="outline" icon={FiShuffle} onClick={() => showToast('Added to compare', 'info')} className="flex-1">Compare</Button>
            </div>

            {/* Dealer info */}
            <div className="mt-8 border border-graphite-light p-5 flex items-center gap-4">
              <Avatar name={vehicle.dealerName || 'Chief Motors Nairobi'} size={44} />
              <div className="flex-1">
                <p className="text-bone text-sm font-medium">{vehicle.dealerName || 'Chief Motors Nairobi'}</p>
                <p className="text-silver-dim text-xs flex items-center gap-1 mt-0.5">
                  <FiMapPin size={12} /> {vehicle.dealerLocation || 'Westlands, Nairobi'}
                </p>
              </div>
              <a href="tel:+254700000000" className="text-amber hover:text-bone transition-colors"><FiPhone size={20} /></a>
            </div>
          </div>
        </div>

        {/* Features */}
        <div className="mt-20">
          <h2 className="font-display text-2xl uppercase text-bone mb-6">Features</h2>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {features.map((f) => (
              <div key={f} className="flex items-center gap-2 text-silver text-sm">
                <FiCheck className="text-amber shrink-0" size={16} /> {f}
              </div>
            ))}
          </div>
        </div>

        {/* Reviews */}
        <div className="mt-20">
          <div className="flex items-center justify-between mb-6">
            <h2 className="font-display text-2xl uppercase text-bone">Customer Reviews</h2>
            {canReview && (
              <Button size="sm" variant="outline" onClick={() => setReviewModalOpen(true)}>Write a Review</Button>
            )}
          </div>
          {reviews.length === 0 ? (
            <p className="text-silver text-sm">No reviews yet — be the first to share your experience.</p>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {reviews.map((r) => (
                <ReviewCard
                  key={r.id}
                  review={{
                    userName: r.user ? `${r.user.firstName ?? ''} ${r.user.lastName ?? ''}`.trim() || 'Verified Buyer' : 'Verified Buyer',
                    rating: r.rating,
                    title: r.title,
                    comment: r.comment,
                    createdAt: r.createdAt,
                  }}
                />
              ))}
            </div>
          )}
        </div>

        {/* Related */}
        {related.length > 0 && (
          <div className="mt-20">
            <div className="flex items-center justify-between mb-6">
              <h2 className="font-display text-2xl uppercase text-bone">Related Vehicles</h2>
              <NavLink to="/shop" className="text-silver hover:text-bone text-sm font-display uppercase">View all</NavLink>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
              {related.map((v) => <VehicleCard key={v.id} vehicle={v} />)}
            </div>
          </div>
        )}
      </div>

      <Modal open={reviewModalOpen} onClose={() => setReviewModalOpen(false)} title="Write a Review">
        <form onSubmit={submitReview} className="flex flex-col gap-4">
          <div>
            <p className="text-xs text-silver uppercase tracking-wide mb-2">Rating</p>
            <div className="flex gap-1">
              {[1, 2, 3, 4, 5].map((n) => (
                <button type="button" key={n} onClick={() => setReviewForm({ ...reviewForm, rating: n })}>
                  <FiStar size={22} className={n <= reviewForm.rating ? 'text-amber fill-amber' : 'text-graphite-light'} />
                </button>
              ))}
            </div>
          </div>
          <input
            placeholder="Title (optional)"
            value={reviewForm.title}
            onChange={(e) => setReviewForm({ ...reviewForm, title: e.target.value })}
            className="bg-obsidian border border-graphite-light px-4 py-2.5 text-sm text-bone placeholder:text-silver-dim focus:outline-none focus:border-amber"
          />
          <textarea
            required
            placeholder="Share your experience…"
            value={reviewForm.comment}
            onChange={(e) => setReviewForm({ ...reviewForm, comment: e.target.value })}
            rows={4}
            className="bg-obsidian border border-graphite-light px-4 py-2.5 text-sm text-bone placeholder:text-silver-dim focus:outline-none focus:border-amber resize-none"
          />
          <Button type="submit">Submit Review</Button>
        </form>
      </Modal>
    </div>
  )
}
