import { FiStar } from 'react-icons/fi'

/**
 * Renders a small bar per rating category (Engine, Comfort, Exterior,
 * Value for Money, ...). This is what makes each listing's rating feel
 * specific rather than one generic star count — scores vary per category
 * and per item.
 */
export default function RatingBreakdown({ breakdown }) {
  if (!breakdown?.length) return null

  return (
    <div className="border border-graphite-light p-5">
      <p className="font-display uppercase text-bone text-sm mb-4 flex items-center gap-2">
        <FiStar className="text-amber" size={14} /> Ratings Breakdown
      </p>
      <div className="flex flex-col gap-3">
        {breakdown.map(({ category, score }) => (
          <div key={category} className="flex items-center gap-3">
            <span className="text-silver text-xs w-32 shrink-0">{category}</span>
            <div className="flex-1 h-1.5 bg-graphite-light overflow-hidden">
              <div
                className="h-full bg-amber"
                style={{ width: `${Math.min(100, (score / 5) * 100)}%` }}
              />
            </div>
            <span className="spec-strip text-bone text-xs w-8 text-right">{score.toFixed(1)}</span>
          </div>
        ))}
      </div>
    </div>
  )
}
