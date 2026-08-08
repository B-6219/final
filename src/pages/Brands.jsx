import { NavLink } from 'react-router-dom'
import { motion } from 'framer-motion'
import { FiArrowUpRight } from 'react-icons/fi'
import { Breadcrumbs } from '@/components/ui/States'
import { useBrands } from '@/hooks/useTaxonomy'
import { useVehicleList } from '@/hooks/useVehicles'

export default function Brands() {
  const { brands } = useBrands()
  const { vehicles } = useVehicleList()

  return (
    <div className="pt-28 pb-24">
      <div className="mx-auto max-w-7xl px-6 lg:px-10">
        <Breadcrumbs items={[{ label: 'Home', to: '/' }, { label: 'Brands' }]} />
        <h1 className="font-display text-4xl lg:text-5xl uppercase text-bone mt-4 mb-10">Our Brands</h1>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {brands.map((brand, i) => {
            const count = vehicles.filter((v) => v.brand === brand.name).length
            return (
              <motion.div
                key={brand._id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: i * 0.04 }}
              >
                <NavLink
                  to={`/shop?brand=${encodeURIComponent(brand.name)}`}
                  className="group border border-graphite-light p-8 flex flex-col justify-between h-40 hover:border-amber transition-colors block"
                >
                  <span className="font-display text-xl uppercase text-bone">{brand.name}</span>
                  <div className="flex items-center justify-between">
                    <span className="spec-strip text-silver-dim text-sm">{count} listed</span>
                    <FiArrowUpRight className="text-silver group-hover:text-amber transition-colors" size={18} />
                  </div>
                </NavLink>
              </motion.div>
            )
          })}
        </div>
      </div>
    </div>
  )
}
