import { useState } from 'react';
import { MapPin, Leaf, Wind, ShoppingCart } from 'lucide-react';
import { useNavigate } from 'react-router';
import { AddToCartModal } from '../cart/AddToCartModal';
import type { Tree } from '../../types/tree';

export interface TreeItem {
  id: string;
  name: string;
  species: string;
  location: string;
  co2: number;
  oxygen: number;
  price: number;
  image: string;
  description?: string | null;
}

interface CatalogueCardProps {
  tree: TreeItem;
  originalTree?: Tree;
  onDetails?: (tree: TreeItem) => void;
}

export function CatalogueCard({ tree, originalTree, onDetails }: CatalogueCardProps) {
  const navigate = useNavigate();
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleDetails = () => {
    onDetails?.(tree);
    navigate(`/catalog/${tree.id}`);
  };

  return (
    <article
      id={`card-${tree.id}`}
      className="
        bg-white rounded-2xl overflow-hidden
        shadow-sm hover:shadow-md
        transition-all duration-300
        group cursor-pointer
        flex flex-col
      "
    >
      {/* Image */}
      <div className="relative h-48 sm:h-52 overflow-hidden shrink-0">
        <img
          src={tree.image}
          alt={tree.name}
          loading="lazy"
          decoding="async"
          onError={(e) => {
            (e.target as HTMLImageElement).src =
              "https://placehold.co/400x300/e8f5e9/134d37?text=" +
              encodeURIComponent(tree.species);
          }}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
        />

        {/* Price badge */}
        <div className="absolute top-3 right-3 bg-white/90 backdrop-blur-sm text-[#1a2f24] text-xs font-bold px-2.5 py-1 rounded-full shadow-sm">
          {tree.price.toFixed(2)}€
        </div>
      </div>

      {/* Body */}
      <div className="p-4 flex flex-col flex-1 gap-2">
        <div>
          <h3 className="text-base font-bold text-[#1a2f24] leading-tight">
            {tree.name}
          </h3>
          <p className="text-xs text-gray-500 mt-0.5 italic">
            {tree.species}
          </p>
        </div>

        {/* Location + CO2 + Oxygen row */}
        <div className="flex items-center justify-between text-xs text-gray-500 mt-1">
          {tree.location && (
            <span className="flex items-center gap-1">
              <MapPin aria-hidden="true" size={11} className="text-[#134d37]" />
              {tree.location}
            </span>
          )}
          <span className="flex items-center gap-2 ml-auto">
            {tree.co2 > 0 && (
              <span className="flex items-center gap-1">
                <Leaf aria-hidden="true" size={11} className="text-[#134d37]" />~{tree.co2}kg CO₂
              </span>
            )}
            {tree.oxygen > 0 && (
              <span className="flex items-center gap-1">
                <Wind aria-hidden="true" size={11} className="text-blue-400" />
                {tree.oxygen}kg O₂
              </span>
            )}
          </span>
        </div>

        {/* Description */}
        {tree.description && (
          <p className="text-xs text-content-secondary leading-snug line-clamp-2">
            {tree.description}
          </p>
        )}

        {/* CTA */}
        <div className="mt-auto flex flex-col gap-2">
          {originalTree && originalTree.stock > 0 && (
            <button
              onClick={(e) => { e.stopPropagation(); setIsModalOpen(true); }}
              aria-label={`Ajouter ${tree.name} au panier`}
              className="
                w-full py-2.5 flex items-center justify-center gap-1.5
                bg-primary hover:bg-primary-hover
                text-white text-sm font-medium
                rounded-xl transition-colors duration-200
                cursor-pointer
              "
            >
              <ShoppingCart aria-hidden="true" size={14} />
              Ajouter au panier
            </button>
          )}
          <button
            id={`details-btn-${tree.id}`}
            onClick={handleDetails}
            aria-label={`Voir les détails de ${tree.name}`}
            className="
              w-full py-2.5
              bg-[#f3f4f1] hover:bg-[#e9ebe5]
              text-[#1a2f24] text-sm font-medium
              rounded-xl transition-colors duration-200
              cursor-pointer
            "
          >
            Voir les détails
          </button>
        </div>
      </div>

      {originalTree && (
        <AddToCartModal
          tree={originalTree}
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
        />
      )}
    </article>
  );
}
