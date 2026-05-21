import { db } from "@/db/client";
import { orders, orderItems, trees } from "@/db/schema";
import type { CheckoutDto } from "@/models/order";
import { NotFoundError, ConflictError, INTERNAL_ERROR } from "@/utils/errors";
import { eq, sql, inArray } from "drizzle-orm";

export const orderService = {
  async checkout(userId: string, items: CheckoutDto): Promise<{ orderId: string }> {
    return await db.transaction(async (tx) => {

      const treeIds = items.map(item => item.tree_id);
      const fetchedTrees = await tx.select().from(trees).where(inArray(trees.id, treeIds));
      const treeMap = new Map(fetchedTrees.map(tree => [tree.id, tree]));

      let totalAmount = 0;
      for (const item of items) {
        const tree = treeMap.get(item.tree_id);
        if (!tree) throw new NotFoundError(`Tree ${item.tree_id}`);
        if (tree.stock < item.quantity) {
          throw new ConflictError(`Stock insuffisant pour l'arbre "${tree.name}"`);
        }
        totalAmount += parseFloat(tree.price) * item.quantity;
      }

      const [order] = await tx
        .insert(orders)
        .values({ userId, totalAmount: totalAmount.toFixed(2), status: "PAID" })
        .returning({ id: orders.id });
      if (!order) throw new INTERNAL_ERROR("Échec de la création de la commande");

      await tx.insert(orderItems).values(
        items.map(item => ({
          orderId: order.id,
          treeId: item.tree_id,
          quantity: item.quantity,
          unitPrice: treeMap.get(item.tree_id)!.price,
        }))
      );

      for (const item of items) {
        await tx
          .update(trees)
          .set({ stock: sql`${trees.stock} - ${item.quantity}` })
          .where(eq(trees.id, item.tree_id));
      }

      return { orderId: order.id };
    });
  },
};