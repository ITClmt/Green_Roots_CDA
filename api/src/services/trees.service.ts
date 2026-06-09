import { db } from "@/db/client";
import { trees } from "@/db/schema";
import { asc, count, desc, eq } from "drizzle-orm";
import type {
  CreateTreeDto,
  FindAllTreesDto,
  UpdateTreeDto,
} from "@/models/tree";

export const treesService = {
  async findAll({ page, limit, sortBy, sortOrder }: FindAllTreesDto) {
    const offset = (page - 1) * limit;
    const orderColumn = sortBy ? trees[sortBy] : trees.createdAt;
    const order = sortOrder === "desc" ? desc(orderColumn) : asc(orderColumn);

    const [[countResult], data] = await Promise.all([
      db.select({ total: count() }).from(trees),
      db.select().from(trees).orderBy(order).limit(limit).offset(offset),
    ]);

    const total = countResult?.total ?? 0;

    return {
      data,
      meta: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    };
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
