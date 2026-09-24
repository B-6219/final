import { useState } from 'react'
import { useParams, NavLink } from 'react-router-dom'
import { FiStar, FiCheck, FiPhone, FiMapPin } from 'react-icons/fi'
import { FaWhatsapp } from 'react-icons/fa'
import { Breadcrumbs, Avatar } from '@/components/ui/States'
import Badge from '@/components/ui/Badge'
import BikeCard from '@/components/bike/BikeCard'
import RatingBreakdown from '@/components/ui/RatingBreakdown'
import { formatMileage } from '@/lib/utils'
import { buildWhatsAppLink } from '@/lib/whatsapp'
import { useBike, useRelatedBikes } from '@/hooks/useBikes'
import { useRatings } from '@/hooks/useRatings'

const DEFAULT_FEATURES = ['ABS', 'LED Lighting', 'Digital Dashboard', 'Alloy Wheels']

export default function BikeDetails() {
  const { id } = useParams()
  const { bike, isLoading } = useBike(id)
  const { bikes: related } = useRelatedBikes(bike)
  const { overall, breakdown } = useRatings('bike', bike?.id)
  const [activeImage, setActiveImage] = useState(0)

  if (isLoading || !bike) {
    return (
      <div className="pt-28 pb-24 min-h-[60vh] flex items-center justify-center">
        <p className="spec-strip text-silver text-sm uppercase tracking-widest">Loading bike…</p>
      </div>
    )
  }

  const gallery = bike.images?.length ? bike.images : [bike.image, bike.image]
  const features = bike.features?.length ? bike.features : DEFAULT_FEATURES

  return (
    <div className="pt-28 pb-24">
      <div className="mx-auto max-w-7xl px-6 lg:px-10">
        <Breadcrumbs items={[{ label: 'Home', to: '/' }, { label: 'Bikes', to: '/bikes' }, { label: bike.model }]} />

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mt-8">
          <div>
            <div className="aspect-4/3 overflow-hidden bg-graphite border border-graphite-light mb-3">
              <img src={gallery[activeImage]} alt={bike.model} className="w-full h-full object-cover" />
            </div>
            {gallery.length > 1 && (
              <div className="grid grid-cols-3 gap-3">
                {gallery.map((img, i) => (
                  <button
                    key={i}
                    onClick={() => setActiveImage(i)}
                    className={`aspect-4/3 overflow-hidden border ${i === activeImage ? 'border-amber' : 'border-graphite-light'}`}
                  >
                    <img src={img} alt="" className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>

          <div>
            <div className="flex items-center justify-between">
              <p className="text-silver text-sm uppercase tracking-widest">{bike.brand}</p>
              <div className="flex items-center gap-2">
                {bike.featured && <Badge variant="amber">Featured</Badge>}
                <Badge variant="silver">{bike.bikeType}</Badge>
              </div>
            </div>
            <h1 className="font-display text-4xl lg:text-5xl uppercase text-bone mt-1">{bike.model}</h1>

            <div className="flex items-center gap-2 mt-3 text-amber text-sm">
              {Array.from({ length: 5 }).map((_, i) => (
                <FiStar key={i} size={14} className={i < Math.round(overall) ? 'fill-amber' : 'text-graphite-light'} />
              ))}
              <span className="text-silver">{overall.toFixed(1)} overall</span>
            </div>

            <div className="spec-strip grid grid-cols-2 sm:grid-cols-4 gap-px bg-graphite-light mt-6 border border-graphite-light">
              {[
                ['Year', bike.year],
                ['Mileage', formatMileage(bike.mileage)],
                ['Engine', `${bike.engineCapacity}cc`],
                ['Transmission', bike.transmission],
              ].map(([label, value]) => (
                <div key={label} className="bg-graphite p-3">
                  <p className="text-[10px] text-silver-dim uppercase">{label}</p>
                  <p className="text-bone text-sm mt-1">{value}</p>
                </div>
              ))}
            </div>

            <p className="text-silver text-sm leading-relaxed mt-6">
              {bike.description ||
                `A well-kept ${bike.year} ${bike.brand} ${bike.model}, fully inspected and ready to ride.`}
            </p>

            {breakdown.length > 0 && (
              <div className="mt-6">
                <RatingBreakdown breakdown={breakdown} />
              </div>
            )}

            <a
              href={buildWhatsAppLink(bike, { kind: 'bike' })}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-8 flex items-center justify-center gap-2 bg-[#25D366] text-obsidian font-display uppercase text-base tracking-wide py-4 hover:bg-[#1ebe5a] transition-colors"
            >
              <FaWhatsapp size={20} /> Enquire on WhatsApp
            </a>

            <div className="mt-8 border border-graphite-light p-5 flex items-center gap-4">
              <Avatar name={bike.dealerName || 'Al-Husnain Motors Nairobi'} size={44} />
              <div className="flex-1">
                <p className="text-bone text-sm font-medium">{bike.dealerName || 'Al-Husnain Motors Nairobi'}</p>
                <p className="text-silver-dim text-xs flex items-center gap-1 mt-0.5">
                  <FiMapPin size={12} /> {bike.dealerLocation || 'Westlands, Nairobi'}
                </p>
              </div>
              <a href="tel:+254791948411" className="text-amber hover:text-bone transition-colors"><FiPhone size={20} /></a>
            </div>
          </div>
        </div>

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

        {related.length > 0 && (
          <div className="mt-20">
            <div className="flex items-center justify-between mb-6">
              <h2 className="font-display text-2xl uppercase text-bone">Related Bikes</h2>
              <NavLink to="/bikes" className="text-silver hover:text-bone text-sm font-display uppercase">View all</NavLink>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
              {related.map((b) => <BikeCard key={b.id} bike={b} />)}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
