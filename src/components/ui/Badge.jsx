import { cn } from '@/lib/utils'

const VARIANTS = {
  amber: 'bg-amber/90 text-obsidian',
  red: 'bg-racing-red text-bone',
  silver: 'bg-silver/20 text-silver border border-silver-dim',
}

export default function Badge({ children, variant = 'amber', className }) {
  return (
    <span
      className={cn(
        'inline-flex items-center px-2.5 py-1 text-[11px] font-display uppercase tracking-widest',
        VARIANTS[variant],
        className
      )}
    >
      {children}
    </span>
  )
}
