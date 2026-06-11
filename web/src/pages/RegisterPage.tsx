import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Link, Navigate, useNavigate } from "react-router";
import { useAuth } from "../features/auth/AuthContext";
import {
  registerSchema,
  type RegisterFormValues,
} from "../lib/schemas/authSchema";

export function RegisterPage() {
  const { register: registerUser, user } = useAuth();
  const navigate = useNavigate();
  const [serverError, setServerError] = useState("");

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
  });

  if (user) return <Navigate to="/profil" replace />;

  const onSubmit = async (data: RegisterFormValues) => {
    setServerError("");
    try {
      await registerUser(
        data.email,
        data.password,
        data.firstName,
        data.lastName,
      );
      navigate("/profil", { replace: true });
    } catch (err) {
      setServerError(
        err instanceof Error ? err.message : "Une erreur est survenue.",
      );
    }
  };

  const inputClass = (error?: { message?: string }) =>
    `w-full px-4 py-3 bg-white border rounded-xl text-sm placeholder:text-gray-400 focus:outline-none focus:ring-2 transition-all ${
      error
        ? "border-red-400 focus:ring-red-300"
        : "border-gray-200 focus:ring-primary/60 focus:border-primary"
    }`;

  return (
    <div className="flex-1 flex flex-col items-center justify-center px-4 py-12">
      <div className="w-full max-w-md bg-white rounded-card shadow-sm p-8">
        <h1 className="text-2xl font-bold mb-8">Créer un compte</h1>

        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-5">
          <div className="grid grid-cols-2 gap-4">
            <div className="flex flex-col gap-1.5">
              <label htmlFor="register-firstName" className="text-sm font-medium">Prénom</label>
              <input
                id="register-firstName"
                type="text"
                autoComplete="given-name"
                placeholder="Jean"
                aria-invalid={!!errors.firstName}
                aria-describedby={errors.firstName ? "register-firstName-error" : undefined}
                className={inputClass(errors.firstName)}
                {...register("firstName")}
              />
              {errors.firstName && (
                <p id="register-firstName-error" role="alert" className="text-xs text-red-500">
                  {errors.firstName.message}
                </p>
              )}
            </div>
            <div className="flex flex-col gap-1.5">
              <label htmlFor="register-lastName" className="text-sm font-medium">Nom</label>
              <input
                id="register-lastName"
                type="text"
                autoComplete="family-name"
                placeholder="Dupont"
                aria-invalid={!!errors.lastName}
                aria-describedby={errors.lastName ? "register-lastName-error" : undefined}
                className={inputClass(errors.lastName)}
                {...register("lastName")}
              />
              {errors.lastName && (
                <p id="register-lastName-error" role="alert" className="text-xs text-red-500">
                  {errors.lastName.message}
                </p>
              )}
            </div>
          </div>

          <div className="flex flex-col gap-1.5">
            <label htmlFor="register-email" className="text-sm font-medium">Email</label>
            <input
              id="register-email"
              type="email"
              autoComplete="email"
              placeholder="jean@exemple.fr"
              aria-invalid={!!errors.email}
              aria-describedby={errors.email ? "register-email-error" : undefined}
              className={inputClass(errors.email)}
              {...register("email")}
            />
            {errors.email && (
              <p id="register-email-error" role="alert" className="text-xs text-red-500">{errors.email.message}</p>
            )}
          </div>

          <div className="flex flex-col gap-1.5">
            <label htmlFor="register-password" className="text-sm font-medium">Mot de passe</label>
            <input
              id="register-password"
              type="password"
              autoComplete="new-password"
              placeholder="••••••••"
              aria-invalid={!!errors.password}
              aria-describedby={errors.password ? "register-password-error" : "register-password-hint"}
              className={inputClass(errors.password)}
              {...register("password")}
            />
            <p id="register-password-hint" className="text-xs text-gray-400">
              8 caractères minimum
            </p>
            {errors.password && (
              <p id="register-password-error" role="alert" className="text-xs text-red-500">{errors.password.message}</p>
            )}
          </div>

          {serverError && (
            <p role="alert" className="text-sm text-red-600 bg-red-50 border border-red-200 rounded-xl px-4 py-3">
              {serverError}
            </p>
          )}

          <button
            type="submit"
            disabled={isSubmitting}
            className="mt-1 w-full py-3.5 bg-primary hover:bg-primary-hover active:bg-primary-active text-white text-sm font-semibold rounded-btn transition-colors disabled:opacity-60"
          >
            {isSubmitting ? "Création en cours…" : "Créer mon compte"}
          </button>
        </form>

        <p className="text-sm text-content-secondary text-center mt-6">
          Déjà un compte ?{" "}
          <Link
            to="/login"
            className="text-primary font-medium hover:underline"
          >
            Se connecter
          </Link>
        </p>
      </div>
    </div>
  );
}
