import { useMemo, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import BikeCard from '@/components/bike/BikeCard'
import { Breadcrumbs, EmptyState, VehicleCardSkeleton } from '@/components/ui/States'
import { useBikeList } from '@/hooks/useBikes'
import { BIKE_TYPES } from '@/constants/mockBikes'
import { cn } from '@/lib/utils'

export default function BikesShop() {
  const [searchParams] = useSearchParams()
  const { bikes, isLoading } = useBikeList()
  const [query, setQuery] = useState(searchParams.get('q') ?? '')
  const [type, setType] = useState('')

  const filtered = useMemo(() => {
    let results = [...bikes]
    if (type) results = results.filter((b) => b.bikeType === type)
    if (query.trim()) {
      const q = query.toLowerCase()
      results = results.filter((b) => `${b.brand} ${b.model}`.toLowerCase().includes(q))
    }
    return results
  }, [bikes, type, query])

  return (
    <div className="pt-28 pb-24">
      <div className="mx-auto max-w-7xl px-6 lg:px-10">
        <Breadcrumbs items={[{ label: 'Home', to: '/' }, { label: 'Bikes' }]} />
        <h1 className="font-display text-4xl lg:text-5xl uppercase text-bone mt-4 mb-10">Bikes</h1>

        <div className="flex flex-col sm:flex-row gap-4 mb-8">
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search by brand or model…"
            className="bg-graphite border border-graphite-light px-4 py-2.5 text-sm text-bone placeholder:text-silver-dim focus:outline-none focus:border-amber flex-1"
          />
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => setType('')}
              className={cn('px-4 py-2 text-xs font-display uppercase tracking-wide border', !type ? 'border-racing-red text-bone bg-racing-red/10' : 'border-graphite-light text-silver hover:text-bone')}
            >
              All
            </button>
            {BIKE_TYPES.map((t) => (
              <button
                key={t}
                onClick={() => setType(t)}
                className={cn('px-4 py-2 text-xs font-display uppercase tracking-wide border', type === t ? 'border-racing-red text-bone bg-racing-red/10' : 'border-graphite-light text-silver hover:text-bone')}
              >
                {t}
              </button>
            ))}
          </div>
        </div>

        {isLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
            {Array.from({ length: 6 }).map((_, i) => <VehicleCardSkeleton key={i} />)}
          </div>
        ) : filtered.length === 0 ? (
          <EmptyState title="No bikes match" message="Try a different search term or category." />
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
            {filtered.map((bike) => <BikeCard key={bike.id} bike={bike} />)}
          </div>
        )}
      </div>
    </div>
  )
}
