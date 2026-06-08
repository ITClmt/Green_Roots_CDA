import { Loader2, Lock, ShieldCheck } from "lucide-react";

interface CheckoutFormProps {
  totalPrice: number;
  isPending: boolean;
  error: Error | null;
  onSubmit: () => void;
}

const inputClass =
  "w-full px-4 py-3 bg-surface-primary border border-surface-tertiary rounded-xl text-sm text-content-secondary cursor-not-allowed select-none";

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
          <ShieldCheck size={13} />
          Simulation
        </span>
      </div>

      <div className="flex flex-col gap-4">
        <div className="flex flex-col gap-1.5">
          <label className="text-sm font-medium text-content-primary">
            Numéro de carte
          </label>
          <input
            type="text"
            readOnly
            defaultValue="4242 4242 4242 4242"
            className={inputClass}
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-medium text-content-primary">
              Expiration
            </label>
            <input
              type="text"
              readOnly
              defaultValue="12/28"
              className={inputClass}
            />
          </div>
          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-medium text-content-primary">
              CVV
            </label>
            <input
              type="text"
              readOnly
              defaultValue="•••"
              className={inputClass}
            />
          </div>
        </div>

        <div className="flex flex-col gap-1.5">
          <label className="text-sm font-medium text-content-primary">
            Titulaire
          </label>
          <input
            type="text"
            readOnly
            defaultValue="Jean Dupont"
            className={inputClass}
          />
        </div>
      </div>

      {error && (
        <p className="text-sm text-red-600 bg-red-50 border border-red-200 rounded-xl px-4 py-3">
          {error.message}
        </p>
      )}

      <button
        onClick={onSubmit}
        disabled={isPending}
        className="w-full flex items-center justify-center gap-2 py-3.5 bg-primary hover:bg-primary-hover active:bg-primary-active text-white text-sm font-semibold rounded-[var(--radius-btn)] transition-colors disabled:opacity-60 cursor-pointer disabled:cursor-not-allowed"
      >
        {isPending ? (
          <>
            <Loader2 size={16} className="animate-spin" />
            Validation en cours…
          </>
        ) : (
          <>
            <Lock size={16} />
            Valider la commande · {totalPrice.toFixed(2)} €
          </>
        )}
      </button>
    </div>
  );
}
