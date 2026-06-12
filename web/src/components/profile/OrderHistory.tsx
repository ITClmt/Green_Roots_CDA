import type { OrderData } from "../../types/profile";
import { OrderItem } from "./OrderItem";

interface OrderHistoryProps {
  orders: OrderData[];
  isLoading: boolean;
}

export function OrderHistory({ orders, isLoading }: OrderHistoryProps) {
  return (
    <section>
      <h2 className="text-xl font-bold text-content-primary mb-4">
        Historique des commandes
      </h2>
      <div className="flex flex-col gap-3 max-h-[420px] overflow-y-auto pr-1">
        {isLoading ? (
          <p className="text-sm text-content-secondary">
            Chargement de vos commandes...
          </p>
        ) : orders.length > 0 ? (
          orders.map((order) => <OrderItem key={order.id} order={order} />)
        ) : (
          <p className="text-sm text-content-secondary">
            Vous n'avez pas encore passé de commande.
          </p>
        )}
      </div>
    </section>
  );
}
