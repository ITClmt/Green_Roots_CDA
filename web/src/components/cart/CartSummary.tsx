import { Link } from "react-router";
import { ShoppingBag } from "lucide-react";
import { useCart } from "../../features/cart/CartContext";
import { formatPrice } from "../../utils/formatters";

interface CartSummaryProps {
  to: string;
}

export function CartSummary({ to }: CartSummaryProps) {
  const { totalItems, totalPrice } = useCart();

  return (
    <div className="bg-white rounded-[var(--radius-card)] p-6 shadow-sm flex flex-col gap-4 sticky top-6">
      <h2 className="text-base font-semibold text-content-primary">
        Récapitulatif
      </h2>

      <div className="flex items-center justify-between text-sm text-content-secondary">
        <span>Articles ({totalItems})</span>
        <span>{formatPrice(totalPrice)}</span>
      </div>

      <div className="border-t border-surface-tertiary pt-4 flex items-center justify-between">
        <span className="text-base font-bold text-content-primary">Total</span>
        <span className="text-base font-bold text-primary">
          {formatPrice(totalPrice)}
        </span>
      </div>

      <Link
        to={to}
        className="w-full flex items-center justify-center gap-2 py-3 bg-primary hover:bg-primary-hover active:bg-primary-active text-white text-sm font-semibold rounded-[var(--radius-btn)] transition-colors"
      >
        <ShoppingBag size={16} />
        Procéder au paiement
      </Link>
    </div>
  );
}
