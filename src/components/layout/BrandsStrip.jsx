import { motion } from 'framer-motion'
import { NavLink } from 'react-router-dom'
import { useBrands } from '@/hooks/useTaxonomy'

export default function BrandsStrip() {
  const { brands } = useBrands()

  return (
    <section className="border-y border-graphite-light bg-graphite/40 py-10">
      <div className="mx-auto max-w-7xl px-6 lg:px-10">
        <p className="spec-strip text-silver-dim text-xs uppercase tracking-[0.3em] text-center mb-8">
          Trusted Marques In Our Inventory
        </p>
        <motion.div
          initial="hidden"
          whileInView="show"
          viewport={{ once: true }}
          variants={{ hidden: {}, show: { transition: { staggerChildren: 0.05 } } }}
          className="flex flex-wrap justify-center gap-x-12 gap-y-6"
        >
          {brands.map((brand) => (
            <motion.div
              key={brand._id}
              variants={{ hidden: { opacity: 0, y: 8 }, show: { opacity: 1, y: 0 } }}
            >
              <NavLink
                to={`/shop?brand=${encodeURIComponent(brand.name)}`}
                className="font-display text-lg uppercase tracking-wide text-silver hover:text-bone transition-colors"
              >
                {brand.name}
              </NavLink>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  )
}
