import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Link, Navigate, useNavigate } from "react-router";
import { useAuth } from "../features/auth/AuthContext";
import { Header } from "../components/layout/Header";
import { Footer } from "../components/layout/Footer";
import { loginSchema, type LoginFormValues } from "../lib/schemas/authSchema";

export function LoginPage() {
  const { login, user } = useAuth();
  const navigate = useNavigate();
  const [serverError, setServerError] = useState("");

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
  });

  if (user) return <Navigate to="/profil" replace />;

  const onSubmit = async (data: LoginFormValues) => {
    setServerError("");
    try {
      await login(data.email, data.password);
      navigate("/profil", { replace: true });
    } catch (err) {
      setServerError(
        err instanceof Error ? err.message : "Une erreur est survenue.",
      );
    }
  };

  const inputClass = (hasError: boolean) =>
    `w-full px-4 py-3 bg-white border rounded-xl text-sm placeholder:text-gray-400 focus:outline-none focus:ring-2 transition-all ${
      hasError
        ? "border-red-400 focus:ring-red-200"
        : "border-gray-200 focus:ring-primary/20 focus:border-primary"
    }`;

  return (
    <div className="min-h-screen bg-[#f9faf7] font-sans flex flex-col">
      <div className="max-w-[1440px] mx-auto w-full">
        <Header />
      </div>

      <div className="flex-1 flex flex-col items-center justify-center px-4 py-12">
        <div className="w-full max-w-md bg-white rounded-[24px] shadow-sm p-8">
          <h1 className="text-2xl font-bold mb-8">Se connecter</h1>

          <form
            onSubmit={handleSubmit(onSubmit)}
            className="flex flex-col gap-5"
          >
            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-medium">Email</label>
              <input
                type="email"
                placeholder="jean@exemple.fr"
                className={inputClass(!!errors.email)}
                {...register("email")}
              />
              {errors.email && (
                <p className="text-xs text-red-500">{errors.email.message}</p>
              )}
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-medium">Mot de passe</label>
              <input
                type="password"
                placeholder="••••••••"
                className={inputClass(!!errors.password)}
                {...register("password")}
              />
              {errors.password && (
                <p className="text-xs text-red-500">
                  {errors.password.message}
                </p>
              )}
            </div>

            {serverError && (
              <p className="text-sm text-red-600 bg-red-50 border border-red-200 rounded-xl px-4 py-3">
                {serverError}
              </p>
            )}

            <button
              type="submit"
              disabled={isSubmitting}
              className="mt-1 w-full py-3.5 bg-primary hover:bg-primary-hover active:bg-primary-active text-white text-sm font-semibold rounded-[12px] transition-colors disabled:opacity-60"
            >
              {isSubmitting ? "Connexion en cours…" : "Se connecter"}
            </button>
          </form>

          <p className="text-sm text-content-secondary text-center mt-6">
            Pas encore de compte ?{" "}
            <Link
              to="/register"
              className="text-primary font-medium hover:underline"
            >
              Créer un compte
            </Link>
          </p>
        </div>
      </div>

      <div className="max-w-[1440px] mx-auto w-full">
        <Footer />
      </div>
    </div>
  );
}
