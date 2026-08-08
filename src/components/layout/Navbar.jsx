import { useState, useEffect } from 'react'
import { NavLink } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { FiMenu, FiX, FiSearch, FiHeart, FiShoppingCart, FiUser } from 'react-icons/fi'
import { MAIN_NAV } from '@/constants/navigation'
import { cn } from '@/lib/utils'

export default function Navbar() {
  const [open, setOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12)
    window.addEventListener('scroll', onScroll)
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <header
      className={cn(
        'fixed top-0 inset-x-0 z-50 transition-all duration-300',
        scrolled ? 'bg-obsidian/95 backdrop-blur-sm border-b border-graphite-light' : 'bg-transparent'
      )}
    >
      <nav className="mx-auto max-w-7xl px-6 lg:px-10 flex items-center justify-between h-20">
        {/* Logo */}
        <NavLink to="/" className="font-display text-2xl tracking-widest text-bone">
          CHIEF <span className="text-racing-red">MOTORS</span>
        </NavLink>

        {/* Desktop links */}
        <ul className="hidden lg:flex items-center gap-10">
          {MAIN_NAV.map((item) => (
            <li key={item.to}>
              <NavLink
                to={item.to}
                className={({ isActive }) =>
                  cn(
                    'font-display text-sm uppercase tracking-wide transition-colors',
                    isActive ? 'text-racing-red' : 'text-silver hover:text-bone'
                  )
                }
              >
                {item.label}
              </NavLink>
            </li>
          ))}
        </ul>

        {/* Actions */}
        <div className="hidden lg:flex items-center gap-5 text-bone">
          <button aria-label="Search" className="hover:text-racing-red transition-colors">
            <FiSearch size={20} />
          </button>
          <NavLink to="/wishlist" aria-label="Wishlist" className="hover:text-racing-red transition-colors">
            <FiHeart size={20} />
          </NavLink>
          <NavLink to="/cart" aria-label="Cart" className="hover:text-racing-red transition-colors">
            <FiShoppingCart size={20} />
          </NavLink>
          <NavLink to="/sign-in" aria-label="Account" className="hover:text-racing-red transition-colors">
            <FiUser size={20} />
          </NavLink>
        </div>

        {/* Mobile toggle */}
        <button
          className="lg:hidden text-bone"
          aria-label={open ? 'Close menu' : 'Open menu'}
          onClick={() => setOpen((v) => !v)}
        >
          {open ? <FiX size={26} /> : <FiMenu size={26} />}
        </button>
      </nav>

      {/* Mobile drawer */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="lg:hidden overflow-hidden bg-obsidian border-t border-graphite-light"
          >
            <ul className="px-6 py-6 flex flex-col gap-5">
              {MAIN_NAV.map((item) => (
                <li key={item.to}>
                  <NavLink
                    to={item.to}
                    onClick={() => setOpen(false)}
                    className="font-display text-lg uppercase tracking-wide text-bone"
                  >
                    {item.label}
                  </NavLink>
                </li>
              ))}
              <li className="flex gap-6 pt-4 border-t border-graphite-light text-bone">
                <NavLink to="/wishlist" onClick={() => setOpen(false)}><FiHeart size={22} /></NavLink>
                <NavLink to="/cart" onClick={() => setOpen(false)}><FiShoppingCart size={22} /></NavLink>
                <NavLink to="/sign-in" onClick={() => setOpen(false)}><FiUser size={22} /></NavLink>
              </li>
            </ul>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  )
}
