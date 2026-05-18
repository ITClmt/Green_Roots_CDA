export const CATALOGUE_TAGS = [
  { id: 'all', label: 'Toutes les régions' },
  { id: 'amazonia', label: 'Amazonia' },
  { id: 'sahel', label: 'Sahel' },
  { id: 'andes', label: 'Andes' },
  { id: 'madagascar', label: 'Madagascar' },
];

interface CatalogueTagFilterProps {
  activeTag: string;
  onTagChange: (tagId: string) => void;
}

export function CatalogueTagFilter({ activeTag, onTagChange }: CatalogueTagFilterProps) {
  return (
    <div
      id="catalogue-tag-filter"
      className="flex flex-wrap gap-2"
      role="group"
      aria-label="Filtrer par région"
    >
      {CATALOGUE_TAGS.map((tag) => {
        const isActive = activeTag === tag.id;
        return (
          <button
            key={tag.id}
            id={`tag-${tag.id}`}
            onClick={() => onTagChange(tag.id)}
            className={`
              px-4 py-2 rounded-full text-sm font-medium
              border transition-all duration-200 cursor-pointer
              ${
                isActive
                  ? 'bg-[#134d37] text-white border-[#134d37] shadow-sm'
                  : 'bg-white text-[#1a2f24]/70 border-gray-200 hover:border-[#134d37]/40 hover:text-[#134d37]'
              }
            `}
          >
            {tag.label}
          </button>
        );
      })}
    </div>
  );
}
