import { useState } from "react";
import { CatalogueCard, type TreeItem } from "./CatalogueCard";
import { useTrees } from "../../hooks/useTrees";
import type { Tree } from "../../types/tree";

const PAGE_SIZE = 9;

interface CatalogueGridProps {
  searchQuery: string;
  activeTag: string;
}

export function CatalogueGrid({ searchQuery, activeTag }: CatalogueGridProps) {
  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE);
  const { data: paginatedTrees, isLoading, error } = useTrees();
  const trees: Tree[] = paginatedTrees?.data ?? [];

  /* Loading state */
  if (isLoading) {
    return (
      <div className="flex justify-center items-center py-24 text-gray-400 text-sm">
        Chargement du catalogue...
      </div>
    );
  }

  /* Error state */
  if (error) {
    return (
      <div className="flex justify-center items-center py-24 text-red-400 text-sm">
        Erreur : {error.message}
      </div>
    );
  }

  /* Map API Tree → TreeItem (shape expected by CatalogueCard) */
  const allTrees: TreeItem[] = trees.map((tree) => ({
    id: tree.id,
    name: tree.species,
    commonName: tree.name,
    description: tree.description,
    region: tree.location ?? "",
    country: tree.location ?? "",
    co2PerYear: tree.co2,
    price: tree.price,
    image: tree.imageUrl ?? "",
    tag: "all",
  }));

  /* Filter trees */
  const filtered = allTrees.filter((tree) => {
    const matchesTag = activeTag === "all" || tree.tag === activeTag;
    const q = searchQuery.toLowerCase();
    const matchesSearch =
      !q ||
      tree.name.toLowerCase().includes(q) ||
      tree.commonName.toLowerCase().includes(q);
    return matchesTag && matchesSearch;
  });

  const visible = filtered.slice(0, visibleCount);
  const hasMore = visibleCount < filtered.length;

  return (
    <section id="catalogue-grid">
      {filtered.length === 0 ? (
        <div className="text-center py-20 text-gray-400 text-sm">
          Aucun arbre ne correspond à votre recherche.
        </div>
      ) : (
        <>
          <div
            className="
              grid gap-5
              grid-cols-1
              sm:grid-cols-2
              lg:grid-cols-3
            "
          >
            {visible.map((tree) => (
              <CatalogueCard key={tree.id} tree={tree} />
            ))}
          </div>

          {hasMore && (
            <div className="mt-10 flex justify-center">
              <button
                id="load-more-btn"
                onClick={() => setVisibleCount((c) => c + PAGE_SIZE)}
                className="
                  px-8 py-3.5
                  bg-[#134d37] hover:bg-[#0f3d2b]
                  text-white text-sm font-semibold
                  rounded-full shadow-md
                  transition-all duration-200
                  hover:shadow-lg hover:-translate-y-0.5
                  cursor-pointer
                "
              >
                Charger plus d'arbres
              </button>
            </div>
          )}
        </>
      )}
    </section>
  );
}
