import { NavLink } from 'react-router-dom'
import { motion } from 'framer-motion'
import { FiArrowUpRight } from 'react-icons/fi'
import { Breadcrumbs } from '@/components/ui/States'
import { useCategories } from '@/hooks/useTaxonomy'

export default function Categories() {
  const { categories } = useCategories()

  return (
    <div className="pt-28 pb-24">
      <div className="mx-auto max-w-7xl px-6 lg:px-10">
        <Breadcrumbs items={[{ label: 'Home', to: '/' }, { label: 'Categories' }]} />
        <h1 className="font-display text-4xl lg:text-5xl uppercase text-bone mt-4 mb-10">Vehicle Categories</h1>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {categories.map((cat, i) => (
            <motion.div
              key={cat._id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: i * 0.05 }}
            >
              <NavLink
                to={`/shop?category=${encodeURIComponent(cat.name)}`}
                className="group relative border border-graphite-light p-10 flex flex-col justify-between h-56 hover:border-amber transition-colors overflow-hidden block"
              >
                <div className="absolute inset-0 bg-racing-red/0 group-hover:bg-racing-red/5 transition-colors" />
                <span className="spec-strip text-silver-dim text-xs">{String(i + 1).padStart(2, '0')}</span>
                <div className="flex items-end justify-between">
                  <span className="font-display text-3xl uppercase text-bone">{cat.name}</span>
                  <FiArrowUpRight className="text-silver group-hover:text-amber transition-colors" size={22} />
                </div>
                {cat.count != null && <span className="spec-strip text-silver-dim text-sm">{cat.count} vehicles</span>}
              </NavLink>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  )
}
