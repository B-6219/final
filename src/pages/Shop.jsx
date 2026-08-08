import { useMemo, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { FiSliders, FiX } from 'react-icons/fi'
import VehicleCard from '@/components/vehicle/VehicleCard'
import FilterSidebar from '@/components/vehicle/FilterSidebar'
import Pagination from '@/components/ui/Pagination'
import { Breadcrumbs, EmptyState, VehicleCardSkeleton } from '@/components/ui/States'
import { useVehicleList } from '@/hooks/useVehicles'

const PAGE_SIZE = 8

const SORT_OPTIONS = [
  { value: 'newest', label: 'Newest' },
  { value: 'price_asc', label: 'Price: Low to High' },
  { value: 'price_desc', label: 'Price: High to Low' },
  { value: 'popular', label: 'Most Popular' },
]

// Reads real Convex vehicles via useVehicleList() (normalized to the same
// flat shape mock data used), or the mock catalog if Convex isn't connected
// yet — filtering/sorting stays client-side either way, so this page's
// logic doesn't need to change when the backend comes online.
export default function Shop() {
  const [searchParams] = useSearchParams()
  const { vehicles, isLoading } = useVehicleList()

  const [filters, setFilters] = useState(() => {
    const initial = {}
    const brand = searchParams.get('brand')
    const category = searchParams.get('category')
    if (brand) initial.brand = [brand]
    if (category) initial.category = [category]
    return initial
  })
  const [sortBy, setSortBy] = useState('newest')
  const [page, setPage] = useState(1)
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false)

  const filtered = useMemo(() => {
    let results = [...vehicles]
    if (filters.brand?.length) results = results.filter((v) => filters.brand.includes(v.brand))
    if (filters.category?.length) results = results.filter((v) => filters.category.includes(v.category))
    if (filters.fuel?.length) results = results.filter((v) => filters.fuel.includes(v.fuel))
    if (filters.transmission?.length) results = results.filter((v) => filters.transmission.includes(v.transmission))
    if (filters.condition?.length) results = results.filter((v) => filters.condition.includes(v.condition))
    if (filters.minPrice) results = results.filter((v) => v.price >= Number(filters.minPrice))
    if (filters.maxPrice) results = results.filter((v) => v.price <= Number(filters.maxPrice))
    if (filters.featuredOnly) results = results.filter((v) => v.featured)

    switch (sortBy) {
      case 'price_asc':
        results.sort((a, b) => a.price - b.price)
        break
      case 'price_desc':
        results.sort((a, b) => b.price - a.price)
        break
      case 'popular':
        results.sort((a, b) => b.rating - a.rating)
        break
      default:
        break
    }
    return results
  }, [vehicles, filters, sortBy])

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE))
  const pageItems = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE)

  const handleFilterChange = (next) => {
    setFilters(next)
    setPage(1)
  }

  return (
    <div className="pt-28 pb-24">
      <div className="mx-auto max-w-7xl px-6 lg:px-10">
        <Breadcrumbs items={[{ label: 'Home', to: '/' }, { label: 'Shop' }]} />
        <h1 className="font-display text-4xl lg:text-5xl uppercase text-bone mt-4 mb-10">
          Shop Inventory
        </h1>

        <div className="grid grid-cols-1 lg:grid-cols-[280px_1fr] gap-10">
          {/* Desktop sidebar */}
          <FilterSidebar
            filters={filters}
            onChange={handleFilterChange}
            onReset={() => handleFilterChange({})}
            className="hidden lg:block"
          />

          <div>
            {/* Toolbar */}
            <div className="flex items-center justify-between mb-8 gap-4">
              <button
                onClick={() => setMobileFiltersOpen(true)}
                className="lg:hidden flex items-center gap-2 border border-graphite-light px-4 py-2 text-sm text-bone"
              >
                <FiSliders size={16} /> Filters
              </button>
              <p className="text-silver text-sm hidden sm:block">
                {isLoading ? 'Loading…' : `${filtered.length} vehicle${filtered.length !== 1 ? 's' : ''} found`}
              </p>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="bg-graphite border border-graphite-light px-4 py-2 text-sm text-bone focus:outline-none focus:border-amber ml-auto"
              >
                {SORT_OPTIONS.map((opt) => (
                  <option key={opt.value} value={opt.value}>{opt.label}</option>
                ))}
              </select>
            </div>

            {isLoading ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
                {Array.from({ length: 6 }).map((_, i) => <VehicleCardSkeleton key={i} />)}
              </div>
            ) : pageItems.length === 0 ? (
              <EmptyState
                title="No vehicles match"
                message="Try widening your filters or resetting them to see more results."
              />
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
                {pageItems.map((vehicle) => (
                  <VehicleCard key={vehicle.id} vehicle={vehicle} />
                ))}
              </div>
            )}

            <Pagination page={page} totalPages={totalPages} onChange={setPage} />
          </div>
        </div>
      </div>

      {/* Mobile filter drawer */}
      {mobileFiltersOpen && (
        <div className="fixed inset-0 z-[90] lg:hidden">
          <div className="absolute inset-0 bg-obsidian/80" onClick={() => setMobileFiltersOpen(false)} />
          <div className="absolute right-0 top-0 bottom-0 w-[85%] max-w-sm bg-obsidian border-l border-graphite-light overflow-y-auto p-6">
            <button onClick={() => setMobileFiltersOpen(false)} className="mb-6 text-bone" aria-label="Close filters">
              <FiX size={22} />
            </button>
            <FilterSidebar filters={filters} onChange={handleFilterChange} onReset={() => handleFilterChange({})} />
          </div>
        </div>
      )}
    </div>
  )
}
