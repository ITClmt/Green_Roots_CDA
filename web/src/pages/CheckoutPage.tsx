import { Link } from "react-router";
import { ShoppingBag } from "lucide-react";
import { CheckoutForm } from "../components/checkout/CheckoutForm";
import { CartItemRow } from "../components/cart/CartItemRow";
import { useCart } from "../features/cart/CartContext";
import { useCheckout } from "../hooks/useCheckout";
import { usePageTitle } from "../hooks/usePageTitle";
import { formatPrice } from "../utils/formatters";

export function CheckoutPage() {
  usePageTitle();
  const { items, totalPrice } = useCart();
  const { mutate, isPending, error } = useCheckout();

  if (items.length === 0) {
    return (
      <main className="max-w-[1440px] mx-auto w-full px-5 sm:px-10 md:px-16 py-24 flex flex-col items-center gap-4 text-center">
        <ShoppingBag size={48} className="text-content-secondary opacity-40" />
        <p className="text-lg font-semibold text-content-primary">
          Votre panier est vide
        </p>
        <Link
          to="/catalog"
          className="mt-2 px-6 py-3 bg-primary hover:bg-primary-hover text-white text-sm font-semibold rounded-btn transition-colors"
        >
          Voir le catalogue
        </Link>
      </main>
    );
  }

  return (
    <main className="max-w-[1440px] mx-auto w-full px-5 sm:px-10 md:px-16 py-12">
      <h1 className="text-3xl font-bold text-content-primary mb-8">
        Validation de la commande
      </h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
        <section className="lg:col-span-2 flex flex-col gap-4">
          <h2 className="text-sm font-semibold text-content-secondary uppercase tracking-wide">
            Récapitulatif ({items.length} article{items.length > 1 ? "s" : ""})
          </h2>

          {items.map((item) => (
            <CartItemRow key={item.tree.id} item={item} />
          ))}

          <div className="flex justify-between items-center pt-2 border-t border-surface-tertiary">
            <span className="text-base font-bold text-content-primary">
              Total
            </span>
            <span className="text-base font-bold text-primary">
              {formatPrice(totalPrice)}
            </span>
          </div>
        </section>

        <aside className="lg:col-span-1">
          <CheckoutForm
            totalPrice={totalPrice}
            isPending={isPending}
            error={error}
            onSubmit={() => mutate()}
          />
        </aside>
      </div>
    </main>
  );
}
