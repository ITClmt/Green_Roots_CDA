import { Pencil, Trash2 } from "lucide-react";
import type { Tree } from "../../types/tree";

interface TreeRowProps {
  tree: Tree;
  isEditing: boolean;
  onEdit: (tree: Tree) => void;
  onDelete: (id: string) => void;
}

export function TreeRow({ tree, isEditing, onEdit, onDelete }: TreeRowProps) {
  return (
    <li
      className={`flex items-center gap-3 py-3 transition-colors ${
        isEditing ? "bg-surface-primary -mx-2 px-2 rounded-xl" : ""
      }`}
    >
      {/* Thumbnail */}
      <div className="w-10 h-10 rounded-lg overflow-hidden shrink-0 bg-surface-tertiary">
        {tree.imageUrl ? (
          <img
            src={tree.imageUrl}
            alt={tree.name}
            loading="lazy"
            decoding="async"
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-[#9ea89e] text-xs">
            —
          </div>
        )}
      </div>

      {/* Info */}
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium text-content-primary truncate">
          {tree.name}
        </p>
        <p className="text-xs text-content-secondary">
          {[tree.location, `${tree.price}€`].filter(Boolean).join(" • ")}
        </p>
      </div>

      {/* Actions */}
      <div className="flex items-center gap-1 shrink-0">
        <button
          onClick={() => onEdit(tree)}
          className="p-2 text-content-secondary hover:text-primary hover:bg-surface-primary rounded-lg transition-colors"
          aria-label={`Modifier ${tree.name}`}
        >
          <Pencil size={14} />
        </button>
        <button
          // A changer pour un modal si besoin
          onClick={() => {
            if (
              window.confirm(
                `Supprimer "${tree.name}" ? Cette action est irréversible.`,
              )
            )
              onDelete(tree.id);
          }}
          className="p-2 text-content-secondary hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
          aria-label={`Supprimer ${tree.name}`}
        >
          <Trash2 size={14} />
        </button>
      </div>
    </li>
  );
}
