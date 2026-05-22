import { useState } from "react";
import { Header } from "../components/layout/Header";
import { Footer } from "../components/layout/Footer";
import { CatalogueSearchBar } from "../components/catalogue/CatalogueSearchBar";
import { CatalogueGrid } from "../components/catalogue/CatalogueGrid";

export function CataloguePage() {
  const [search, setSearch] = useState("");

  return (
    <div className="min-h-screen bg-[#f9faf7] font-sans">
      <div className="max-w-[1440px] mx-auto">
        <Header />

        <main className="px-5 sm:px-10 md:px-16 py-8 md:py-12">
          <div className="mb-8">
            <CatalogueSearchBar value={search} onChange={setSearch} />
          </div>

          <div className="mb-6">
            <h1 className="text-3xl md:text-4xl font-bold text-[#1a2f24]">Catalogue</h1>
            <p className="text-sm text-gray-500 mt-1">Découvrez notre catalogue d'arbres</p>
          </div>

          <CatalogueGrid searchQuery={search} />
        </main>

        <Footer />
      </div>
    </div>
  );
}
