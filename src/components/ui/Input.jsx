import { cn } from '@/lib/utils'

export default function Input({ label, error, className, id, as = 'input', ...props }) {
  const Component = as
  return (
    <div className="flex flex-col gap-2">
      {label && (
        <label htmlFor={id} className="text-xs uppercase tracking-wide text-silver font-display">
          {label}
        </label>
      )}
      <Component
        id={id}
        className={cn(
          'bg-graphite border border-graphite-light px-4 py-3 text-sm text-bone placeholder:text-silver-dim',
          'focus:outline-none focus:border-amber transition-colors',
          error && 'border-racing-red',
          className
        )}
        {...props}
      />
      {error && <span className="text-racing-red text-xs">{error}</span>}
    </div>
  )
}
