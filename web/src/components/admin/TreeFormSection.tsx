import { useRef } from "react";
import { useForm, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { ImagePlus } from "lucide-react";
import type { Tree } from "../../types/tree";
import { Field } from "../Field";
import {
  treeFormSchema,
  type TreeFormInput,
  type TreeFormOutput,
} from "../../lib/schemas/treeFormSchema";

const emptyValues: TreeFormInput = {
  name: "",
  species: "",
  description: "",
  location: "",
  price: 0,
  imageUrl: "",
  stock: 0,
  co2: 0,
  oxygen: 0,
};

interface Props {
  editingTree: Tree | null;
  onCancel: () => void;
}

export function TreeFormSection({ editingTree, onCancel }: Props) {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const {
    register,
    handleSubmit,
    setValue,
    reset,
    control,
    formState: { errors },
  } = useForm<TreeFormInput, unknown, TreeFormOutput>({
    resolver: zodResolver(treeFormSchema),
    defaultValues: editingTree
      ? {
          ...editingTree,
          description: editingTree.description ?? "",
          location: editingTree.location ?? "",
          imageUrl: editingTree.imageUrl ?? "",
        }
      : emptyValues,
  });

  const imageUrl = useWatch({ control, name: "imageUrl" });

  function handleImageChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => setValue("imageUrl", ev.target?.result as string);
    reader.readAsDataURL(file);
  }

  const inputClass =
    "w-full px-4 py-3 bg-[#E7E9E4] border border-transparent rounded-xl text-sm text-[#1a1c19] placeholder:text-[#9ea89e] focus:outline-none focus:border-[#0f5238] transition-colors";

  return (
    <section className="bg-surface-primary rounded-card p-6 shadow-sm border border-gray-200 ">
      <h2 className="text-base font-semibold text-content-primary mb-5">
        {editingTree ? "Modifier un arbre" : "Ajouter un arbre"}
      </h2>

      <form
        onSubmit={handleSubmit((data: TreeFormOutput) =>
          console.log(editingTree ? "update" : "create", data),
        )}
        className="space-y-4"
      >
        {/* Image */}
        <div>
          <label className="block text-xs font-medium text-content-secondary mb-2">
            Image
          </label>
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className="w-full h-48 border-2 border-dashed border-border-secondary rounded-xl flex flex-col items-center justify-center gap-2 bg-surface-tertiary hover:border-accent transition-colors cursor-pointer overflow-hidden"
          >
            {imageUrl ? (
              <img
                src={imageUrl}
                alt="Aperçu"
                className="h-full w-auto object-contain"
              />
            ) : (
              <>
                <ImagePlus size={24} className="text-content-secondary" />
                <span className="text-xs text-content-secondary">
                  Appuyer pour ajouter une image
                </span>
              </>
            )}
          </button>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={handleImageChange}
          />
        </div>

        {/* Name */}
        <Field label="Nom" error={errors.name}>
          <input
            {...register("name")}
            type="text"
            placeholder="Ex. Chêne pédonculé"
            className={inputClass}
          />
        </Field>

        {/* Species */}
        <Field label="Espèce" error={errors.species}>
          <input
            {...register("species")}
            type="text"
            placeholder="Ex. Quercus robur"
            className={inputClass}
          />
        </Field>

        {/* Description */}
        <Field label="Description">
          <textarea
            {...register("description")}
            placeholder="Caractéristiques de l'arbre..."
            rows={3}
            className={`${inputClass} resize-none`}
          />
        </Field>

        {/* Price and location */}
        <div className="grid grid-cols-2 gap-4">
          <Field label="Prix (€)" error={errors.price}>
            <input
              {...register("price")}
              type="number"
              placeholder="0.00"
              min="0"
              step="0.01"
              className={inputClass}
            />
          </Field>
          <Field label="Région">
            <input
              {...register("location")}
              type="text"
              placeholder="Ex. Europe"
              className={inputClass}
            />
          </Field>
        </div>

        {/* Stock, CO₂ et O₂ */}
        <div className="grid grid-cols-3 gap-4">
          <Field label="Stock">
            <input
              {...register("stock")}
              type="number"
              placeholder="0"
              min="0"
              step="1"
              className={inputClass}
            />
          </Field>
          <Field label="CO₂/an (kg)">
            <input
              {...register("co2")}
              type="number"
              placeholder="0"
              min="0"
              step="1"
              className={inputClass}
            />
          </Field>
          <Field label="O₂/an (kg)">
            <input
              {...register("oxygen")}
              type="number"
              placeholder="0"
              min="0"
              step="1"
              className={inputClass}
            />
          </Field>
        </div>

        <div className="flex gap-3 pt-2">
          <button
            type="button"
            onClick={() => {
              reset(emptyValues);
              onCancel();
            }}
            className="flex-1 py-3 rounded-btn border border-border-secondary text-sm font-medium text-content-secondary hover:bg-surface-tertiary transition-colors cursor-pointer"
          >
            Annuler
          </button>
          <button
            type="submit"
            className="flex-1 py-3 rounded-btn bg-primary text-white text-sm font-medium hover:bg-primary-hover active:bg-primary-active transition-colors cursor-pointer"
          >
            {editingTree ? "Mettre à jour" : "Sauvegarder"}
          </button>
        </div>
      </form>
    </section>
  );
}
