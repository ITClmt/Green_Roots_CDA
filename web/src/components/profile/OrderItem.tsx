import { TreePine, Sprout, Leaf } from 'lucide-react';
import type { OrderData } from '../../types/profile';

interface OrderItemProps {
  order: OrderData;
}

const ORDER_ICONS = {
  pine: TreePine,
  sprout: Sprout,
  leaf: Leaf,
} as const;

export function OrderItem({ order }: OrderItemProps) {
  const Icon = ORDER_ICONS[order.iconVariant];

  return (
    <div className="flex items-center gap-4 bg-[#f3f4ef] rounded-2xl px-4 py-4">
      <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center shrink-0">
        <Icon size={17} className="text-[#0f5238]" />
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-semibold text-[#1a1c19] leading-snug">
          {order.quantity > 1 ? `${order.quantity} ${order.name}` : order.name}
        </p>
        <p className="text-xs text-[#404943] mt-0.5">
          {order.createdAt} • {order.location}
        </p>
      </div>
    </div>
  );
}
