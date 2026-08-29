import { useState, useEffect } from 'react'
import { NavLink, useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { FiMenu, FiX, FiSearch, FiHeart, FiUser } from 'react-icons/fi'
import { MAIN_NAV } from '@/constants/navigation'
import { cn } from '@/lib/utils'
import { useCurrentUser } from '@/hooks/useCurrentUser'

export default function Navbar() {
  const navigate = useNavigate()
  const [open, setOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const [searchOpen, setSearchOpen] = useState(false)
  const [query, setQuery] = useState('')
  const { isSignedIn, convexUser } = useCurrentUser()

  // Signed-out -> sign in. Signed-in admin -> straight to the admin
  // dashboard. Everyone else -> their profile page.
  const accountTarget = !isSignedIn ? '/sign-in' : convexUser?.role === 'admin' ? '/admin' : '/profile'
  const accountLabel = !isSignedIn ? 'Sign in' : convexUser?.role === 'admin' ? 'Admin dashboard' : 'My profile'

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12)
    window.addEventListener('scroll', onScroll)
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  const submitSearch = (e) => {
    e.preventDefault()
    navigate(query.trim() ? `/shop?q=${encodeURIComponent(query.trim())}` : '/shop')
    setSearchOpen(false)
    setQuery('')
  }

  return (
    <header
      className={cn(
        'fixed top-0 inset-x-0 z-50 transition-all duration-300',
        scrolled ? 'bg-obsidian/95 backdrop-blur-sm border-b border-graphite-light' : 'bg-transparent'
      )}
    >
      <nav className="mx-auto max-w-7xl px-6 lg:px-10 flex items-center justify-between h-20">
        {/* Logo */}
        <NavLink to="/" className="font-display text-2xl tracking-widest text-bone shrink-0">
          AL-HUSNAIN <span className="text-racing-red">MOTORS</span>
        </NavLink>

        {/* Desktop links */}
        <ul className={cn('hidden lg:flex items-center gap-10 transition-opacity', searchOpen && 'lg:opacity-0 lg:pointer-events-none')}>
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

        {/* Expandable desktop search */}
        {searchOpen && (
          <form
            onSubmit={submitSearch}
            className="hidden lg:flex items-center gap-2 flex-1 max-w-md mx-8 bg-graphite border border-graphite-light px-3 py-2"
          >
            <FiSearch className="text-silver shrink-0" size={16} />
            <input
              autoFocus
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search by brand, model, or keyword…"
              className="bg-transparent flex-1 text-sm text-bone placeholder:text-silver-dim focus:outline-none"
            />
            <button type="button" onClick={() => setSearchOpen(false)} aria-label="Close search" className="text-silver hover:text-bone">
              <FiX size={16} />
            </button>
          </form>
        )}

        {/* Actions */}
        <div className="hidden lg:flex items-center gap-5 text-bone shrink-0">
          <button
            aria-label="Search"
            onClick={() => setSearchOpen((v) => !v)}
            className={cn('transition-colors', searchOpen ? 'text-racing-red' : 'hover:text-racing-red')}
          >
            <FiSearch size={20} />
          </button>
          <NavLink to="/wishlist" aria-label="Wishlist" className="hover:text-racing-red transition-colors">
            <FiHeart size={20} />
          </NavLink>
          <NavLink to={accountTarget} aria-label={accountLabel} className="hover:text-racing-red transition-colors">
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
            <div className="px-6 pt-5">
              <form onSubmit={submitSearch} className="flex items-center gap-2 bg-graphite border border-graphite-light px-3 py-2.5">
                <FiSearch className="text-silver shrink-0" size={16} />
                <input
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Search vehicles…"
                  className="bg-transparent flex-1 text-sm text-bone placeholder:text-silver-dim focus:outline-none"
                />
              </form>
            </div>
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
                <NavLink to={accountTarget} onClick={() => setOpen(false)}><FiUser size={22} /></NavLink>
              </li>
            </ul>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  )
}
