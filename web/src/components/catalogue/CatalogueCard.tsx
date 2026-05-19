import { MapPin, Leaf } from 'lucide-react';

export interface TreeItem {
  id: string;
  name: string;
  commonName: string;
  region: string;
  country: string;
  co2PerYear: number;
  price: number;
  image: string;
  description?: string | null;
  tag?: string; // e.g. 'amazonia' | 'sahel' | 'andes' | 'madagascar'
  isBigImpact?: boolean;
}

interface CatalogueCardProps {
  tree: TreeItem;
  onDetails?: (tree: TreeItem) => void;
}

export function CatalogueCard({ tree, onDetails }: CatalogueCardProps) {
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
      <div className="relative h-48 sm:h-52 overflow-hidden flex-shrink-0">
        <img
          src={tree.image}
          alt={tree.name}
          onError={(e) => {
            (e.target as HTMLImageElement).src =
              'https://placehold.co/400x300/e8f5e9/134d37?text=' + encodeURIComponent(tree.commonName);
          }}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
        />

        {/* Price badge */}
        <div className="absolute top-3 right-3 bg-white/90 backdrop-blur-sm text-[#1a2f24] text-xs font-bold px-2.5 py-1 rounded-full shadow-sm">
          {tree.price.toFixed(2)}€
        </div>

        {/* Big Impact badge */}
        {tree.isBigImpact && (
          <div className="absolute top-3 left-3 bg-[#134d37] text-white text-[10px] font-bold px-2.5 py-1 rounded-full uppercase tracking-wide shadow-sm">
            Gros impact
          </div>
        )}
      </div>

      {/* Body */}
      <div className="p-4 flex flex-col flex-1 gap-2">
        <div>
          <h3 className="text-base font-bold text-[#1a2f24] leading-tight">{tree.name}</h3>
          <p className="text-xs text-gray-400 mt-0.5 italic">{tree.commonName}</p>
        </div>

        {/* Region + CO2 row */}
        <div className="flex items-center justify-between text-xs text-gray-500 mt-1">
          {tree.country && (
            <span className="flex items-center gap-1">
              <MapPin size={11} className="text-[#134d37]" />
              {tree.country}
            </span>
          )}
          {tree.co2PerYear > 0 && (
            <span className="flex items-center gap-1 ml-auto">
              <Leaf size={11} className="text-[#134d37]" />
              ~{tree.co2PerYear}kg/an
            </span>
          )}
        </div>

        {/* Description */}
        {tree.description && (
          <p className="text-xs text-gray-400 leading-snug line-clamp-2">
            {tree.description}
          </p>
        )}

        {/* CTA */}
        <button
          id={`details-btn-${tree.id}`}
          onClick={() => onDetails?.(tree)}
          className="
            mt-auto w-full py-2.5
            bg-[#f3f4f1] hover:bg-[#e9ebe5]
            text-[#1a2f24] text-sm font-medium
            rounded-xl transition-colors duration-200
            cursor-pointer
          "
        >
          Voir les détails
        </button>
      </div>
    </article>
  );
}
