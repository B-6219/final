import { NavLink } from 'react-router-dom'
import { FiInstagram, FiTwitter, FiFacebook, FiYoutube } from 'react-icons/fi'
import { FOOTER_LINKS } from '@/constants/navigation'
import Button from '@/components/ui/Button'

export default function Footer() {
  return (
    <footer className="bg-graphite border-t border-graphite-light">
      {/* Newsletter strip */}
      <div className="border-b border-graphite-light">
        <div className="mx-auto max-w-7xl px-6 lg:px-10 py-14 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
          <div>
            <h3 className="font-display text-2xl uppercase tracking-wide text-bone">
              Get first access to new arrivals
            </h3>
            <p className="text-silver mt-2 text-sm">Curated listings, delivered before they hit the shop.</p>
          </div>
          <form
            onSubmit={(e) => e.preventDefault()}
            className="flex w-full lg:w-auto gap-3"
          >
            <input
              type="email"
              required
              placeholder="you@email.com"
              className="bg-obsidian border border-silver-dim px-4 py-3 text-sm text-bone placeholder:text-silver-dim flex-1 lg:w-72 focus:outline-none focus:border-amber"
            />
            <Button type="submit" variant="amber">Subscribe</Button>
          </form>
        </div>
      </div>

      {/* Link columns */}
      <div className="mx-auto max-w-7xl px-6 lg:px-10 py-14 grid grid-cols-2 lg:grid-cols-5 gap-10">
        <div className="col-span-2">
          <p className="font-display text-2xl tracking-widest text-bone">
            CHIEF <span className="text-racing-red">MOTORS</span>
          </p>
          <p className="text-silver text-sm mt-4 max-w-xs">
            A premium marketplace for buying and selling vehicles, built on trust,
            quality inspection, and white-glove delivery.
          </p>
          <div className="flex gap-4 mt-6 text-silver">
            <FiInstagram className="hover:text-bone cursor-pointer" />
            <FiTwitter className="hover:text-bone cursor-pointer" />
            <FiFacebook className="hover:text-bone cursor-pointer" />
            <FiYoutube className="hover:text-bone cursor-pointer" />
          </div>
        </div>

        <FooterColumn title="Company" links={FOOTER_LINKS.company} />
        <FooterColumn title="Support" links={FOOTER_LINKS.support} />
        <FooterColumn title="Legal" links={FOOTER_LINKS.legal} />
      </div>

      <div className="border-t border-graphite-light py-6 text-center text-xs text-silver-dim">
        © {new Date().getFullYear()} Chief Motors. All rights reserved.
      </div>
    </footer>
  )
}

function FooterColumn({ title, links }) {
  return (
    <div>
      <h4 className="font-display uppercase tracking-wide text-sm text-bone mb-4">{title}</h4>
      <ul className="flex flex-col gap-3">
        {links.map((link) => (
          <li key={link.to}>
            <NavLink to={link.to} className="text-silver text-sm hover:text-amber transition-colors">
              {link.label}
            </NavLink>
          </li>
        ))}
      </ul>
    </div>
  )
}
