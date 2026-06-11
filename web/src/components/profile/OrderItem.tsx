import { TreePine } from "lucide-react";
import type { OrderData } from "../../types/profile";

interface OrderItemProps {
  order: OrderData;
}

export function OrderItem({ order }: OrderItemProps) {
  return (
    <div className="flex items-center gap-4 bg-surface-primary rounded-2xl px-4 py-4">
      <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center shrink-0">
        <TreePine size={17} className="text-primary" />
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-semibold text-content-primary leading-snug">
          {order.quantity > 1 ? `${order.quantity} ${order.name}` : order.name}
        </p>
        <p className="text-xs text-content-secondary mt-0.5">
          {order.createdAt} • {order.location}
        </p>
      </div>
    </div>
  );
}
