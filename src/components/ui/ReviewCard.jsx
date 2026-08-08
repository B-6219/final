import { FiStar } from 'react-icons/fi'
import { Avatar } from '@/components/ui/States'

export default function ReviewCard({ review }) {
  const { userName, rating, title, comment, createdAt } = review
  return (
    <div className="border border-graphite-light p-6">
      <div className="flex items-start justify-between gap-4">
        <div className="flex items-center gap-3">
          <Avatar name={userName} size={36} />
          <div>
            <p className="text-bone text-sm font-medium">{userName}</p>
            <p className="text-silver-dim text-xs">{new Date(createdAt).toLocaleDateString()}</p>
          </div>
        </div>
        <div className="flex gap-0.5 text-amber shrink-0">
          {Array.from({ length: 5 }).map((_, i) => (
            <FiStar key={i} size={14} className={i < rating ? 'fill-amber' : 'text-graphite-light'} />
          ))}
        </div>
      </div>
      {title && <h4 className="font-display uppercase text-bone mt-4">{title}</h4>}
      <p className="text-silver text-sm mt-2 leading-relaxed">{comment}</p>
    </div>
  )
}
