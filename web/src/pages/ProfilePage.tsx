import { useQuery } from "@tanstack/react-query";
import { Leaf, Plus } from "lucide-react";
import { Link } from "react-router";
import { getUserOrders } from "../api/orders";
import { BadgeCard } from "../components/profile/BadgeCard";
import { OrderItem } from "../components/profile/OrderItem";
import { useAuth } from "../features/auth/AuthContext";
import type { BadgeData, OrderData } from "../types/profile";

const BADGES: BadgeData[] = [
  {
    id: "badge-1",
    name: "Planteur débutant",
    description: "10 arbres plantés",
    variant: "green",
  },
  {
    id: "badge-2",
    name: "Protecteur de forêt",
    description: "Donateur mensuel",
    variant: "brown",
  },
];

// ── Page ──────────────────────────────────────────────────────────────────────

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

  const ordersList: OrderData[] = rawOrders.map((order) => ({
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
        {/* ── Left column : identity + impact + badges ── */}
        <div className="flex flex-col gap-6">
          <h1 className="text-3xl font-bold text-content-primary">
            {user.firstName} {user.lastName}
          </h1>

          {/* Impact card */}
          <div className="rounded-2xl bg-primary text-white p-6">
            <div className="flex items-center gap-1.5 mb-5">
                  <Leaf aria-hidden="true" size={13} className="text-white/70" />
                  <span className="text-xs font-semibold uppercase tracking-widest text-white/70">
                Impact dans le monde
              </span>
            </div>
            <p className="text-5xl font-bold leading-none text-white">
              {isLoading ? "..." : treesPlanted} arbres
            </p>
            <p className="text-sm text-white/65 leading-relaxed mt-3">
              plantés dans le cadre de projets mondiaux de reboisement.
            </p>
          </div>

          {/* Badges */}
          <section>
            <h2 className="text-xl font-bold text-content-primary mb-4">
              Badges
            </h2>
            <div className="grid grid-cols-2 gap-4">
              {BADGES.map((badge) => (
                <BadgeCard key={badge.id} badge={badge} />
              ))}
            </div>
          </section>
        </div>

        {/* ── Right column : order history + CTA ── */}
        <div className="flex flex-col gap-6 mt-8 md:mt-0">
          <section>
            <h2 className="text-xl font-bold text-content-primary mb-4">
              Historique des commandes
            </h2>
            <div className="flex flex-col gap-3">
              {isLoading ? (
                <p className="text-sm text-content-secondary">
                  Chargement de vos commandes...
                </p>
              ) : ordersList.length > 0 ? (
                ordersList.map((order) => (
                  <OrderItem key={order.id} order={order} />
                ))
              ) : (
                <p className="text-sm text-content-secondary">
                  Vous n'avez pas encore passé de commande.
                </p>
              )}
            </div>
          </section>

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
