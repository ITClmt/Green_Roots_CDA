import { useState } from "react";
import { Header } from "../components/layout/Header";
import { Footer } from "../components/layout/Footer";
import { TreeStockSection } from "../components/admin/TreeStockSection";
import { TreeFormSection } from "../components/admin/TreeFormSection";
import { useDeleteTree } from "../hooks/useTreeMutations";
import type { Tree } from "../types/tree";

export function AdminTreesPage() {
  const [editingTree, setEditingTree] = useState<Tree | null>(null);
  const deleteTree = useDeleteTree();

  function handleEdit(tree: Tree) {
    setEditingTree(tree);
    window.scrollTo({ top: document.body.scrollHeight, behavior: "smooth" });
  }

  function handleReset() {
    setEditingTree(null);
  }

  function handleDelete(id: string) {
    deleteTree.mutate(id, {
      onSuccess: () => { if (editingTree?.id === id) setEditingTree(null); },
    });
  }

  return (
    <div className="min-h-screen bg-surface-secondary font-sans flex flex-col">
      <div className="max-w-360 mx-auto w-full">
        <Header />
      </div>

      <main className="flex-1 max-w-360 mx-auto w-full px-5 sm:px-8 py-8">
        <h1 className="text-2xl font-semibold text-content-primary mb-8">
          Gestion de l'inventaire
        </h1>

        <TreeStockSection
          editingId={editingTree?.id ?? null}
          onEdit={handleEdit}
          onDelete={handleDelete}
        />

        <TreeFormSection
          key={editingTree?.id ?? "new"}
          editingTree={editingTree}
          onCancel={handleReset}
        />
      </main>

      <div className="max-w-360 mx-auto w-full">
        <Footer />
      </div>
    </div>
  );
}
