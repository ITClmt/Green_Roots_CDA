import { orders, orderItems } from "@/db/schema";

export type Order = typeof orders.$inferSelect;
export type OrderItem = typeof orderItems.$inferSelect;