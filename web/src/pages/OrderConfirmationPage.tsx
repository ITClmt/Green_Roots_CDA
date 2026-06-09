import { useLocation, useNavigate } from "react-router";
import { CheckCircle, TreePine } from "lucide-react";
import { Header } from "../components/layout/Header";
import { Footer } from "../components/layout/Footer";
import type { OrderConfirmationState } from "../hooks/useCheckout";

const formatPrice = (cents: number) =>
  new Intl.NumberFormat("fr-FR", { style: "currency", currency: "EUR" }).format(
    cents / 100
  );

export function OrderConfirmationPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const state = location.state as OrderConfirmationState | null;

  if (!state?.orderId) {
    void navigate("/", { replace: true });
    return null;
  }

  const { orderId, items, totalPrice } = state;

  return (
    <div className="min-h-screen bg-surface-secondary font-sans">
      <div className="max-w-[1440px] mx-auto">
        <Header />

        <main className="px-5 sm:px-10 md:px-16 py-16">
          <div className="max-w-2xl mx-auto flex flex-col gap-8">

            {/* En-tête succès */}
            <div className="flex flex-col items-center text-center gap-4">
              <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center">
                <CheckCircle size={32} className="text-primary" />
              </div>
              <h1 className="text-3xl font-bold text-content-primary">
                Merci pour votre commande !
              </h1>
              <p className="text-content-secondary text-sm max-w-md">
                Votre plantation a bien été enregistrée. Chaque arbre compte —
                merci de contribuer à un avenir plus vert.
              </p>
              <p className="text-xs text-content-secondary font-mono bg-surface-primary px-4 py-2 rounded-full">
                Commande #{orderId.slice(0, 8).toUpperCase()}
              </p>
            </div>

            {/* Récapitulatif */}
            <div className="bg-white rounded-[var(--radius-card)] shadow-sm overflow-hidden">
              <div className="px-6 py-4 border-b border-surface-tertiary">
                <h2 className="text-sm font-semibold text-content-primary uppercase tracking-wide">
                  Récapitulatif
                </h2>
              </div>

              <ul className="divide-y divide-surface-tertiary">
                {items.map(({ tree, quantity }) => (
                  <li key={tree.id} className="flex items-center gap-4 px-6 py-4">
                    <div className="w-10 h-10 rounded-full bg-surface-primary flex items-center justify-center shrink-0">
                      <TreePine size={18} className="text-primary" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold text-content-primary truncate">
                        {tree.name}
                      </p>
                      <p className="text-xs text-content-secondary italic">
                        {tree.species}
                      </p>
                    </div>
                    <div className="text-right shrink-0">
                      <p className="text-sm font-semibold text-content-primary">
                        × {quantity}
                      </p>
                      <p className="text-xs text-content-secondary">
                        {formatPrice(Math.round(parseFloat(tree.price) * 100) * quantity)}
                      </p>
                    </div>
                  </li>
                ))}
              </ul>

              <div className="px-6 py-4 border-t border-surface-tertiary flex justify-between items-center">
                <span className="text-base font-bold text-content-primary">Total</span>
                <span className="text-base font-bold text-primary">
                  {formatPrice(Math.round(totalPrice * 100))}
                </span>
              </div>
            </div>

            {/* Actions */}
            <div className="flex flex-col sm:flex-row gap-3">
              <button
                onClick={() => void navigate("/profil")}
                className="flex-1 py-3 bg-primary hover:bg-primary-hover text-white text-sm font-semibold rounded-[var(--radius-btn)] transition-colors cursor-pointer"
              >
                Voir mon profil
              </button>
              <button
                onClick={() => void navigate("/catalog")}
                className="flex-1 py-3 bg-surface-primary hover:bg-surface-tertiary text-content-primary text-sm font-medium rounded-[var(--radius-btn)] transition-colors cursor-pointer"
              >
                Continuer mes achats
              </button>
            </div>

          </div>
        </main>

        <Footer />
      </div>
    </div>
  );
}
