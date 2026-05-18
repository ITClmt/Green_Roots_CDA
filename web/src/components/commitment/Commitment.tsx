import { Globe, Eye, TreePine } from 'lucide-react';
import { CommitmentCard } from './CommitmentCard';

const cards = [
  {
    icon: <Globe className="w-6 h-6" />,
    title: 'Impact Local',
    description: 'Nous travaillons directement avec les communautés locales pour assurer un impact socio-économique positif durable.',
    variant: 'light' as const,
  },
  {
    icon: <Eye className="w-6 h-6" />,
    title: 'Transparence Totale',
    description: 'Suivez chaque arbre planté avec des coordonnées GPS précises et des mises à jour photographiques annuelles.',
    variant: 'light' as const,
  },
  {
    icon: <TreePine className="w-6 h-6" />,
    title: 'Biodiversité',
    description: "Au-delà de la plantation, nous restaurons des écosystèmes complets pour protéger la faune et la flore locales.",
    variant: 'dark' as const,
  },
];

export function Commitment() {
  return (
    <section className="py-20 px-8 md:px-16 bg-[#f9faf7]">
      <div className="mb-12">
        <h2 className="text-3xl font-bold text-[#134d37] border-l-4 border-[#134d37] pl-4">
          Notre Engagement
        </h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {cards.map((card) => (
          <CommitmentCard
            key={card.title}
            icon={card.icon}
            title={card.title}
            description={card.description}
            variant={card.variant}
          />
        ))}
      </div>
    </section>
  );
}
