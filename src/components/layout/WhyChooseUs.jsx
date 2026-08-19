import { motion } from 'framer-motion'
import { FiShield, FiTruck, FiAward, FiRefreshCw } from 'react-icons/fi'

const REASONS = [
  { icon: FiShield, title: 'Verified Inspection', text: '150-point mechanical and cosmetic check on every listing.' },
  { icon: FiAward, title: 'Curated Inventory', text: 'Only vehicles that meet our quality and history standards.' },
  { icon: FiTruck, title: 'White-Glove Delivery', text: 'Nationwide delivery, tracked door to door.' },
  { icon: FiRefreshCw, title: '7-Day Returns', text: 'Not the right fit? Return it, no questions asked.' },
]

export default function WhyChooseUs() {
  return (
    <section className="bg-graphite border-y border-graphite-light">
      <div className="mx-auto max-w-7xl px-6 lg:px-10 py-24">
        <p className="spec-strip text-racing-red text-xs uppercase tracking-[0.3em] mb-2">03 — Why alhusnain Motors</p>
        <h2 className="font-display text-bone text-4xl lg:text-5xl uppercase mb-12">Built On Trust</h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {REASONS.map((r, i) => (
            <motion.div
              key={r.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: i * 0.08 }}
            >
              <r.icon size={28} className="text-amber mb-4" />
              <h3 className="font-display text-lg uppercase text-bone mb-2">{r.title}</h3>
              <p className="text-silver text-sm leading-relaxed">{r.text}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
