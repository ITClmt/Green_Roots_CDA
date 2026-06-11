import { Link } from "react-router";
import { Home, ArrowLeft, Search } from "lucide-react";

export function NotFoundPage() {
  return (
    <main className="flex-1 flex items-center justify-center px-5 sm:px-10 md:px-16 py-12 md:py-20">
      <div className="max-w-2xl w-full text-center">
        <img
          src="/404.png"
          alt="Un homme avec le regard vide"
          className="mx-auto -mt-8 sm:-mt-12 md:-mt-16 mb-8 w-72 sm:w-96 md:w-md"
        />

        <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-content-primary mb-4">
          Cette page a pris racine ailleurs
        </h1>

        <p className="text-base sm:text-lg text-content-secondary mb-10 max-w-md mx-auto">
          La page que vous cherchez semble avoir été déracinée ou n'a jamais
          existé. Revenons sur un terrain plus fertile.
        </p>

        <div className="flex flex-col sm:flex-row gap-3 justify-center items-center">
          <Link
            to="/"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-primary hover:bg-primary-hover text-white px-6 sm:px-8 py-3 rounded-full font-medium transition-colors shadow-lg shadow-primary/20"
          >
            <Home aria-hidden="true" className="size-4" />
            Retour à l'accueil
          </Link>
          <Link
            to="/catalog"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-white hover:bg-surface-tertiary text-primary px-6 sm:px-8 py-3 rounded-full font-medium transition-colors border border-primary/20"
          >
            <Search aria-hidden="true" className="size-4" />
            Voir le catalogue
          </Link>
        </div>

        <button
          onClick={() => window.history.back()}
          className="mt-8 inline-flex items-center gap-2 text-sm text-content-secondary hover:text-primary transition-colors cursor-pointer"
        >
          <ArrowLeft aria-hidden="true" className="size-4" />
          Page précédente
        </button>
      </div>
    </main>
  );
}
