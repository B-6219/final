import { useState } from 'react'
import { FiMapPin, FiPhone, FiMail, FiClock } from 'react-icons/fi'
import { Breadcrumbs } from '@/components/ui/States'
import Input from '@/components/ui/Input'
import Button from '@/components/ui/Button'
import { useToast } from '@/context/ToastContext'

const CONTACT_INFO = [
  { icon: FiMapPin, label: 'Showroom', value: 'Westlands, Nairobi, Kenya' },
  { icon: FiPhone, label: 'Phone', value: '+254 700 000 000' },
  { icon: FiMail, label: 'Email', value: 'hello@chiefmotors.co.ke' },
  { icon: FiClock, label: 'Hours', value: 'Mon – Sat, 9am – 6pm' },
]

export default function Contact() {
  const { showToast } = useToast()
  const [form, setForm] = useState({ name: '', email: '', message: '' })
  const [submitting, setSubmitting] = useState(false)

  const handleSubmit = (e) => {
    e.preventDefault()
    setSubmitting(true)
    // NOTE: wire this to a Convex mutation (e.g. api.contact.submit) once
    // the backend is connected. For now it just confirms locally.
    setTimeout(() => {
      setSubmitting(false)
      setForm({ name: '', email: '', message: '' })
      showToast('Message sent — we\u2019ll be in touch shortly.', 'success')
    }, 700)
  }

  return (
    <div className="pt-28 pb-24">
      <div className="mx-auto max-w-7xl px-6 lg:px-10">
        <Breadcrumbs items={[{ label: 'Home', to: '/' }, { label: 'Contact' }]} />
        <h1 className="font-display text-4xl lg:text-5xl uppercase text-bone mt-4 mb-10">Get In Touch</h1>

        <div className="grid grid-cols-1 lg:grid-cols-[1fr_1.2fr] gap-16">
          <div>
            <p className="text-silver leading-relaxed mb-10">
              Whether you're browsing our inventory, want to sell your car, or just have a
              question — our team responds within one business day.
            </p>
            <div className="flex flex-col gap-6">
              {CONTACT_INFO.map((c) => (
                <div key={c.label} className="flex items-center gap-4">
                  <div className="p-3 border border-graphite-light text-amber shrink-0"><c.icon size={18} /></div>
                  <div>
                    <p className="text-silver-dim text-xs uppercase tracking-wide">{c.label}</p>
                    <p className="text-bone text-sm mt-0.5">{c.value}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <form onSubmit={handleSubmit} className="flex flex-col gap-5">
            <Input
              id="name" label="Full Name" required
              value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })}
              placeholder="Jane Doe"
            />
            <Input
              id="email" label="Email" type="email" required
              value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })}
              placeholder="jane@email.com"
            />
            <Input
              id="message" label="Message" as="textarea" rows={6} required
              value={form.message} onChange={(e) => setForm({ ...form, message: e.target.value })}
              placeholder="How can we help?"
            />
            <Button type="submit" size="lg" disabled={submitting} className="self-start">
              {submitting ? 'Sending…' : 'Send Message'}
            </Button>
          </form>
        </div>
      </div>
    </div>
  )
}
