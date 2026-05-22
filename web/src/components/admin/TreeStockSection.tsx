import { useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { TreeRow } from "./TreeRow";
import { useTrees } from "../../hooks/useTrees";
import type { Tree } from "../../types/tree";

const PAGE_SIZE = 10;

interface TreeStockSectionProps {
  editingId: string | null;
  onEdit: (tree: Tree) => void;
  onDelete: (id: string) => void;
}

export function TreeStockSection({
  editingId,
  onEdit,
  onDelete,
}: TreeStockSectionProps) {
  const [page, setPage] = useState(1);
  const { data, isLoading } = useTrees(page, PAGE_SIZE);
  const trees = data?.data ?? [];
  const { total = 0, totalPages = 1 } = data?.meta ?? {};

  return (
    <section className="bg-white rounded-card p-6 mb-6 shadow-sm">
      <div className="flex items-center justify-between mb-5">
        <h2 className="text-base font-semibold text-content-primary">
          Articles en stock
        </h2>
        <span className="bg-primary text-white text-xs font-medium px-3 py-1 rounded-full">
          {total} produits
        </span>
      </div>

      {isLoading ? (
        <div className="space-y-3">
          {[...Array(3)].map((_, i) => (
            <div
              key={i}
              className="h-14 bg-surface-primary rounded-xl animate-pulse"
            />
          ))}
        </div>
      ) : trees.length === 0 ? (
        <p className="text-sm text-content-secondary text-center py-6">
          Aucun arbre enregistré
        </p>
      ) : (
        <>
          <ul className="divide-y divide-surface-tertiary">
            {trees.map((tree) => (
              <TreeRow
                key={tree.id}
                tree={tree}
                isEditing={editingId === tree.id}
                onEdit={onEdit}
                onDelete={onDelete}
              />
            ))}
          </ul>

          {totalPages > 1 && (
            <div className="mt-4 flex items-center justify-between text-sm text-content-secondary">
              <button
                onClick={() => setPage((p) => p - 1)}
                disabled={page === 1}
                className="flex items-center gap-1 px-3 py-1.5 rounded-lg hover:bg-surface-primary disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
              >
                <ChevronLeft size={14} />
                Précédent
              </button>

              <span className="font-medium text-content-primary">
                {page} / {totalPages}
              </span>

              <button
                onClick={() => setPage((p) => p + 1)}
                disabled={page === totalPages}
                className="flex items-center gap-1 px-3 py-1.5 rounded-lg hover:bg-surface-primary disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
              >
                Suivant
                <ChevronRight size={14} />
              </button>
            </div>
          )}
        </>
      )}
    </section>
  );
}
