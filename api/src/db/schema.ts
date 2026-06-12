import {
  decimal,
  integer,
  numeric,
  pgEnum,
  pgTable,
  text,
  timestamp,
  uuid,
} from "drizzle-orm/pg-core";
import { timestamps } from "./helpers";

export const roleEnum = pgEnum("role", ["USER", "ADMIN"]);

export const users = pgTable("users", {
  id: uuid("id").primaryKey().defaultRandom(),
  email: text("email").notNull().unique(),
  password: text("password").notNull(),
  role: roleEnum("role").notNull().default("USER"),
  firstName: text("first_name").notNull(),
  lastName: text("last_name").notNull(),
  ...timestamps,
});

export const refreshTokens = pgTable("refresh_tokens", {
  id: uuid("id").primaryKey().defaultRandom(),
  userId: uuid("user_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  tokenHash: text("token_hash").notNull().unique(),
  expiresAt: timestamp("expires_at", {
    mode: "date",
    withTimezone: true,
  }).notNull(),
  rotatedAt: timestamp("rotated_at", { mode: "date", withTimezone: true }),
  createdAt: timestamp("created_at", { mode: "date", withTimezone: true })
    .notNull()
    .defaultNow(),
});

export const trees = pgTable("trees", {
  id: uuid("id").primaryKey().defaultRandom(),
  name: text("name").notNull(),
  species: text("species").notNull(),
  description: text("description"),
  location: text("location"),
  co2: integer("co2").notNull().default(0),
  oxygen: integer("oxygen").notNull().default(0),
  price: numeric("price", {
    precision: 10,
    scale: 2,
    mode: "number",
  }).notNull(),
  imageUrl: text("image_url"),
  stock: integer("stock").notNull().default(0),
  ...timestamps,
});

export const status = pgEnum("status", ["PENDING", "PAID", "CANCELLED"]);

export const orders = pgTable("orders", {
  id: uuid("id").primaryKey().defaultRandom(),
  userId: uuid("user_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  totalAmount: decimal("total_amount").notNull(),
  status: status("status").notNull().default("PENDING"),
  stripeSessionId: text("stripe_session_id").unique(),
  ...timestamps,
});

export const orderItems = pgTable("order_items", {
  id: uuid("id").primaryKey().defaultRandom(),
  orderId: uuid("order_id")
    .notNull()
    .references(() => orders.id, { onDelete: "cascade" }),
  treeId: uuid("tree_id")
    .notNull()
    .references(() => trees.id, { onDelete: "cascade" }),
  quantity: integer("quantity").notNull(),
  unitPrice: decimal("unit_price").notNull(),
  ...timestamps,
});
