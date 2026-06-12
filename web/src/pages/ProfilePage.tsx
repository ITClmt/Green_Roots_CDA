import { useQuery } from "@tanstack/react-query";
import { Plus } from "lucide-react";
import { Link } from "react-router";
import { getUserOrders } from "../api/orders";
import { ImpactCard } from "../components/profile/ImpactCard";
import { OrderHistory } from "../components/profile/OrderHistory";
import { useAuth } from "../features/auth/AuthContext";
import type { OrderData } from "../types/profile";

export function ProfilePage() {
  const { user, accessToken } = useAuth();

  const { data: ordersResponse, isLoading } = useQuery({
    queryKey: ["userOrders", accessToken],
    queryFn: () => getUserOrders(accessToken!),
    enabled: !!accessToken,
  });

  const rawOrders = ordersResponse?.data || [];
  const treesPlanted = rawOrders.reduce(
    (sum, order) => sum + order.quantity,
    0,
  );

  const orders: OrderData[] = rawOrders.map((order) => ({
    id: order.id,
    name: order.name,
    quantity: order.quantity,
    createdAt: new Date(order.createdAt).toLocaleDateString("fr-FR", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    }),
    location: order.location || "Local Reserve",
  }));

  if (!user) return null;

  return (
    <main className="max-w-[1440px] mx-auto w-full px-5 sm:px-8 md:px-16 py-8 md:py-12">
      <div className="md:grid md:grid-cols-[5fr_7fr] md:gap-10 lg:gap-16 max-w-5xl md:max-w-none">
        {/* Left column: identity + impact + badges */}
        <div className="flex flex-col gap-6">
          <h1 className="text-3xl font-bold text-content-primary">
            {user.firstName} {user.lastName}
          </h1>
          <ImpactCard treesPlanted={treesPlanted} isLoading={isLoading} />
          {/* TODO: Add badges when feature is ready, remove this comment then */}
          {/* <BadgeSection badges={BADGES} /> */}
        </div>

        {/* Right column: order history + CTA */}
        <div className="flex flex-col gap-6 mt-8 md:mt-0">
          <OrderHistory orders={orders} isLoading={isLoading} />
          <Link
            to="/catalog"
            className="flex items-center justify-center gap-2 w-full py-4 rounded-2xl bg-primary hover:bg-primary-hover active:bg-primary-active text-white text-sm font-semibold transition-colors"
          >
            <Plus size={18} />
            Planter plus d'arbres
          </Link>
        </div>
      </div>
    </main>
  );
}
