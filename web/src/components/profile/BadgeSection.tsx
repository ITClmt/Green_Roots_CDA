import type { BadgeData } from "../../types/profile";
import { BadgeCard } from "./BadgeCard";

interface BadgeSectionProps {
  badges: BadgeData[];
}

export function BadgeSection({ badges }: BadgeSectionProps) {
  return (
    <section>
      <h2 className="text-xl font-bold text-content-primary mb-4">Badges</h2>
      <div className="grid grid-cols-2 gap-4">
        {badges.map((badge) => (
          <BadgeCard key={badge.id} badge={badge} />
        ))}
      </div>
    </section>
  );
}
