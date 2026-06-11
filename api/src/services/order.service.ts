import { db } from "@/db/client";
import { orders, orderItems, trees } from "@/db/schema";
import type { CheckoutDto } from "@/models/order";
import { NotFoundError, ConflictError, InternalError } from "@/utils/errors";
import { sql, inArray, eq, desc } from "drizzle-orm";

type Tree = typeof trees.$inferSelect;

function validateAndComputeTotal(items: CheckoutDto, treeMap: Map<string, Tree>): number {
  const totalCents = items.reduce((total, item) => {
    const tree = treeMap.get(item.tree_id);
    if (!tree) throw new NotFoundError(`Tree ${item.tree_id}`);
    if (tree.stock < item.quantity) throw new ConflictError(`Stock insuffisant pour "${tree.name}"`);
    return total + Math.round(parseFloat(tree.price) * 100) * item.quantity;
  }, 0);
  return totalCents / 100;
}

function buildBatchStockUpdate(items: CheckoutDto) {
  return sql`CASE ${sql.join(
    items.map(item => sql`WHEN id = ${item.tree_id} THEN stock - ${item.quantity}`),
    sql` `
  )} ELSE stock END`;
}

export const orderService = {
  async checkout(userId: string, items: CheckoutDto): Promise<{ orderId: string }> {
    return db.transaction(async (tx) => {
      const treeIds = items.map(item => item.tree_id);

      const fetchedTrees = await tx.select().from(trees).where(inArray(trees.id, treeIds));
      const treeMap = new Map(fetchedTrees.map(tree => [tree.id, tree]));
      const totalAmount = validateAndComputeTotal(items, treeMap);

      const [order] = await tx
        .insert(orders)
        .values({ userId, totalAmount: totalAmount.toFixed(2), status: "PAID" })
        .returning({ id: orders.id });

      if (!order) throw new InternalError("Échec de la création de la commande");

      await tx.insert(orderItems).values(
        items.map(item => ({
          orderId: order.id,
          treeId: item.tree_id,
          quantity: item.quantity,
          unitPrice: treeMap.get(item.tree_id)!.price,
        }))
      );

      await tx
        .update(trees)
        .set({ stock: buildBatchStockUpdate(items) })
        .where(inArray(trees.id, treeIds));

      return { orderId: order.id };
    });
  },

  async findUserOrderItems(userId: string) {
    const items = await db
      .select({
        id: orderItems.id,
        name: trees.name,
        quantity: orderItems.quantity,
        createdAt: orders.createdAt,
        location: trees.location,
        species: trees.species,
      })
      .from(orderItems)
      .innerJoin(orders, eq(orders.id, orderItems.orderId))
      .innerJoin(trees, eq(trees.id, orderItems.treeId))
      .where(eq(orders.userId, userId))
      .orderBy(desc(orders.createdAt));

    return items;
  },
};
