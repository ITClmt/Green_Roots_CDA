import { db } from "@/db/client";
import { trees } from "@/db/schema";
import { eq } from "drizzle-orm";
import type { CreateTreeDto, UpdateTreeDto } from "@/models/tree";

export const treesService = {
  async findAll() {
    return db.select().from(trees);
  },

  async findById(id: string) {
    const [tree] = await db.select().from(trees).where(eq(trees.id, id));
    return tree ?? null;
  },

  async create(data: CreateTreeDto) {
    const [tree] = await db.insert(trees).values(data).returning();
    return tree;
  },

  async update(id: string, data: UpdateTreeDto) {
    const [tree] = await db
      .update(trees)
      .set(data)
      .where(eq(trees.id, id))
      .returning();
    return tree ?? null;
  },

  async delete(id: string) {
    await db.delete(trees).where(eq(trees.id, id));
  },
};
