import { Link } from 'react-router';
import { Leaf, TreePine, Sprout, Plus } from 'lucide-react';
import { Header } from '../components/layout/Header';
import { Footer } from '../components/layout/Footer';

// ── Types ────────────────────────────────────────────────────────────────────

interface BadgeData {
  id: string;
  name: string;
  description: string;
  variant: 'green' | 'brown';
}

interface OrderData {
  id: string;
  treeName: string;
  date: string;
  location: string;
  status: 'planted' | 'completed';
  iconVariant: 'pine' | 'sprout' | 'leaf';
}

// ── Mock data ─────────────────────────────────────────────────────────────────

const USER = {
  name: 'Jacky Chak',
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
    treeName: '5 Oak Trees',
    date: '12 oct 2023',
    location: 'Amazon Rainforest',
    status: 'planted',
    iconVariant: 'pine',
  },
  {
    id: 'order-2',
    treeName: '7 Mangroves',
    date: '04 août 2023',
    location: 'Madagascar Coast',
    status: 'planted',
    iconVariant: 'sprout',
  },
  {
    id: 'order-3',
    treeName: 'Welcome Sapling',
    date: '15 janv 2023',
    location: 'Local Reserve',
    status: 'completed',
    iconVariant: 'leaf',
  },
];

const ORDER_ICONS = {
  pine: TreePine,
  sprout: Sprout,
  leaf: Leaf,
} as const;

// ── Sub-components ────────────────────────────────────────────────────────────

function StatusBadge({ status }: { status: OrderData['status'] }) {
  return status === 'planted' ? (
    <span className="shrink-0 text-xs font-semibold px-3 py-1 rounded-full bg-[#cce8d4] text-[#0f5238]">
      Planté
    </span>
  ) : (
    <span className="shrink-0 text-xs font-semibold px-3 py-1 rounded-full bg-[#e8e9e4] text-[#404943]">
      Complété
    </span>
  );
}

function BadgeCard({ badge }: { badge: BadgeData }) {
  const isGreen = badge.variant === 'green';
  const Icon = isGreen ? TreePine : Leaf;

  return (
    <div className="flex flex-col items-center gap-2 bg-white rounded-2xl p-4 text-center">
      <div
        className={`w-14 h-14 rounded-full flex items-center justify-center ${
          isGreen ? 'bg-[#cce8d4]' : 'bg-[#f5dfc8]'
        }`}
      >
        <Icon size={26} className={isGreen ? 'text-[#0f5238]' : 'text-[#bc6c25]'} />
      </div>
      <p className="text-sm font-semibold text-[#1a1c19] leading-snug">{badge.name}</p>
      <p className="text-xs text-[#404943]">{badge.description}</p>
    </div>
  );
}

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

              <h1 className="text-3xl font-bold text-[#1a1c19]">{USER.name}</h1>

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
                  {ORDERS.map((order) => {
                    const Icon = ORDER_ICONS[order.iconVariant];
                    return (
                      <div
                        key={order.id}
                        className="flex items-center gap-4 bg-[#f3f4ef] rounded-2xl px-4 py-4"
                      >
                        <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center shrink-0">
                          <Icon size={17} className="text-[#0f5238]" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-semibold text-[#1a1c19] leading-snug">
                            {order.treeName}
                          </p>
                          <p className="text-xs text-[#404943] mt-0.5">
                            {order.date} • {order.location}
                          </p>
                        </div>
                        <StatusBadge status={order.status} />
                      </div>
                    );
                  })}
                </div>
              </section>

              <Link
                to="/catalog"
                className="flex items-center justify-center gap-2 w-full py-4 rounded-2xl bg-[#0f5238] hover:bg-[#2c694e] active:bg-[#003824] text-white text-sm font-semibold transition-colors"
              >
                <Plus size={18} />
                Planter plus d&apos;arbres
              </Link>

            </div>

          </div>
        </main>

        <Footer />
      </div>
    </div>
  );
}
