import { db } from "@/db/client";
import { orderItems, orders, trees } from "@/db/schema";
import type { CheckoutDto } from "@/models/order";
import { ConflictError, InternalError, NotFoundError } from "@/utils/errors";
import { and, desc, eq, inArray, sql } from "drizzle-orm";

type Tree = typeof trees.$inferSelect;

export interface OrderLineItem {
  name: string;
  unitAmountCents: number;
  quantity: number;
}

function validateAndComputeTotal(
  items: CheckoutDto,
  treeMap: Map<string, Tree>,
): number {
  const totalCents = items.reduce((total, item) => {
    const tree = treeMap.get(item.tree_id);
    if (!tree) throw new NotFoundError(`Tree ${item.tree_id}`);
    if (tree.stock < item.quantity)
      throw new ConflictError(`Stock insuffisant pour "${tree.name}"`);
    return total + Math.round(tree.price * 100) * item.quantity;
  }, 0);
  return totalCents / 100;
}

export const orderService = {
  async createPendingOrder(
    userId: string,
    items: CheckoutDto,
  ): Promise<{ orderId: string; lineItems: OrderLineItem[] }> {
    return db.transaction(async (tx) => {
      const treeIds = items.map((item) => item.tree_id);

      const fetchedTrees = await tx
        .select()
        .from(trees)
        .where(inArray(trees.id, treeIds));
      const treeMap = new Map(fetchedTrees.map((tree) => [tree.id, tree]));
      const totalAmount = validateAndComputeTotal(items, treeMap);

      const [order] = await tx
        .insert(orders)
        .values({ userId, totalAmount: totalAmount.toFixed(2), status: "PENDING" })
        .returning({ id: orders.id });

      if (!order)
        throw new InternalError("Échec de la création de la commande");

      await tx.insert(orderItems).values(
        items.map((item) => ({
          orderId: order.id,
          treeId: item.tree_id,
          quantity: item.quantity,
          unitPrice: treeMap.get(item.tree_id)!.price.toFixed(2),
        })),
      );

      const lineItems: OrderLineItem[] = items.map((item) => {
        const tree = treeMap.get(item.tree_id)!;
        return {
          name: tree.name,
          unitAmountCents: Math.round(tree.price * 100),
          quantity: item.quantity,
        };
      });

      return { orderId: order.id, lineItems };
    });
  },

  async attachSession(orderId: string, sessionId: string): Promise<void> {
    await db
      .update(orders)
      .set({ stripeSessionId: sessionId })
      .where(eq(orders.id, orderId));
  },



  async markOrderPaid(orderId: string): Promise<void> {
    await db.transaction(async (tx) => {
      const [updated] = await tx
        .update(orders)
        .set({ status: "PAID" })
        .where(and(eq(orders.id, orderId), eq(orders.status, "PENDING")))
        .returning({ id: orders.id });


      if (!updated) return;

      const lines = await tx
        .select({ treeId: orderItems.treeId, quantity: orderItems.quantity })
        .from(orderItems)
        .where(eq(orderItems.orderId, orderId));

      if (lines.length === 0) return;

      const stockUpdate = sql`CASE ${sql.join(
        lines.map(
          (line) => sql`WHEN id = ${line.treeId} THEN GREATEST(stock - ${line.quantity}, 0)`,
        ),
        sql` `,
      )} ELSE stock END`;

      await tx
        .update(trees)
        .set({ stock: stockUpdate })
        .where(
          inArray(
            trees.id,
            lines.map((line) => line.treeId),
          ),
        );
    });
  },


  
  async cancelPendingOrder(orderId: string): Promise<void> {
    await db
      .update(orders)
      .set({ status: "CANCELLED" })
      .where(and(eq(orders.id, orderId), eq(orders.status, "PENDING")));
  },

  
  async getOrderSummaryBySession(userId: string, sessionId: string) {
    const [order] = await db
      .select({
        id: orders.id,
        status: orders.status,
        totalAmount: orders.totalAmount,
        createdAt: orders.createdAt,
      })
      .from(orders)
      .where(and(eq(orders.stripeSessionId, sessionId), eq(orders.userId, userId)));

    if (!order) throw new NotFoundError("Commande");

    const items = await db
      .select({
        id: orderItems.id,
        name: trees.name,
        species: trees.species,
        quantity: orderItems.quantity,
        unitPrice: orderItems.unitPrice,
      })
      .from(orderItems)
      .innerJoin(trees, eq(trees.id, orderItems.treeId))
      .where(eq(orderItems.orderId, order.id));

    return { ...order, items };
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
      .where(and(eq(orders.userId, userId), eq(orders.status, "PAID")))
      .orderBy(desc(orders.createdAt));

    return items;
  },
};
