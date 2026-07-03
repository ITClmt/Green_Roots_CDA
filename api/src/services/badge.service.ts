import { db } from "@/db/client";
import { badges, orderItems, orders, trees, userBadges } from "@/db/schema";
import { and, countDistinct, eq, sql } from "drizzle-orm";

export async function checkAndUnlockBadges(userId: string): Promise<void> {
  const [stats] = await db
    .select({
      trees_planted: sql<number>`coalesce(sum(${orderItems.quantity}), 0)`,
      co2_total: sql<number>`coalesce(sum(${orderItems.quantity} * ${trees.co2}), 0)`,
      species_count: countDistinct(trees.species),
    })
    .from(orderItems)
    .innerJoin(orders, eq(orders.id, orderItems.orderId))
    .innerJoin(trees, eq(trees.id, orderItems.treeId))
    .where(and(eq(orders.userId, userId), eq(orders.status, "PAID")));

  const allBadges = await db.select().from(badges);

  const toUnlock = allBadges.filter(
    (badge) => Number(stats?.[badge.requirementType]) >= badge.requirementValue,
  );

  if (toUnlock.length === 0) return;

  await db
    .insert(userBadges)
    .values(toUnlock.map((b) => ({ userId, badgeId: b.id })))
    .onConflictDoNothing();
}

export async function getUserBadges(userId: string) {
  const allBadges = await db
    .select()
    .from(badges)
    .orderBy(badges.requirementValue);

  const unlocked = await db
    .select({
      badgeId: userBadges.badgeId,
      unlockedAt: userBadges.unlockedAt,
    })
    .from(userBadges)
    .where(eq(userBadges.userId, userId));

  const unlockedMap = new Map(unlocked.map((r) => [r.badgeId, r.unlockedAt]));

  return allBadges.map((badge) => ({
    ...badge,
    unlocked: unlockedMap.has(badge.id),
    unlockedAt: unlockedMap.get(badge.id) ?? null,
  }));
}
