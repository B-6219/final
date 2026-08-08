import { Breadcrumbs } from '@/components/ui/States'

const SECTIONS = [
  { title: 'Acceptance of Terms', body: 'By using Chief Motors, you agree to these terms. If you do not agree, please discontinue use of the platform.' },
  { title: 'Vehicle Listings', body: 'All vehicles are inspected prior to listing, but buyers are encouraged to review the full inspection report and, where possible, arrange an independent inspection before purchase.' },
  { title: 'Orders & Payment', body: 'Orders are confirmed once payment is successfully processed. Prices are subject to change without notice until an order is placed.' },
  { title: 'Delivery', body: 'Estimated delivery timelines are provided at checkout and are not guaranteed. Chief Motors is not liable for delays caused by circumstances outside our control.' },
  { title: 'Returns', body: 'Vehicles may be returned within 7 days or 500 km of delivery, whichever comes first, subject to the vehicle being in its delivered condition.' },
  { title: 'Limitation of Liability', body: 'Chief Motors is not liable for indirect or consequential damages arising from use of the platform, to the fullest extent permitted by law.' },
]

export default function Terms() {
  return (
    <div className="pt-28 pb-24">
      <div className="mx-auto max-w-3xl px-6 lg:px-10">
        <Breadcrumbs items={[{ label: 'Home', to: '/' }, { label: 'Terms & Conditions' }]} />
        <h1 className="font-display text-4xl lg:text-5xl uppercase text-bone mt-4 mb-2">Terms & Conditions</h1>
        <p className="text-silver-dim text-sm mb-10">Last updated August 2026</p>

        <div className="flex flex-col gap-10">
          {SECTIONS.map((s) => (
            <div key={s.title}>
              <h2 className="font-display uppercase text-bone text-lg mb-2">{s.title}</h2>
              <p className="text-silver text-sm leading-relaxed">{s.body}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
