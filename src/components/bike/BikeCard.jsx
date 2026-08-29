import { motion } from 'framer-motion'
import { FiStar } from 'react-icons/fi'
import { FaWhatsapp } from 'react-icons/fa'
import { NavLink } from 'react-router-dom'
import Badge from '@/components/ui/Badge'
import { formatMileage } from '@/lib/utils'
import { buildWhatsAppLink } from '@/lib/whatsapp'

export default function BikeCard({ bike }) {
  const { id, brand, model, year, mileage, engineCapacity, bikeType, image, featured, rating } = bike

  return (
    <motion.article
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-60px' }}
      transition={{ duration: 0.5 }}
      className="group bg-graphite border border-graphite-light hover:border-silver-dim transition-colors duration-300"
    >
      <div className="relative overflow-hidden aspect-[4/3]">
        <NavLink to={`/bikes/${id}`}>
          <img
            src={image}
            alt={`${year} ${brand} ${model}`}
            loading="lazy"
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />
        </NavLink>
        {featured && <Badge variant="amber" className="absolute top-3 left-3">Featured</Badge>}
        <Badge variant="silver" className="absolute top-3 right-3">{bikeType}</Badge>
      </div>

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

        <div className="spec-strip mt-4 grid grid-cols-3 text-[11px] text-silver border-y border-graphite-light py-2">
          <span className="border-r border-graphite-light pr-2">{year}</span>
          <span className="border-r border-graphite-light px-2 truncate">{formatMileage(mileage)}</span>
          <span className="pl-2 truncate">{engineCapacity}cc</span>
        </div>

        <a
          href={buildWhatsAppLink(bike, { kind: 'bike' })}
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
