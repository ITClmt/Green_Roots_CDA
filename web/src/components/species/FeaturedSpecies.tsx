import { ArrowRight } from 'lucide-react';
import { Link } from 'react-router';
import { SpeciesCard } from './SpeciesCard';
import { useTrees } from '../../hooks/useTrees';

export function FeaturedSpecies() {
  const { data: trees, isLoading } = useTrees(1, 4);

  const featured = trees?.data ?? [];

  return (
    <section className="py-20 bg-[#f9faf7]">
      {/* Header */}
      <div className="flex justify-between items-end mb-8 px-5 sm:px-8 md:px-16">
        <h2 className="text-3xl font-bold text-[#1a2f24]">Espèces Phares</h2>
        <Link to="/catalog" className="flex items-center text-[#134d37] font-medium hover:underline text-sm">
          Tout voir <ArrowRight aria-hidden="true" className="w-4 h-4 ml-1" />
        </Link>
      </div>

      {isLoading ? (
        <div className="flex justify-center py-12 text-gray-400 text-sm">
          Chargement...
        </div>
      ) : (
        <>
          {/* Mobile & Tablet: horizontal scroll carousel */}
          <div
            role="region"
            aria-label="Espèces phares"
            tabIndex={0}
            onKeyDown={(e) => {
              if (e.key === 'ArrowRight') (e.currentTarget as HTMLElement).scrollBy({ left: 300, behavior: 'smooth' });
              if (e.key === 'ArrowLeft') (e.currentTarget as HTMLElement).scrollBy({ left: -300, behavior: 'smooth' });
            }}
            className="lg:hidden flex gap-4 overflow-x-auto scroll-smooth snap-x snap-mandatory px-5 sm:px-8 pb-4 focus:outline-none focus:ring-2 focus:ring-[#134d37]/60"
            style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
          >
            {featured.map((tree) => (
              <div key={tree.id} className="snap-start shrink-0 w-[72vw] sm:w-[44vw]">
                <SpeciesCard
                  id={tree.id}
                  country={tree.location ?? ''}
                  name={tree.name}
                  desc={tree.description ?? ''}
                  image={tree.imageUrl ?? ''}
                />
              </div>
            ))}
          </div>

          {/* Desktop: 4-column grid */}
          <div className="hidden lg:grid grid-cols-4 gap-6 px-16">
            {featured.map((tree) => (
              <SpeciesCard
                key={tree.id}
                id={tree.id}
                country={tree.location ?? ''}
                name={tree.name}
                desc={tree.description ?? ''}
                image={tree.imageUrl ?? ''}
              />
            ))}
          </div>
        </>
      )}
    </section>
  );
}
