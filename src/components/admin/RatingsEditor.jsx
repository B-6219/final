import { RATING_CATEGORIES } from '@/hooks/useRatings'

/**
 * Controlled set of per-category score inputs (1–5, one decimal). `values`
 * is a plain object keyed by category name. This is what lets admin give
 * each car/bike a genuinely different rating profile instead of one
 * generic star count.
 */
export default function RatingsEditor({ values, onChange }) {
  return (
    <div className="col-span-2">
      <p className="text-xs uppercase tracking-wide text-silver font-display mb-2">
        Ratings Breakdown (1.0–5.0)
      </p>
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {RATING_CATEGORIES.map((category) => (
          <div key={category} className="flex flex-col gap-1">
            <label className="text-[11px] text-silver-dim uppercase tracking-wide">{category}</label>
            <input
              type="number"
              min={1}
              max={5}
              step={0.1}
              value={values[category] ?? ''}
              onChange={(e) => onChange({ ...values, [category]: e.target.value })}
              placeholder="—"
              className="bg-graphite border border-graphite-light px-3 py-2 text-sm text-bone focus:outline-none focus:border-amber"
            />
          </div>
        ))}
      </div>
    </div>
  )
}
