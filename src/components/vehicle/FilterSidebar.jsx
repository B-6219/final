import { useBrands, useCategories } from '@/hooks/useTaxonomy'

const FUEL_TYPES = ['Petrol', 'Diesel', 'Electric', 'Hybrid']
const TRANSMISSIONS = ['Automatic', 'Manual', 'PDK', 'CVT']
const CONDITIONS = ['New', 'Used', 'Certified Pre-Owned']

export default function FilterSidebar({ filters, onChange, onReset, className }) {
  const { brands } = useBrands()
  const { categories } = useCategories()

  const toggle = (key, value) => {
    const current = filters[key] ?? []
    const next = current.includes(value) ? current.filter((v) => v !== value) : [...current, value]
    onChange({ ...filters, [key]: next })
  }

  return (
    <aside className={className}>
      <div className="flex items-center justify-between mb-6">
        <h3 className="font-display uppercase text-bone text-lg">Filters</h3>
        <button onClick={onReset} className="text-xs text-silver hover:text-racing-red uppercase tracking-wide">
          Reset all
        </button>
      </div>

      <FilterGroup title="Brand">
        {brands.map((brand) => (
          <Checkbox key={brand._id} label={brand.name} checked={(filters.brand ?? []).includes(brand.name)} onChange={() => toggle('brand', brand.name)} />
        ))}
      </FilterGroup>

      <FilterGroup title="Category">
        {categories.map((cat) => (
          <Checkbox
            key={cat._id}
            label={cat.count != null ? `${cat.name} (${cat.count})` : cat.name}
            checked={(filters.category ?? []).includes(cat.name)}
            onChange={() => toggle('category', cat.name)}
          />
        ))}
      </FilterGroup>

      <FilterGroup title="Price Range">
        <div className="flex items-center gap-3">
          <input
            type="number"
            placeholder="Min"
            value={filters.minPrice ?? ''}
            onChange={(e) => onChange({ ...filters, minPrice: e.target.value })}
            className="w-full bg-obsidian border border-graphite-light px-3 py-2 text-sm text-bone focus:outline-none focus:border-amber"
          />
          <span className="text-silver-dim">–</span>
          <input
            type="number"
            placeholder="Max"
            value={filters.maxPrice ?? ''}
            onChange={(e) => onChange({ ...filters, maxPrice: e.target.value })}
            className="w-full bg-obsidian border border-graphite-light px-3 py-2 text-sm text-bone focus:outline-none focus:border-amber"
          />
        </div>
      </FilterGroup>

      <FilterGroup title="Fuel Type">
        {FUEL_TYPES.map((f) => (
          <Checkbox key={f} label={f} checked={(filters.fuel ?? []).includes(f)} onChange={() => toggle('fuel', f)} />
        ))}
      </FilterGroup>

      <FilterGroup title="Transmission">
        {TRANSMISSIONS.map((t) => (
          <Checkbox key={t} label={t} checked={(filters.transmission ?? []).includes(t)} onChange={() => toggle('transmission', t)} />
        ))}
      </FilterGroup>

      <FilterGroup title="Condition">
        {CONDITIONS.map((c) => (
          <Checkbox key={c} label={c} checked={(filters.condition ?? []).includes(c)} onChange={() => toggle('condition', c)} />
        ))}
      </FilterGroup>

      <label className="flex items-center gap-2 mt-2">
        <Checkbox label="Featured only" checked={filters.featuredOnly ?? false} onChange={() => onChange({ ...filters, featuredOnly: !filters.featuredOnly })} />
      </label>
    </aside>
  )
}

function FilterGroup({ title, children }) {
  return (
    <div className="border-b border-graphite-light pb-6 mb-6 last:border-0">
      <h4 className="font-display uppercase text-sm text-silver mb-3 tracking-wide">{title}</h4>
      <div className="flex flex-col gap-2.5">{children}</div>
    </div>
  )
}

function Checkbox({ label, checked, onChange }) {
  return (
    <label className="flex items-center gap-2.5 cursor-pointer group">
      <span
        className={`w-4 h-4 border flex items-center justify-center shrink-0 transition-colors ${
          checked ? 'bg-racing-red border-racing-red' : 'border-silver-dim group-hover:border-bone'
        }`}
      >
        {checked && <div className="w-1.5 h-1.5 bg-bone" />}
      </span>
      <input type="checkbox" checked={checked} onChange={onChange} className="sr-only" />
      <span className="text-sm text-silver group-hover:text-bone transition-colors">{label}</span>
    </label>
  )
}
