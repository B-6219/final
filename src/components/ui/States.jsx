import { FiAlertCircle, FiInbox, FiChevronRight } from 'react-icons/fi'
import { Link } from 'react-router-dom'
import { cn } from '@/lib/utils'

export function EmptyState({ icon: Icon = FiInbox, title, message, action }) {
  return (
    <div className="flex flex-col items-center justify-center text-center py-24 px-6">
      <Icon size={40} className="text-silver-dim mb-4" />
      <h3 className="font-display text-xl uppercase text-bone mb-2">{title}</h3>
      {message && <p className="text-silver text-sm max-w-sm mb-6">{message}</p>}
      {action}
    </div>
  )
}

export function ErrorState({ title = 'Something went wrong', message }) {
  return (
    <div className="flex flex-col items-center justify-center text-center py-24 px-6">
      <FiAlertCircle size={40} className="text-racing-red mb-4" />
      <h3 className="font-display text-xl uppercase text-bone mb-2">{title}</h3>
      {message && <p className="text-silver text-sm max-w-sm">{message}</p>}
    </div>
  )
}

export function Skeleton({ className }) {
  return <div className={cn('animate-pulse bg-graphite-light', className)} />
}

export function VehicleCardSkeleton() {
  return (
    <div className="bg-graphite border border-graphite-light">
      <Skeleton className="aspect-[4/3] w-full" />
      <div className="p-5 space-y-3">
        <Skeleton className="h-3 w-1/3" />
        <Skeleton className="h-5 w-2/3" />
        <Skeleton className="h-8 w-full" />
        <Skeleton className="h-6 w-1/2" />
      </div>
    </div>
  )
}

export function Breadcrumbs({ items }) {
  return (
    <nav aria-label="Breadcrumb" className="flex items-center gap-2 text-xs text-silver-dim uppercase tracking-wide">
      {items.map((item, i) => (
        <span key={item.label} className="flex items-center gap-2">
          {i > 0 && <FiChevronRight size={12} />}
          {item.to ? (
            <Link to={item.to} className="hover:text-bone transition-colors">
              {item.label}
            </Link>
          ) : (
            <span className="text-bone">{item.label}</span>
          )}
        </span>
      ))}
    </nav>
  )
}

export function Avatar({ src, name, size = 40 }) {
  const initials = name
    ? name.split(' ').map((n) => n[0]).slice(0, 2).join('').toUpperCase()
    : '?'

  if (src) {
    return (
      <img
        src={src}
        alt={name}
        style={{ width: size, height: size }}
        className="rounded-full object-cover border border-graphite-light"
      />
    )
  }

  return (
    <div
      style={{ width: size, height: size }}
      className="rounded-full bg-graphite-light border border-silver-dim flex items-center justify-center font-display text-sm text-bone"
    >
      {initials}
    </div>
  )
}
