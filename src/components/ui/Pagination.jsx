import { FiChevronLeft, FiChevronRight } from 'react-icons/fi'
import { cn } from '@/lib/utils'

export default function Pagination({ page, totalPages, onChange }) {
  if (totalPages <= 1) return null

  const pages = Array.from({ length: totalPages }, (_, i) => i + 1)

  return (
    <nav className="flex items-center justify-center gap-2 mt-12" aria-label="Pagination">
      <button
        onClick={() => onChange(Math.max(1, page - 1))}
        disabled={page === 1}
        className="p-2 border border-graphite-light text-silver hover:text-bone hover:border-bone disabled:opacity-30 disabled:pointer-events-none transition-colors"
        aria-label="Previous page"
      >
        <FiChevronLeft size={16} />
      </button>

      {pages.map((p) => (
        <button
          key={p}
          onClick={() => onChange(p)}
          className={cn(
            'w-9 h-9 font-display text-sm transition-colors border',
            p === page
              ? 'bg-racing-red border-racing-red text-bone'
              : 'border-graphite-light text-silver hover:text-bone hover:border-bone'
          )}
          aria-current={p === page ? 'page' : undefined}
        >
          {p}
        </button>
      ))}

      <button
        onClick={() => onChange(Math.min(totalPages, page + 1))}
        disabled={page === totalPages}
        className="p-2 border border-graphite-light text-silver hover:text-bone hover:border-bone disabled:opacity-30 disabled:pointer-events-none transition-colors"
        aria-label="Next page"
      >
        <FiChevronRight size={16} />
      </button>
    </nav>
  )
}
