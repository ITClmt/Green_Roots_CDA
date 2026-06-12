import { CreditCard, Loader2, Lock, ShieldCheck } from "lucide-react";
import { formatPrice } from "../../utils/formatters";

interface CheckoutFormProps {
  totalPrice: number;
  isPending: boolean;
  error: Error | null;
  onSubmit: () => void;
}

export function CheckoutForm({
  totalPrice,
  isPending,
  error,
  onSubmit,
}: CheckoutFormProps) {
  return (
    <div className="bg-white rounded-[var(--radius-card)] p-6 shadow-sm flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <h2 className="text-base font-semibold text-content-primary">
          Paiement
        </h2>
        <span className="flex items-center gap-1.5 text-xs text-secondary bg-surface-primary px-3 py-1 rounded-full">
          <ShieldCheck aria-hidden="true" size={13} />
          Stripe · test
        </span>
      </div>

      <div className="flex items-start gap-3 rounded-xl bg-surface-primary px-4 py-3">
        <CreditCard
          aria-hidden="true"
          size={18}
          className="text-primary mt-0.5 shrink-0"
        />
        <p className="text-sm text-content-secondary">
          Vous allez être redirigé vers la page de paiement sécurisée Stripe pour
          régler votre commande, puis ramené sur le site.
        </p>
      </div>

      <div className="flex justify-between items-center">
        <span className="text-sm text-content-secondary">Montant à régler</span>
        <span className="text-lg font-bold text-primary">
          {formatPrice(totalPrice)}
        </span>
      </div>

      {error && (
        <p
          role="alert"
          className="text-sm text-red-600 bg-red-50 border border-red-200 rounded-xl px-4 py-3"
        >
          {error.message}
        </p>
      )}

      <button
        type="button"
        onClick={onSubmit}
        disabled={isPending}
        className="w-full flex items-center justify-center gap-2 py-3.5 bg-primary hover:bg-primary-hover active:bg-primary-active text-white text-sm font-semibold rounded-[var(--radius-btn)] transition-colors disabled:opacity-60 cursor-pointer disabled:cursor-not-allowed"
      >
        {isPending ? (
          <>
            <Loader2 aria-hidden="true" size={16} className="animate-spin" />
            Redirection vers le paiement…
          </>
        ) : (
          <>
            <Lock aria-hidden="true" size={16} />
            Payer {formatPrice(totalPrice)}
          </>
        )}
      </button>
    </div>
  );
}
