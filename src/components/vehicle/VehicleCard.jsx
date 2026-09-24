import { motion } from 'framer-motion'
import { FiHeart, FiShuffle, FiStar } from 'react-icons/fi'
import { FaWhatsapp } from 'react-icons/fa'
import { NavLink } from 'react-router-dom'
import Badge from '@/components/ui/Badge'
import { formatMileage, cn } from '@/lib/utils'
import { buildWhatsAppLink } from '@/lib/whatsapp'
import { useWishlist } from '@/hooks/useWishlist'
import { useToast } from '@/context/ToastContext'

/**
 * Signature component: styled like an automotive window sticker.
 * The spec-strip (mono font, uppercase, divided cells) is the
 * one distinctive, memorable element of the catalog UI.
 *
 * No pricing is ever shown — every listing routes to WhatsApp instead,
 * matching how the dealership actually sells.
 */
export default function VehicleCard({ vehicle }) {
  const { id, brand, model, year, mileage, fuel, transmission, image, featured, rating } = vehicle
  const { has, toggle } = useWishlist()
  const { showToast } = useToast()
  const wishlisted = has(id)

  return (
    <motion.article
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-60px' }}
      transition={{ duration: 0.5 }}
      className="group bg-graphite border border-graphite-light hover:border-silver-dim transition-colors duration-300"
    >
      {/* Image */}
      <div className="relative overflow-hidden aspect-4/3">
        <NavLink to={`/vehicles/${id}`}>
          <img
            src={image}
            alt={`${year} ${brand} ${model}`}
            loading="lazy"
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />
        </NavLink>
        {featured && (
          <Badge variant="amber" className="absolute top-3 left-3">Featured</Badge>
        )}
        <div className="absolute top-3 right-3 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <IconBtn
            label="Add to wishlist"
            active={wishlisted}
            onClick={() => { toggle(id); showToast(wishlisted ? 'Removed from wishlist' : 'Saved to wishlist', 'success') }}
          >
            <FiHeart size={16} className={wishlisted ? 'fill-current' : ''} />
          </IconBtn>
          <IconBtn label="Compare" onClick={() => showToast('Added to compare', 'info')}>
            <FiShuffle size={16} />
          </IconBtn>
        </div>
      </div>

      {/* Body */}
      <div className="p-5">
        <div className="flex items-start justify-between gap-2">
          <div>
            <p className="text-silver text-xs uppercase tracking-widest">{brand}</p>
            <h3 className="font-display text-xl text-bone uppercase leading-tight">{model}</h3>
          </div>
          <div className="flex items-center gap-1 text-amber text-sm shrink-0">
            <FiStar size={14} className="fill-amber" />
            {rating.toFixed(1)}
          </div>
        </div>

        {/* Spec strip — the signature element */}
        <div className="spec-strip mt-4 grid grid-cols-4 text-[11px] text-silver border-y border-graphite-light py-2">
          <span className="border-r border-graphite-light pr-2">{year}</span>
          <span className="border-r border-graphite-light px-2 truncate">{formatMileage(mileage)}</span>
          <span className="border-r border-graphite-light px-2 truncate">{fuel}</span>
          <span className="pl-2 truncate">{transmission}</span>
        </div>

        <a
          href={buildWhatsAppLink(vehicle)}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-4 flex items-center justify-center gap-2 bg-[#25D366] text-obsidian font-display uppercase text-sm tracking-wide py-2.5 hover:bg-[#1ebe5a] transition-colors"
        >
          <FaWhatsapp size={17} /> Enquire on WhatsApp
        </a>
      </div>
    </motion.article>
  )
}

function IconBtn({ children, label, onClick, active }) {
  return (
    <button
      aria-label={label}
      onClick={onClick}
      className={cn(
        'p-2 backdrop-blur-sm transition-colors',
        active ? 'bg-racing-red text-bone' : 'bg-obsidian/80 text-bone hover:bg-racing-red'
      )}
    >
      {children}
    </button>
  )
}
