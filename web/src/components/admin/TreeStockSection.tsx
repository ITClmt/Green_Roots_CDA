import { useState } from "react";
import { ChevronRight } from "lucide-react";
import { TreeRow } from "./TreeRow";
import type { Tree } from "../../types/tree";

const PREVIEW_LIMIT = 6;

interface TreeStockSectionProps {
  trees: Tree[];
  isLoading: boolean;
  editingId: string | null;
  onEdit: (tree: Tree) => void;
  onDelete: (id: string) => void;
}

export function TreeStockSection({
  trees,
  isLoading,
  editingId,
  onEdit,
  onDelete,
}: TreeStockSectionProps) {
  const [showAll, setShowAll] = useState(false);
  const displayed = showAll ? trees : trees.slice(0, PREVIEW_LIMIT);

  return (
    <section className="bg-white rounded-card p-6 mb-6 shadow-sm">
      {/* Header */}
      <div className="flex items-center justify-between mb-5">
        <h2 className="text-base font-semibold text-content-primary">
          Articles en stock
        </h2>
        <span className="bg-primary text-white text-xs font-medium px-3 py-1 rounded-full">
          {trees.length} produits
        </span>
      </div>

      {/* States */}
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
            {displayed.map((tree) => (
              <TreeRow
                key={tree.id}
                tree={tree}
                isEditing={editingId === tree.id}
                onEdit={onEdit}
                onDelete={onDelete}
              />
            ))}
          </ul>

          {trees.length > PREVIEW_LIMIT && (
            <button
              onClick={() => setShowAll((v) => !v)}
              className="mt-4 flex items-center gap-1 text-sm text-primary font-medium hover:underline"
            >
              {showAll ? "Réduire" : "Voir tout le stock"}
              <ChevronRight
                size={14}
                className={`transition-transform ${showAll ? "rotate-90" : ""}`}
              />
            </button>
          )}
        </>
      )}
    </section>
  );
}
