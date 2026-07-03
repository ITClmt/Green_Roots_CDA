import { useQuery } from "@tanstack/react-query";
import { getUserBadges } from "../../api/badges";
import { BadgeCard } from "./BadgeCard";

export function BadgeSection({ accessToken }: { accessToken: string }) {
  const { data: badgesResponse } = useQuery({
    queryKey: ["userBadges", accessToken],
    queryFn: () => getUserBadges(accessToken!),
    enabled: !!accessToken,
  });

  const badges = (badgesResponse?.data ?? []).filter((b) => b.unlocked);

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
