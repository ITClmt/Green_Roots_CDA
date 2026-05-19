import { ArrowRight } from 'lucide-react';
import { Link } from 'react-router';
import { SpeciesCard } from './SpeciesCard';

const species = [
  {
    id: 1,
    country: "FRANCE",
    name: "Chêne Blanc",
    desc: "Un symbole de force et de longévité.",
    image: "https://images.unsplash.com/photo-1448375240586-882707db888b?auto=format&fit=crop&w=600&q=80"
  },
  {
    id: 2,
    country: "SÉNÉGAL",
    name: "Baobab",
    desc: "L'arbre de vie. Soutient des écosystèmes entiers et fournit des...",
    image: "https://images.unsplash.com/photo-1502082553048-f009c37129b9?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80"
  },
  {
    id: 3,
    country: "SÉNÉGAL",
    name: "Baobab",
    desc: "L'arbre de vie. Soutient des écosystèmes entiers et fournit des...",
    image: "https://images.unsplash.com/photo-1502082553048-f009c37129b9?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80"
  },
  {
    id: 4,
    country: "SÉNÉGAL",
    name: "Baobab",
    desc: "L'arbre de vie. Soutient des écosystèmes entiers et fournit des...",
    image: "https://images.unsplash.com/photo-1502082553048-f009c37129b9?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80"
  }
];

export function FeaturedSpecies() {
  return (
    <section className="py-20 bg-[#f9faf7]">
      {/* Header */}
      <div className="flex justify-between items-end mb-8 px-5 sm:px-8 md:px-16">
        <h2 className="text-3xl font-bold text-[#1a2f24]">Espèces Phares</h2>
        <Link to="/species" className="flex items-center text-[#134d37] font-medium hover:underline text-sm">
          Tout voir <ArrowRight className="w-4 h-4 ml-1" />
        </Link>
      </div>

      {/* Mobile & Tablet: horizontal scroll carousel */}
      <div className="lg:hidden flex gap-4 overflow-x-auto scroll-smooth snap-x snap-mandatory px-5 sm:px-8 pb-4 scrollbar-hide"
        style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
      >
        {species.map((item) => (
          <div key={item.id} className="snap-start shrink-0 w-[72vw] sm:w-[44vw]">
            <SpeciesCard
              country={item.country}
              name={item.name}
              desc={item.desc}
              image={item.image}
            />
          </div>
        ))}
      </div>

      {/* Desktop: 4-column grid */}
      <div className="hidden lg:grid grid-cols-4 gap-6 px-16">
        {species.map((item) => (
          <SpeciesCard
            key={item.id}
            country={item.country}
            name={item.name}
            desc={item.desc}
            image={item.image}
          />
        ))}
      </div>
    </section>
  );
}
