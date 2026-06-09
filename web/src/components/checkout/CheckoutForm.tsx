import { useState } from "react";
import { Loader2, Lock, ShieldCheck } from "lucide-react";

interface CheckoutFormProps {
  totalPrice: number;
  isPending: boolean;
  error: Error | null;
  onSubmit: () => void;
}

const inputClass =
  "w-full px-4 py-3 bg-white border border-surface-tertiary rounded-xl text-sm text-content-primary placeholder:text-content-secondary focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all";

function formatCardNumber(value: string): string {
  return value
    .replace(/\D/g, "")
    .slice(0, 16)
    .replace(/(.{4})/g, "$1 ")
    .trimEnd();
}

function formatExpiry(value: string): string {
  const digits = value.replace(/\D/g, "").slice(0, 4);
  if (digits.length <= 2) return digits;
  return `${digits.slice(0, 2)}/${digits.slice(2)}`;
}

export function CheckoutForm({
  totalPrice,
  isPending,
  error,
  onSubmit,
}: CheckoutFormProps) {
  const [cardNumber, setCardNumber] = useState("");
  const [expiry, setExpiry] = useState("");

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
            inputMode="numeric"
            placeholder="4242 4242 4242 4242"
            value={cardNumber}
            onChange={(e) => setCardNumber(formatCardNumber(e.target.value))}
            maxLength={19}
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
              inputMode="numeric"
              placeholder="MM/AA"
              value={expiry}
              onChange={(e) => setExpiry(formatExpiry(e.target.value))}
              maxLength={5}
              className={inputClass}
            />
          </div>
          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-medium text-content-primary">
              CVV
            </label>
            <input
              type="password"
              placeholder="•••"
              maxLength={4}
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
            placeholder="Jean Dupont"
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
