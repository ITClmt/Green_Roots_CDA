import { useEffect, useRef } from "react";
import { Link, Navigate, useSearchParams } from "react-router";
import { useQuery } from "@tanstack/react-query";
import { CheckCircle, Loader2, TreePine, XCircle } from "lucide-react";
import { getOrderBySession } from "../api/checkout";
import { useAuth } from "../features/auth/AuthContext";
import { useCart } from "../features/cart/CartContext";
import { withRefresh } from "../utils/withRefresh";
import { formatPrice } from "../utils/formatters";

export function OrderConfirmationPage() {
  const [searchParams] = useSearchParams();
  const sessionId = searchParams.get("session_id");
  const { accessToken, refreshSession } = useAuth();
  const { clearCart } = useCart();
  const cartCleared = useRef(false);

  const { data, isLoading, isError } = useQuery({
    queryKey: ["order-by-session", sessionId],
    enabled: !!sessionId && !!accessToken,
    queryFn: () =>
      withRefresh(
        (token) => getOrderBySession(sessionId!, token),
        accessToken!,
        refreshSession,
      ),

    refetchInterval: (query) => {
      const status = query.state.data?.data?.status;
      return status === "PAID" || status === "CANCELLED" ? false : 2000;
    },
  });

  const order = data?.data;
  const status = order?.status;


  useEffect(() => {
    if (status === "PAID" && !cartCleared.current) {
      cartCleared.current = true;
      clearCart();
    }
  }, [status, clearCart]);

  if (!sessionId) {
    return <Navigate to="/" replace />;
  }

  return (
    <main className="max-w-[1440px] mx-auto w-full px-5 sm:px-10 md:px-16 py-16">
      <div className="max-w-2xl mx-auto flex flex-col gap-8">
        {(isLoading || status === "PENDING") && (
          <div className="flex flex-col items-center text-center gap-4">
            <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center">
              <Loader2 size={32} className="text-primary animate-spin" />
            </div>
            <h1 className="text-3xl font-bold text-content-primary">
              Confirmation du paiement…
            </h1>
            <p className="text-content-secondary text-sm max-w-md">
              Nous validons votre paiement auprès de Stripe. Cette page se mettra
              à jour automatiquement.
            </p>
          </div>
        )}

        {isError && (
          <div className="flex flex-col items-center text-center gap-4">
            <div className="w-16 h-16 rounded-full bg-red-100 flex items-center justify-center">
              <XCircle size={32} className="text-red-500" />
            </div>
            <h1 className="text-3xl font-bold text-content-primary">
              Commande introuvable
            </h1>
            <p className="text-content-secondary text-sm max-w-md">
              Nous n'avons pas pu retrouver cette commande. Si vous avez été
              débité, contactez le support.
            </p>
            <Link
              to="/catalog"
              className="mt-2 px-6 py-3 bg-primary hover:bg-primary-hover text-white text-sm font-semibold rounded-btn transition-colors"
            >
              Retour au catalogue
            </Link>
          </div>
        )}

        {status === "CANCELLED" && (
          <div className="flex flex-col items-center text-center gap-4">
            <div className="w-16 h-16 rounded-full bg-red-100 flex items-center justify-center">
              <XCircle size={32} className="text-red-500" />
            </div>
            <h1 className="text-3xl font-bold text-content-primary">
              Paiement annulé
            </h1>
            <p className="text-content-secondary text-sm max-w-md">
              Votre paiement n'a pas abouti. Votre panier est toujours
              disponible.
            </p>
            <Link
              to="/cart"
              className="mt-2 px-6 py-3 bg-primary hover:bg-primary-hover text-white text-sm font-semibold rounded-btn transition-colors"
            >
              Retour au panier
            </Link>
          </div>
        )}

        {status === "PAID" && order && (
          <>
            <div className="flex flex-col items-center text-center gap-4">
              <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center">
                <CheckCircle size={32} className="text-primary" />
              </div>
              <h1 className="text-3xl font-bold text-content-primary">
                Merci pour votre commande !
              </h1>
              <p className="text-content-secondary text-sm max-w-md">
                Votre plantation a bien été enregistrée. Chaque arbre compte,
                merci de contribuer à un avenir plus vert.
              </p>
              <p className="text-xs text-content-secondary font-mono bg-surface-primary px-4 py-2 rounded-full">
                Commande #{order.id.slice(0, 8).toUpperCase()}
              </p>
            </div>

            <div className="bg-white rounded-card shadow-sm overflow-hidden">
              <div className="px-6 py-4 border-b border-surface-tertiary">
                <h2 className="text-sm font-semibold text-content-primary uppercase tracking-wide">
                  Récapitulatif
                </h2>
              </div>

              <ul className="divide-y divide-surface-tertiary">
                {order.items.map((item) => (
                  <li
                    key={item.id}
                    className="flex items-center gap-4 px-6 py-4"
                  >
                    <div className="w-10 h-10 rounded-full bg-surface-primary flex items-center justify-center shrink-0">
                      <TreePine size={18} className="text-primary" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold text-content-primary truncate">
                        {item.name}
                      </p>
                      <p className="text-xs text-content-secondary italic">
                        {item.species}
                      </p>
                    </div>
                    <div className="text-right shrink-0">
                      <p className="text-sm font-semibold text-content-primary">
                        × {item.quantity}
                      </p>
                      <p className="text-xs text-content-secondary">
                        {formatPrice(Number(item.unitPrice) * item.quantity)}
                      </p>
                    </div>
                  </li>
                ))}
              </ul>

              <div className="px-6 py-4 border-t border-surface-tertiary flex justify-between items-center">
                <span className="text-base font-bold text-content-primary">
                  Total
                </span>
                <span className="text-base font-bold text-primary">
                  {formatPrice(Number(order.totalAmount))}
                </span>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-3">
              <Link
                to="/profil"
                className="flex-1 py-3 text-center bg-primary hover:bg-primary-hover text-white text-sm font-semibold rounded-btn transition-colors"
              >
                Voir mon profil
              </Link>
              <Link
                to="/catalog"
                className="flex-1 py-3 text-center bg-surface-primary hover:bg-surface-tertiary text-content-primary text-sm font-medium rounded-btn transition-colors"
              >
                Continuer mes achats
              </Link>
            </div>
          </>
        )}
      </div>
    </main>
  );
}
