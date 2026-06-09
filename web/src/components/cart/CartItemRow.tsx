import { Minus, Plus, Trash2 } from "lucide-react";
import { useCart } from "../../features/cart/useCart";
import type { CartItem } from "../../types/cart";

interface CartItemRowProps {
  item: CartItem;
}

export function CartItemRow({ item }: CartItemRowProps) {
  const { increment, decrement, removeFromCart } = useCart();
  const { tree, quantity } = item;
  const subtotal = (tree.price * quantity).toFixed(2);

  return (
    <div className="flex items-center gap-4 bg-white rounded-[var(--radius-card)] p-4 shadow-sm">
      <img
        src={tree.imageUrl ?? `https://placehold.co/80x80/e8f5e9/134d37?text=${encodeURIComponent(tree.name)}`}
        alt={tree.name}
        className="w-20 h-20 object-cover rounded-xl shrink-0"
      />

      <div className="flex-1 min-w-0">
        <p className="text-sm font-semibold text-content-primary leading-snug truncate">
          {tree.name}
        </p>
        <p className="text-xs text-content-secondary mt-0.5">{tree.species}</p>
        <p className="text-xs text-content-secondary mt-1">
          {tree.price.toFixed(2)} € / unité
        </p>
      </div>

      <div className="flex flex-col items-end gap-3 shrink-0">
        <div className="flex items-center gap-2">
          <button
            onClick={() => decrement(tree.id)}
            aria-label="Diminuer la quantité"
            className="w-8 h-8 flex items-center justify-center rounded-[var(--radius-btn)] bg-surface-primary hover:bg-surface-tertiary transition-colors cursor-pointer"
          >
            <Minus size={14} className="text-content-primary" />
          </button>

          <span className="w-6 text-center text-sm font-semibold text-content-primary">
            {quantity}
          </span>

          <button
            onClick={() => increment(tree.id)}
            disabled={quantity >= tree.stock}
            aria-label="Augmenter la quantité"
            className="w-8 h-8 flex items-center justify-center rounded-[var(--radius-btn)] bg-surface-primary hover:bg-surface-tertiary transition-colors cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed"
          >
            <Plus size={14} className="text-content-primary" />
          </button>
        </div>

        <p className="text-sm font-bold text-primary">{subtotal} €</p>

        <button
          onClick={() => removeFromCart(tree.id)}
          aria-label="Supprimer l'article"
          className="text-content-secondary hover:text-tertiary transition-colors cursor-pointer"
        >
          <Trash2 size={15} />
        </button>
      </div>
    </div>
  );
}
