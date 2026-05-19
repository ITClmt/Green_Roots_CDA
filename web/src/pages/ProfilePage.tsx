import { Link } from 'react-router';
import { Leaf, Plus } from 'lucide-react';
import { Header } from '../components/layout/Header';
import { Footer } from '../components/layout/Footer';
import { BadgeCard } from '../components/profile/BadgeCard';
import { OrderItem } from '../components/profile/OrderItem';
import type { UserProfile, BadgeData, OrderData } from '../types/profile';

// ── Mock data ─────────────────────────────────────────────────────────────────

const USER: UserProfile = {
  id: 'user-1',
  firstName: 'Jacky',
  lastName: 'Chak',
  treesPlanted: 12,
};

const BADGES: BadgeData[] = [
  {
    id: 'badge-1',
    name: 'Planteur débutant',
    description: '10 arbres plantés',
    variant: 'green',
  },
  {
    id: 'badge-2',
    name: 'Protecteur de forêt',
    description: 'Donateur mensuel',
    variant: 'brown',
  },
];

const ORDERS: OrderData[] = [
  {
    id: 'order-1',
    name: 'Oak Trees',
    quantity: 5,
    createdAt: '12 oct 2023',
    location: 'Amazon Rainforest',
    iconVariant: 'pine',
  },
  {
    id: 'order-2',
    name: 'Mangroves',
    quantity: 7,
    createdAt: '04 août 2023',
    location: 'Madagascar Coast',
    iconVariant: 'sprout',
  },
  {
    id: 'order-3',
    name: 'Welcome Sapling',
    quantity: 1,
    createdAt: '15 janv 2023',
    location: 'Local Reserve',
    iconVariant: 'leaf',
  },
];

// ── Page ──────────────────────────────────────────────────────────────────────

export function ProfilePage() {
  return (
    <div className="min-h-screen bg-[#f9faf5]">
      <div className="max-w-[1440px] mx-auto">
        <Header />

        <main className="px-5 sm:px-8 md:px-16 py-8 md:py-12">
          <div className="md:grid md:grid-cols-[5fr_7fr] md:gap-10 lg:gap-16 max-w-5xl md:max-w-none">

            {/* ── Left column : identity + impact + badges ── */}
            <div className="flex flex-col gap-6">

              <h1 className="text-3xl font-bold text-[#1a1c19]">{USER.firstName} {USER.lastName}</h1>

              {/* Impact card */}
              <div className="rounded-2xl bg-[#0f5238] text-white p-6">
                <div className="flex items-center gap-1.5 mb-5">
                  <Leaf size={13} className="text-white/70" />
                  <span className="text-[11px] font-semibold uppercase tracking-widest text-white/70">
                    Impact dans le monde
                  </span>
                </div>
                <p className="text-5xl font-bold leading-none text-white">
                  {USER.treesPlanted} arbres
                </p>
                <p className="text-sm text-white/65 leading-relaxed mt-3">
                  plantés dans le cadre de projets mondiaux de reboisement.
                </p>
              </div>

              {/* Badges */}
              <section>
                <h2 className="text-xl font-bold text-[#1a1c19] mb-4">Badges</h2>
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
                <h2 className="text-xl font-bold text-[#1a1c19] mb-4">
                  Historique des commandes
                </h2>
                <div className="flex flex-col gap-3">
                  {ORDERS.map((order) => (
                    <OrderItem key={order.id} order={order} />
                  ))}
                </div>
              </section>

              <Link
                to="/catalog"
                className="flex items-center justify-center gap-2 w-full py-4 rounded-2xl bg-[#0f5238] hover:bg-[#2c694e] active:bg-[#003824] text-white text-sm font-semibold transition-colors"
              >
                <Plus size={18} />
                Planter plus d'arbres
              </Link>

            </div>

          </div>
        </main>

        <Footer />
      </div>
    </div>
  );
}
