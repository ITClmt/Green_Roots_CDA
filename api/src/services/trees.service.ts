import { db } from "@/db/client";
import { trees } from "@/db/schema";
import { eq } from "drizzle-orm";

export const treesService = {
  async findAll() {
    return db.select().from(trees);
  },

  async findById(id: string) {
    const [tree] = await db.select().from(trees).where(eq(trees.id, id));
    return tree ?? null;
  },
};
