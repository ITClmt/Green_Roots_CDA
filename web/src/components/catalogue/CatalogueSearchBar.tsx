import { Search } from 'lucide-react';

interface CatalogueSearchBarProps {
  value: string;
  onChange: (value: string) => void;
}

export function CatalogueSearchBar({ value, onChange }: CatalogueSearchBarProps) {
  return (
    <div className="relative w-full">
      <label htmlFor="catalogue-search" className="sr-only">
        Rechercher un arbre
      </label>
      <Search
        aria-hidden="true"
        className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none"
        size={18}
      />
      <input
        id="catalogue-search"
        type="search"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="Rechercher un arbre…"
        className="
          w-full pl-11 pr-5 py-3.5
          bg-white border border-gray-200
          rounded-2xl text-sm text-[#1a2f24]
          placeholder:text-gray-400
          shadow-sm
          focus:outline-none focus:ring-2 focus:ring-[#134d37]/60 focus:border-[#134d37]
          transition-all duration-200
        "
      />
    </div>
  );
}
