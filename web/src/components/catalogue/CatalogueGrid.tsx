import { CatalogueCard, type TreeItem } from "./CatalogueCard";
import { useInfiniteTrees } from "../../hooks/useTrees";
import type { Tree } from "../../types/tree";

interface CatalogueGridProps {
  searchQuery: string;
  activeTag: string;
}

export function CatalogueGrid({ searchQuery, activeTag }: CatalogueGridProps) {
  const {
    data,
    isLoading,
    error,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useInfiniteTrees();

  if (isLoading) {
    return (
      <div className="flex justify-center items-center py-24 text-gray-400 text-sm">
        Chargement du catalogue...
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center py-24 text-red-400 text-sm">
        Erreur : {error.message}
      </div>
    );
  }

  const allTrees: TreeItem[] = (data?.pages ?? [])
    .flatMap((page) => page.data)
    .map((tree: Tree) => ({
      id: tree.id,
      name: tree.species,
      commonName: tree.name,
      description: tree.description,
      location: tree.location ?? "",
      co2: tree.co2,
      oxygen: tree.oxygen,
      price: tree.price,
      image: tree.imageUrl ?? "",
      tag: "all",
    }));

  const filtered = allTrees.filter((tree) => {
    const matchesTag = activeTag === "all" || tree.tag === activeTag;
    const q = searchQuery.toLowerCase();
    const matchesSearch =
      !q ||
      tree.name.toLowerCase().includes(q) ||
      tree.commonName.toLowerCase().includes(q);
    return matchesTag && matchesSearch;
  });

  return (
    <section id="catalogue-grid">
      {filtered.length === 0 ? (
        <div className="text-center py-20 text-gray-400 text-sm">
          Aucun arbre ne correspond à votre recherche.
        </div>
      ) : (
        <div className="grid gap-5 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((tree) => (
            <CatalogueCard key={tree.id} tree={tree} />
          ))}
        </div>
      )}

      {hasNextPage && (
        <div className="mt-10 flex justify-center">
          <button
            onClick={() => fetchNextPage()}
            disabled={isFetchingNextPage}
            className="px-8 py-3.5 bg-[#134d37] hover:bg-[#0f3d2b] text-white text-sm font-semibold rounded-full shadow-md transition-all duration-200 hover:shadow-lg hover:-translate-y-0.5 cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {isFetchingNextPage ? "Chargement..." : "Charger plus d'arbres"}
          </button>
        </div>
      )}
    </section>
  );
}
