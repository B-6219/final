import { motion } from 'framer-motion'
import { NavLink } from 'react-router-dom'
import { useCategories } from '@/hooks/useTaxonomy'

export default function CategoriesGrid() {
  const { categories } = useCategories()

  return (
    <section className="mx-auto max-w-7xl px-6 lg:px-10 py-24">
      <p className="spec-strip text-racing-red text-xs uppercase tracking-[0.3em] mb-2">02 — Browse By</p>
      <h2 className="font-display text-bone text-4xl lg:text-5xl uppercase mb-10">Vehicle Categories</h2>

      <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
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
              className="group relative border border-graphite-light p-8 flex items-end justify-between h-40 hover:border-amber transition-colors overflow-hidden"
            >
              <span className="font-display text-2xl uppercase text-bone">{cat.name}</span>
              {cat.count != null && <span className="spec-strip text-silver-dim text-sm">{cat.count}</span>}
              <div className="absolute inset-0 bg-racing-red/0 group-hover:bg-racing-red/5 transition-colors" />
            </NavLink>
          </motion.div>
        ))}
      </div>
    </section>
  )
}
