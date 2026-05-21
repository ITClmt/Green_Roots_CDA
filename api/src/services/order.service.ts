import { db } from "@/db/client";
import { orders, orderItems, trees } from "@/db/schema";
import type { CheckoutDto } from "@/models/order";
import { AppError, NotFoundError,ConflictError } from "@/utils/errors";
import { eq, sql } from "drizzle-orm";

export const orderService = {
  async checkout(userId: string, items: CheckoutDto): Promise<{ orderId: string }> {
    return await db.transaction(async (tx) => {

        let totalAmount = 0;

        for (const item of items) {
          const [tree] = await tx
            .select()
            .from(trees)
            .where(eq(trees.id, item.tree_id))
            .limit(1);
          if (!tree) throw new NotFoundError(`Tree ${item.tree_id}`);
          if (tree.stock < item.quantity) {
            throw new ConflictError(`désolé ma couillasse le stock est insuffisant pour l'arbre "${tree.name}"`);
          }
          totalAmount += parseFloat(tree.price) * item.quantity;
        }

        const [order] = await tx
          .insert(orders)
          .values({
            userId,
            totalAmount: totalAmount.toFixed(2),
            status: "PAID",
          })
          .returning({ id: orders.id });
        if (!order) throw new AppError(500, "INTERNAL_ERROR", "Échec de la création de la commande");

        for (const item of items) {
          const [tree] = await tx
            .select({ price: trees.price })
            .from(trees)
            .where(eq(trees.id, item.tree_id))
            .limit(1);
          await tx.insert(orderItems).values({
            orderId: order.id,
            treeId: item.tree_id,
            quantity: item.quantity,
            unitPrice: tree!.price,
          });
          await tx
            .update(trees)
            .set({ stock: sql`${trees.stock} - ${item.quantity}` })
            .where(eq(trees.id, item.tree_id));
        }
        return { orderId: order.id };
      });
    },
};