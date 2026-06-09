import { useState } from "react";
import { X, Minus, Plus, ShoppingBag, ArrowRight, CheckCircle } from "lucide-react";
import { Link } from "react-router";
import { useCart } from "../../features/cart/CartContext";
import type { Tree } from "../../types/tree";
import { formatPrice } from "../../utils/formatters";
import { useDialogSync } from "../../hooks/useDialogSync";

interface AddToCartModalProps {
  tree: Tree;
  isOpen: boolean;
  onClose: () => void;
}

type Step = "select" | "confirm";


export function AddToCartModal({ tree, isOpen, onClose }: AddToCartModalProps) {
  const { addToCart } = useCart();
  const [step, setStep] = useState<Step>("select");
  const [quantity, setQuantity] = useState(1);

  const subtotal = tree.price * quantity;

  const handleClose = () => {
    setStep("select");
    setQuantity(1);
    onClose();
  };

  const dialogRef = useDialogSync(isOpen, handleClose);

  const handleBackdropClick = (e: React.MouseEvent<HTMLDialogElement>) => {
    if (e.target === dialogRef.current) handleClose();
  };

  const handleAdd = () => {
    addToCart(tree, quantity);
    setStep("confirm");
  };

  return (
    <dialog
      ref={dialogRef}
      onClick={handleBackdropClick}
      aria-labelledby="modal-title"
      className="w-full max-w-md m-auto rounded-[var(--radius-card)] shadow-xl p-0 backdrop:bg-black/50 backdrop:backdrop-blur-sm"
    >
      <div className="flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between px-6 pt-6 pb-4 border-b border-surface-tertiary">
        <h2 id="modal-title" className="text-base font-semibold text-content-primary">
          {step === "select" ? "Ajouter au panier" : "Ajouté au panier !"}
        </h2>
        <button
          onClick={handleClose}
          aria-label="Fermer la modale"
          className="text-content-secondary hover:text-content-primary transition-colors cursor-pointer"
        >
          <X size={20} />
        </button>
      </div>

        {/* Tree info */}
        <div className="flex items-center gap-4 px-6 py-4 bg-surface-secondary">
        <img
          src={
            tree.imageUrl ??
            `https://placehold.co/64x64/e8f5e9/134d37?text=${encodeURIComponent(tree.name)}`
          }
          alt={tree.name}
          className="w-16 h-16 object-cover rounded-xl shrink-0"
        />
        <div className="min-w-0">
          <p className="text-sm font-semibold text-content-primary truncate">{tree.name}</p>
          <p className="text-xs text-content-secondary italic">{tree.species}</p>
          <p className="text-xs text-primary font-medium mt-1">
            {formatPrice(tree.price)} / unité
          </p>
        </div>
      </div>

        {/* Step: select quantity */}
        {step === "select" && (
        <div className="px-6 py-6 flex flex-col gap-6">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-content-primary">Quantité</span>
            <div className="flex items-center gap-3">
              <button
                onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                disabled={quantity <= 1}
                aria-label="Diminuer la quantité"
                className="w-9 h-9 flex items-center justify-center rounded-[var(--radius-btn)] bg-surface-primary hover:bg-surface-tertiary transition-colors cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed"
              >
                <Minus size={14} />
              </button>
              <span className="w-8 text-center text-sm font-bold text-content-primary">
                {quantity}
              </span>
              <button
                onClick={() => setQuantity((q) => Math.min(tree.stock, q + 1))}
                disabled={quantity >= tree.stock}
                aria-label="Augmenter la quantité"
                className="w-9 h-9 flex items-center justify-center rounded-[var(--radius-btn)] bg-surface-primary hover:bg-surface-tertiary transition-colors cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed"
              >
                <Plus size={14} />
              </button>
            </div>
          </div>

          <div className="flex items-center justify-between pt-2 border-t border-surface-tertiary">
            <span className="text-sm text-content-secondary">Sous-total</span>
            <span className="text-base font-bold text-primary">
              {formatPrice(subtotal)}
            </span>
          </div>

          <button
            onClick={handleAdd}
            className="w-full flex items-center justify-center gap-2 py-3 bg-primary hover:bg-primary-hover active:bg-primary-active text-white text-sm font-semibold rounded-[var(--radius-btn)] transition-colors cursor-pointer"
          >
            <ShoppingBag size={16} />
            Ajouter au panier
          </button>
        </div>
      )}

        {/* Step: confirm */}
        {step === "confirm" && (
        <div className="px-6 py-6 flex flex-col gap-4">
          <div className="flex items-center gap-3">
            <CheckCircle size={20} className="text-secondary shrink-0" />
            <p className="text-sm font-medium text-content-primary">
              {quantity} × {tree.name} ajouté{quantity > 1 ? "s" : ""} au panier
            </p>
          </div>

          <p className="text-sm text-content-secondary">
            Sous-total :{" "}
            <span className="font-semibold text-primary">
              {formatPrice(subtotal)}
            </span>
          </p>

          <div className="flex flex-col gap-2 pt-2">
            <Link
              to="/cart"
              onClick={handleClose}
              className="w-full flex items-center justify-center gap-2 py-3 bg-primary hover:bg-primary-hover text-white text-sm font-semibold rounded-[var(--radius-btn)] transition-colors"
            >
              <ShoppingBag size={16} />
              Voir le panier
            </Link>
            <button
              onClick={handleClose}
              className="w-full flex items-center justify-center gap-2 py-3 bg-surface-primary hover:bg-surface-tertiary text-content-primary text-sm font-medium rounded-[var(--radius-btn)] transition-colors cursor-pointer"
            >
              Continuer mes achats
              <ArrowRight size={14} />
            </button>
          </div>
        </div>
      )}

      </div>
    </dialog>

  );
}
