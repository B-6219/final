import { cn } from '@/lib/utils'

const VARIANTS = {
  primary: 'bg-racing-red text-bone hover:bg-racing-red-dim',
  secondary: 'bg-bone text-obsidian hover:bg-silver',
  outline: 'border border-silver-dim text-bone hover:border-bone bg-transparent',
  ghost: 'text-bone hover:bg-graphite-light bg-transparent',
  amber: 'bg-amber text-obsidian hover:bg-amber-dim',
}

const SIZES = {
  sm: 'px-4 py-2 text-sm',
  md: 'px-6 py-3 text-sm',
  lg: 'px-8 py-4 text-base',
}

/**
 * alhusnain Motors button — sharp corners (chamfered, not rounded) to read
 * automotive rather than generic SaaS. Use `as="a"` semantics via onClick + href pass-through.
 */
export default function Button({
  children,
  variant = 'primary',
  size = 'md',
  className,
  icon: Icon,
  iconPosition = 'left',
  ...props
}) {
  return (
    <button
      className={cn(
        'inline-flex items-center justify-center gap-2 font-display uppercase tracking-wide',
        'transition-colors duration-200 disabled:opacity-40 disabled:cursor-not-allowed',
        'clip-corner',
        VARIANTS[variant],
        SIZES[size],
        className
      )}
      {...props}
    >
      {Icon && iconPosition === 'left' && <Icon className="shrink-0" size={18} />}
      {children}
      {Icon && iconPosition === 'right' && <Icon className="shrink-0" size={18} />}
    </button>
  )
}
