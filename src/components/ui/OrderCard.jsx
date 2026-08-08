import Badge from '@/components/ui/Badge'
import { formatPrice } from '@/lib/utils'

const STATUS_VARIANT = {
  processing: 'silver',
  confirmed: 'amber',
  out_for_delivery: 'amber',
  delivered: 'red',
  cancelled: 'silver',
}

const STATUS_LABEL = {
  processing: 'Processing',
  confirmed: 'Confirmed',
  out_for_delivery: 'Out For Delivery',
  delivered: 'Delivered',
  cancelled: 'Cancelled',
}

export default function OrderCard({ order }) {
  return (
    <div className="border border-graphite-light p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
      <div>
        <p className="spec-strip text-silver-dim text-xs uppercase tracking-widest">
          Order #{order.id} · {new Date(order.createdAt).toLocaleDateString()}
        </p>
        <p className="font-display text-lg uppercase text-bone mt-1">
          {order.itemsSummary}
        </p>
        <p className="text-silver text-sm mt-1">{order.itemCount} item{order.itemCount > 1 ? 's' : ''}</p>
      </div>
      <div className="flex items-center gap-4">
        <Badge variant={STATUS_VARIANT[order.status]}>{STATUS_LABEL[order.status]}</Badge>
        <p className="font-display text-xl text-bone">{formatPrice(order.total)}</p>
      </div>
    </div>
  )
}
