import { TreePine, Leaf } from 'lucide-react';
import type { BadgeData } from '../../types/profile';

interface BadgeCardProps {
  badge: BadgeData;
}

export function BadgeCard({ badge }: BadgeCardProps) {
  const isGreen = badge.variant === 'green';
  const Icon = isGreen ? TreePine : Leaf;

  return (
    <div className="flex flex-col items-center gap-2 bg-white rounded-2xl p-4 text-center">
      <div
        className={`w-14 h-14 rounded-full flex items-center justify-center ${
          // Ces teintes claires (vert / brun) n'ont pas de token dans le design system
          isGreen ? 'bg-[#cce8d4]' : 'bg-[#f5dfc8]'
        }`}
      >
        <Icon size={26} className={isGreen ? 'text-primary' : 'text-tertiary'} />
      </div>
      <p className="text-sm font-semibold text-content-primary leading-snug">{badge.name}</p>
      <p className="text-xs text-content-secondary">{badge.description}</p>
    </div>
  );
}
