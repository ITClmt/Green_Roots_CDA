import { db } from "@/db/client";
import { trees } from "@/db/schema";

export const treesService = {
  async findAll() {
    return db.select().from(trees);
  },
};
