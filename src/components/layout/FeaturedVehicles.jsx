import { motion } from 'framer-motion'
import { NavLink } from 'react-router-dom'
import { FiArrowUpRight } from 'react-icons/fi'
import VehicleCard from '@/components/vehicle/VehicleCard'
import { VehicleCardSkeleton } from '@/components/ui/States'
import { useFeaturedVehicles } from '@/hooks/useVehicles'

export default function FeaturedVehicles() {
  const { vehicles, isLoading } = useFeaturedVehicles()

  return (
    <section className="mx-auto max-w-7xl px-6 lg:px-10 py-24">
      <div className="flex items-end justify-between mb-10">
        <div>
          <p className="spec-strip text-racing-red text-xs uppercase tracking-[0.3em] mb-2">01 — Inventory</p>
          <h2 className="font-display text-bone text-4xl lg:text-5xl uppercase">Featured Vehicles</h2>
        </div>
        <NavLink
          to="/shop"
          className="hidden sm:flex items-center gap-1 text-silver hover:text-bone text-sm font-display uppercase tracking-wide transition-colors"
        >
          View all <FiArrowUpRight />
        </NavLink>
      </div>

      <motion.div
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, margin: '-80px' }}
        variants={{ hidden: {}, show: { transition: { staggerChildren: 0.08 } } }}
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6"
      >
        {isLoading
          ? Array.from({ length: 4 }).map((_, i) => <VehicleCardSkeleton key={i} />)
          : vehicles.slice(0, 4).map((vehicle) => <VehicleCard key={vehicle.id} vehicle={vehicle} />)}
      </motion.div>
    </section>
  )
}
