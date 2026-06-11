import { useNavigate } from 'react-router';

interface SpeciesCardProps {
  id: string;
  country: string;
  name: string;
  desc: string;
  image: string;
}

export function SpeciesCard({ id, country, name, desc, image }: SpeciesCardProps) {
  const navigate = useNavigate();

  return (
    <div className="bg-white rounded-3xl overflow-hidden cursor-pointer shadow-sm hover:shadow-md transition-shadow group">
      <div className="h-48 overflow-hidden">
        <img
          src={image}
          alt={name}
          onError={(e) => {
            (e.target as HTMLImageElement).src =
              'https://placehold.co/600x400/e8f5e9/134d37?text=' + encodeURIComponent(name);
          }}
          className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
        />
      </div>
      <div className="p-6">
        <p className="text-xs font-bold text-gray-400 mb-1 uppercase tracking-wider">{country}</p>
        <h3 className="text-xl font-bold text-[#1a2f24] mb-2">{name}</h3>
        <p className="text-sm text-gray-500 mb-6 line-clamp-2">{desc}</p>
        <button
          onClick={() => navigate(`/catalog/${id}`)}
          aria-label={`Voir les détails de ${name}`}
          className="w-full py-3 bg-[#f3f4f1] hover:bg-[#e9ebe5] cursor-pointer text-[#1a2f24] font-medium rounded-xl transition-colors"
        >
          Voir les détails
        </button>
      </div>
    </div>
  );
}
