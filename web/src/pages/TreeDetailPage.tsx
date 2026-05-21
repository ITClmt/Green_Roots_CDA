import { ArrowLeft, Leaf, MapPin, Package, Wind } from "lucide-react";
import { useNavigate, useParams } from "react-router";
import { Footer } from "../components/layout/Footer";
import { Header } from "../components/layout/Header";
import { useTree } from "../hooks/useTree";

export function TreeDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { data: tree, isLoading, error } = useTree(id ?? "");

  /* ── Loading ── */
  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#f9faf7] font-sans flex items-center justify-center">
        <div className="text-center space-y-3">
          <div className="w-10 h-10 border-4 border-[#134d37] border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="text-gray-400 text-sm">Chargement...</p>
        </div>
      </div>
    );
  }

  /* ── Error / Not found ── */
  if (error || !tree) {
    return (
      <div className="min-h-screen bg-[#f9faf7] font-sans flex items-center justify-center">
        <div className="text-center space-y-4">
          <p className="text-red-400 text-sm">
            {error?.message ?? "Arbre introuvable."}
          </p>
          <button
            onClick={() => navigate("/catalog")}
            className="text-[#134d37] text-sm underline underline-offset-2"
          >
            Retour au catalogue
          </button>
        </div>
      </div>
    );
  }

  const price = parseFloat(tree.price);

  return (
    <div className="min-h-screen bg-[#f9faf7] font-sans">
      <div className="max-w-[1440px] mx-auto">
        <Header />

        <main className="px-5 sm:px-10 md:px-16 py-8 md:py-12">
          {/* ── Back button ── */}
          <button
            id="back-to-catalogue"
            onClick={() => navigate("/catalog")}
            className="
              flex items-center gap-2 text-sm text-[#1a2f24]/60 cursor-pointer
              hover:text-[#134d37] transition-colors mb-8 group
            "
          >
            <ArrowLeft
              size={16}
              className="group-hover:-translate-x-0.5  cursor-pointer transition-transform"
            />
            Retour au catalogue
          </button>

          {/* ── Main card ── */}
          <div className="bg-white rounded-3xl overflow-hidden shadow-sm">
            {/* ── Hero image ── */}
            <div className="relative h-72 sm:h-96 md:h-[480px] overflow-hidden">
              <img
                src={tree.imageUrl ?? ""}
                alt={tree.name}
                onError={(e) => {
                  (e.target as HTMLImageElement).src =
                    "https://placehold.co/1200x600/e8f5e9/134d37?text=" +
                    encodeURIComponent(tree.name);
                }}
                className="w-full h-full object-cover"
              />
              {/* Gradient overlay — strong at bottom for text legibility */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/20 to-transparent" />

              {/* Price badge */}
              <div className="absolute top-5 right-5 bg-white/95 backdrop-blur-sm text-[#1a2f24] font-bold text-lg px-4 py-2 rounded-full shadow">
                {price.toFixed(2)} €
              </div>

              {/* Name overlay on image */}
              <div className="absolute bottom-0 left-0 right-0 px-6 py-6 bg-gradient-to-t from-black/80 to-transparent">
                <h1
                  className="text-3xl sm:text-4xl font-bold leading-tight"
                  style={{ color: '#ffffff', textShadow: '0 2px 16px rgba(0,0,0,0.9)' }}
                >
                  {tree.name}
                </h1>
                <p
                  className="italic text-base mt-1"
                  style={{ color: 'rgba(255,255,255,0.85)', textShadow: '0 1px 8px rgba(0,0,0,0.8)' }}
                >
                  {tree.species}
                </p>
              </div>
            </div>

            {/* ── Content ── */}
            <div className="p-6 sm:p-10 md:p-14 grid md:grid-cols-3 gap-10">
              {/* Left: description */}
              <div className="md:col-span-2 space-y-6">
                <div>
                  <h2 className="text-xl font-bold text-[#1a2f24] mb-2">
                    Description
                  </h2>
                  <p className="text-gray-500 leading-relaxed text-sm">
                    {tree.description ?? "Aucune description disponible."}
                  </p>
                </div>

                {/* Stats grid */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-4">
                  <StatCard
                    icon={<Leaf size={20} className="text-[#134d37]" />}
                    label="CO₂ absorbé"
                    value={`~${tree.co2} kg/an`}
                    bg="bg-green-50"
                  />
                  <StatCard
                    icon={<Wind size={20} className="text-blue-500" />}
                    label="O₂ produit"
                    value={`${tree.oxygen} kg/an`}
                    bg="bg-blue-50"
                  />
                  <StatCard
                    icon={<MapPin size={20} className="text-amber-500" />}
                    label="Région"
                    value={tree.location ?? "—"}
                    bg="bg-amber-50"
                  />
                  <StatCard
                    icon={<Package size={20} className="text-purple-500" />}
                    label="En stock"
                    value={`${tree.stock} unités`}
                    bg="bg-purple-50"
                  />
                </div>
              </div>

              {/* Right: CTA */}
              <div className="flex flex-col gap-4">
                <div className="bg-[#f3f4f1] rounded-2xl p-6 space-y-4">
                  <div className="flex items-center gap-2">
                    <span className="text-2xl font-bold text-[#1a2f24]">
                      {price.toFixed(2)} €
                    </span>
                  </div>
                  <p className="text-xs text-gray-400">
                    {tree.stock > 0
                      ? `${tree.stock} exemplaires disponibles`
                      : "Rupture de stock"}
                  </p>

                  <button
                    id="add-to-cart-btn"
                    disabled={tree.stock === 0}
                    className="
                      w-full py-3 rounded-xl font-semibold text-sm
                      bg-[#134d37] text-white
                      hover:bg-[#0f3d2b] transition-colors
                      disabled:opacity-40 disabled:cursor-not-allowed
                      cursor-pointer
                    "
                  >
                    Ajouter au panier
                  </button>

                  <button
                    id="back-btn-cta"
                    onClick={() => navigate("/catalog")}
                    className="
                      w-full py-3 rounded-xl font-medium text-sm
                      border border-gray-200
                      text-[#1a2f24]/70 hover:text-[#134d37]
                      hover:border-[#134d37]/40
                      transition-colors cursor-pointer
                    "
                  >
                    Voir d'autres arbres
                  </button>
                </div>
              </div>
            </div>
          </div>
        </main>

        <Footer />
      </div>
    </div>
  );
}

/* ── Stat card sub-component ── */
function StatCard({
  icon,
  label,
  value,
  bg,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
  bg: string;
}) {
  return (
    <div className={`${bg} rounded-2xl p-4 flex flex-col gap-2`}>
      {icon}
      <p className="text-[10px] uppercase tracking-wide text-gray-400 font-medium">
        {label}
      </p>
      <p className="text-sm font-bold text-[#1a2f24]">{value}</p>
    </div>
  );
}
