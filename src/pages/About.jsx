import { motion } from 'framer-motion'
import { FiShield, FiAward, FiUsers, FiTruck } from 'react-icons/fi'
import { Breadcrumbs } from '@/components/ui/States'

const STATS = [
  { label: 'Vehicles Delivered', value: '4,200+' },
  { label: 'Cities Served', value: '18' },
  { label: 'Avg. Rating', value: '4.8/5' },
  { label: 'Years in Business', value: '9' },
]

const VALUES = [
  { icon: FiShield, title: 'Radical Transparency', text: 'Every inspection report, every service record — visible before you buy, not after.' },
  { icon: FiAward, title: 'Uncompromising Quality', text: 'We reject more vehicles than we list. If it wouldn\u2019t pass our own standard, it doesn\u2019t reach the floor.' },
  { icon: FiUsers, title: 'People First', text: 'A dedicated advisor for every customer, from first browse to final delivery.' },
  { icon: FiTruck, title: 'Delivered, Not Just Sold', text: 'White-glove delivery to your door, nationwide — because the sale isn\u2019t the finish line.' },
]

export default function About() {
  return (
    <div className="pt-28 pb-24">
      <div className="mx-auto max-w-7xl px-6 lg:px-10">
        <Breadcrumbs items={[{ label: 'Home', to: '/' }, { label: 'About' }]} />

        <div className="max-w-3xl mt-6">
          <p className="spec-strip text-racing-red text-xs uppercase tracking-[0.3em] mb-4">Our Story</p>
          <h1 className="font-display text-4xl lg:text-6xl uppercase text-bone leading-tight">
            Built by people who actually love cars.
          </h1>
          <p className="text-silver mt-6 leading-relaxed">
            alhusnain Motors started with a simple frustration: buying a premium vehicle online meant
            trusting photos and a spec sheet, and nothing else. We built the marketplace we wished
            existed — every vehicle inspected in person, every listing backed by a real advisor,
            every delivery tracked door to door.
          </p>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 mt-16 border-y border-graphite-light py-10">
          {STATS.map((s) => (
            <div key={s.label}>
              <p className="font-display text-4xl text-bone">{s.value}</p>
              <p className="text-silver text-sm mt-1">{s.label}</p>
            </div>
          ))}
        </div>

        <div className="mt-20">
          <h2 className="font-display text-3xl uppercase text-bone mb-10">What We Stand For</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {VALUES.map((v, i) => (
              <motion.div
                key={v.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: i * 0.08 }}
              >
                <v.icon size={26} className="text-amber mb-4" />
                <h3 className="font-display text-lg uppercase text-bone mb-2">{v.title}</h3>
                <p className="text-silver text-sm leading-relaxed">{v.text}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
