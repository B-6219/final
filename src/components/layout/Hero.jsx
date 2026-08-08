import { motion } from 'framer-motion'
import { FiSearch } from 'react-icons/fi'
import Button from '@/components/ui/Button'

export default function Hero() {
  return (
    <section className="relative h-[92vh] min-h-[640px] flex items-end overflow-hidden">
      {/* Background image */}
      <div className="absolute inset-0">
        <img
          src="https://images.unsplash.com/photo-1503376780353-7e6692767b70?q=80&w=2000&auto=format&fit=crop"
          alt="Premium vehicle showcased in studio lighting"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-obsidian via-obsidian/60 to-obsidian/20" />
        <div className="absolute inset-0 bg-gradient-to-r from-obsidian/70 via-transparent to-transparent" />
      </div>

      <div className="relative mx-auto max-w-7xl w-full px-6 lg:px-10 pb-20">
        <motion.p
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="spec-strip text-amber text-xs uppercase tracking-[0.3em] mb-4"
        >
          Est. Nairobi — Curated Automotive Marketplace
        </motion.p>

        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.1 }}
          className="font-display uppercase text-bone text-5xl sm:text-6xl lg:text-8xl leading-[0.95] max-w-4xl"
        >
          Drive what<br /><span className="text-racing-red">commands</span> the room.
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.2 }}
          className="text-silver mt-6 max-w-lg text-base"
        >
          Every vehicle inspected, verified, and delivered. Browse a hand-picked
          inventory of the world's most desirable cars.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.3 }}
          className="mt-10 flex flex-col sm:flex-row gap-4"
        >
          <Button size="lg" icon={FiSearch}>Browse Inventory</Button>
          <Button size="lg" variant="outline">Sell Your Car</Button>
        </motion.div>

        {/* Search bar */}
        <motion.form
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.4 }}
          onSubmit={(e) => e.preventDefault()}
          className="mt-10 max-w-2xl bg-graphite/90 backdrop-blur-sm border border-graphite-light p-2 flex items-center gap-2"
        >
          <FiSearch className="text-silver ml-3" size={18} />
          <input
            type="text"
            placeholder="Search by brand, model, or keyword…"
            className="bg-transparent flex-1 py-3 text-sm text-bone placeholder:text-silver-dim focus:outline-none"
          />
          <Button type="submit" size="sm">Search</Button>
        </motion.form>
      </div>
    </section>
  )
}
