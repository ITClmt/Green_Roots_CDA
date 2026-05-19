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
          isGreen ? 'bg-[#cce8d4]' : 'bg-[#f5dfc8]'
        }`}
      >
        <Icon size={26} className={isGreen ? 'text-[#0f5238]' : 'text-[#bc6c25]'} />
      </div>
      <p className="text-sm font-semibold text-[#1a1c19] leading-snug">{badge.name}</p>
      <p className="text-xs text-[#404943]">{badge.description}</p>
    </div>
  );
}
