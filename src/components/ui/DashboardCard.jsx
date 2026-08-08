import { cn } from '@/lib/utils'

export default function DashboardCard({ label, value, delta, icon: Icon, accent = 'amber' }) {
  const accentColor = { amber: 'text-amber', red: 'text-racing-red', silver: 'text-silver' }[accent]

  return (
    <div className="bg-graphite border border-graphite-light p-6">
      <div className="flex items-center justify-between mb-4">
        <p className="text-silver text-xs uppercase tracking-widest">{label}</p>
        {Icon && <Icon size={18} className={accentColor} />}
      </div>
      <p className="font-display text-3xl text-bone">{value}</p>
      {delta && (
        <p className={cn('text-xs mt-2', delta.startsWith('-') ? 'text-racing-red' : 'text-amber')}>
          {delta} vs last month
        </p>
      )}
    </div>
  )
}
