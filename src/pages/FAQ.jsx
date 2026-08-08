import { useState } from 'react'
import { FiPlus, FiMinus } from 'react-icons/fi'
import { Breadcrumbs } from '@/components/ui/States'

const FAQS = [
  { q: 'How does vehicle inspection work?', a: 'Every vehicle undergoes a 150-point mechanical and cosmetic inspection by certified technicians before it\u2019s listed. The full report is attached to the listing.' },
  { q: 'Can I return a vehicle after purchase?', a: 'Yes — you have 7 days or 500 km (whichever comes first) to return a vehicle for a full refund if it doesn\u2019t meet expectations.' },
  { q: 'What payment methods do you accept?', a: 'We support card payments via Stripe and mobile money via M-Pesa. Financing options are available at checkout for qualifying vehicles.' },
  { q: 'Do you deliver nationwide?', a: 'Yes, we deliver to all major cities and most rural areas. Delivery timelines and costs are calculated at checkout based on your address.' },
  { q: 'How do I sell my car through Chief Motors?', a: 'Use the "Sell Your Car" button on the homepage to submit your vehicle details. Our team will schedule an inspection and provide a valuation within 48 hours.' },
  { q: 'Is financing available?', a: 'Financing is available on select vehicles through our lending partners. Eligibility and rates are shown on the vehicle details page before checkout.' },
]

export default function FAQ() {
  const [open, setOpen] = useState(0)

  return (
    <div className="pt-28 pb-24">
      <div className="mx-auto max-w-3xl px-6 lg:px-10">
        <Breadcrumbs items={[{ label: 'Home', to: '/' }, { label: 'FAQ' }]} />
        <h1 className="font-display text-4xl lg:text-5xl uppercase text-bone mt-4 mb-10">Frequently Asked Questions</h1>

        <div className="flex flex-col border-t border-graphite-light">
          {FAQS.map((item, i) => {
            const isOpen = open === i
            return (
              <div key={item.q} className="border-b border-graphite-light">
                <button
                  onClick={() => setOpen(isOpen ? -1 : i)}
                  className="w-full flex items-center justify-between py-5 text-left"
                  aria-expanded={isOpen}
                >
                  <span className="font-display uppercase text-bone text-base pr-4">{item.q}</span>
                  {isOpen ? <FiMinus className="text-racing-red shrink-0" /> : <FiPlus className="text-silver shrink-0" />}
                </button>
                {isOpen && <p className="text-silver text-sm leading-relaxed pb-5 pr-8">{item.a}</p>}
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}
