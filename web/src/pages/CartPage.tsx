import { useNavigate } from "react-router";
import { ShoppingCart } from "lucide-react";
import { Header } from "../components/layout/Header";
import { Footer } from "../components/layout/Footer";
import { CartItemRow } from "../components/cart/CartItemRow";
import { CartSummary } from "../components/cart/CartSummary";
import { useCart } from "../features/cart/useCart";
import { useAuth } from "../features/auth/AuthContext";
import { usePageTitle } from "../hooks/usePageTitle";

export function CartPage() {
  usePageTitle();
  const { items } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();

  const handleCheckout = () => {
    if (!user) {
      void navigate("/login");
    } else {
      void navigate("/checkout");
    }
  };

  return (
    <div className="min-h-screen bg-surface-secondary font-sans">
      <div className="max-w-[1440px] mx-auto">
        <Header />

        <main className="px-5 sm:px-10 md:px-16 py-12">
          <h1 className="text-3xl font-bold text-content-primary mb-8">
            Mon panier
          </h1>

          {items.length === 0 ? (
            <div className="flex flex-col items-center justify-center gap-4 py-24 text-center">
              <ShoppingCart size={48} className="text-content-secondary opacity-40" />
              <p className="text-lg font-semibold text-content-primary">
                Votre panier est vide
              </p>
              <p className="text-sm text-content-secondary">
                Explorez notre catalogue et ajoutez des arbres à planter.
              </p>
              <button
                onClick={() => void navigate("/catalog")}
                className="mt-2 px-6 py-3 bg-primary hover:bg-primary-hover text-white text-sm font-semibold rounded-[var(--radius-btn)] transition-colors cursor-pointer"
              >
                Voir le catalogue
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
              <section className="lg:col-span-2 flex flex-col gap-4">
                {items.map((item) => (
                  <CartItemRow key={item.tree.id} item={item} />
                ))}
              </section>

              <aside className="lg:col-span-1">
                <CartSummary onCheckout={handleCheckout} />
              </aside>
            </div>
          )}
        </main>

        <Footer />
      </div>
    </div>
  );
}
