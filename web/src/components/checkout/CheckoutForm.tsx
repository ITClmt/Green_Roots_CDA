import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2, Lock, ShieldCheck } from "lucide-react";
import { formatPrice } from "../../utils/formatters";
import { checkoutSchema, type CheckoutFormValues } from "../../lib/schemas/checkoutSchema";

interface CheckoutFormProps {
  totalPrice: number;
  isPending: boolean;
  error: Error | null;
  onSubmit: () => void;
}

const inputClass =
  "w-full px-4 py-3 bg-white border border-surface-tertiary rounded-xl text-sm text-content-primary placeholder:text-content-secondary focus:outline-none focus:ring-2 focus:ring-primary/60 focus:border-primary transition-all";

const errorClass = "text-xs text-red-500 mt-1";

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
  const {
    register,
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<CheckoutFormValues>({
    resolver: zodResolver(checkoutSchema),
  });

  return (
    <div className="bg-white rounded-[var(--radius-card)] p-6 shadow-sm flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <h2 className="text-base font-semibold text-content-primary">
          Paiement
        </h2>
        <span className="flex items-center gap-1.5 text-xs text-secondary bg-surface-primary px-3 py-1 rounded-full">
          <ShieldCheck aria-hidden="true" size={13} />
          Simulation
        </span>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} noValidate className="flex flex-col gap-4">
        <div className="flex flex-col gap-1.5">
          <label htmlFor="checkout-cardNumber" className="text-sm font-medium text-content-primary">
            Numéro de carte
          </label>
          <Controller
            name="cardNumber"
            control={control}
            render={({ field }) => (
              <input
                {...field}
                id="checkout-cardNumber"
                type="text"
                inputMode="numeric"
                placeholder="4242 4242 4242 4242"
                maxLength={19}
                aria-invalid={!!errors.cardNumber}
                aria-describedby={errors.cardNumber ? "checkout-cardNumber-error" : undefined}
                className={inputClass}
                value={field.value ?? ""}
                onChange={(e) => field.onChange(formatCardNumber(e.target.value))}
              />
            )}
          />
          {errors.cardNumber && (
            <p id="checkout-cardNumber-error" role="alert" className={errorClass}>{errors.cardNumber.message}</p>
          )}
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="flex flex-col gap-1.5">
            <label htmlFor="checkout-expiry" className="text-sm font-medium text-content-primary">
              Expiration
            </label>
            <Controller
              name="expiry"
              control={control}
              render={({ field }) => (
                <input
                  {...field}
                  id="checkout-expiry"
                  type="text"
                  inputMode="numeric"
                  placeholder="MM/AA"
                  maxLength={5}
                  aria-invalid={!!errors.expiry}
                  aria-describedby={errors.expiry ? "checkout-expiry-error" : undefined}
                  className={inputClass}
                  value={field.value ?? ""}
                  onChange={(e) => field.onChange(formatExpiry(e.target.value))}
                />
              )}
            />
            {errors.expiry && (
              <p id="checkout-expiry-error" role="alert" className={errorClass}>{errors.expiry.message}</p>
            )}
          </div>

          <div className="flex flex-col gap-1.5">
            <label htmlFor="checkout-cvv" className="text-sm font-medium text-content-primary">
              CVV
            </label>
            <input
              id="checkout-cvv"
              type="password"
              placeholder="•••"
              inputMode="numeric"
              maxLength={4}
              aria-invalid={!!errors.cvv}
              aria-describedby={errors.cvv ? "checkout-cvv-error" : undefined}
              className={inputClass}
              {...register("cvv")}
            />
            {errors.cvv && (
              <p id="checkout-cvv-error" role="alert" className={errorClass}>{errors.cvv.message}</p>
            )}
          </div>
        </div>

        <div className="flex flex-col gap-1.5">
          <label htmlFor="checkout-cardHolder" className="text-sm font-medium text-content-primary">
            Titulaire
          </label>
          <input
            id="checkout-cardHolder"
            type="text"
            placeholder="Jean Dupont"
            aria-invalid={!!errors.cardHolder}
            aria-describedby={errors.cardHolder ? "checkout-cardHolder-error" : undefined}
            className={inputClass}
            {...register("cardHolder")}
          />
          {errors.cardHolder && (
            <p id="checkout-cardHolder-error" role="alert" className={errorClass}>{errors.cardHolder.message}</p>
          )}
        </div>

        {error && (
          <p role="alert" className="text-sm text-red-600 bg-red-50 border border-red-200 rounded-xl px-4 py-3">
            {error.message}
          </p>
        )}

        <button
          type="submit"
          disabled={isPending}
          className="w-full flex items-center justify-center gap-2 py-3.5 bg-primary hover:bg-primary-hover active:bg-primary-active text-white text-sm font-semibold rounded-[var(--radius-btn)] transition-colors disabled:opacity-60 cursor-pointer disabled:cursor-not-allowed"
        >
          {isPending ? (
            <>
              <Loader2 aria-hidden="true" size={16} className="animate-spin" />
              Validation en cours…
            </>
          ) : (
            <>
              <Lock aria-hidden="true" size={16} />
              Valider la commande · {formatPrice(totalPrice)}
            </>
          )}
        </button>
      </form>
    </div>
  );
}
