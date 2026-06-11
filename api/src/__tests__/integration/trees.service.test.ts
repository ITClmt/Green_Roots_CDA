// Tests du service trees — nécessitent une base de données de test.
//
// PREMIÈRE FOIS : créer la base et appliquer le schéma (une seule fois) :
//   docker compose exec postgres psql -U postgres -c "CREATE DATABASE greenroots_test;"
//   docker compose exec -e POSTGRES_DB=greenroots_test api bun db:push
//
// LANCER LES TESTS :
//   docker compose exec -e POSTGRES_DB=greenroots_test api bun test src/__tests__/integration

import { describe, it, expect, beforeEach } from "bun:test";
import { db } from "@/db/client";
import { trees } from "@/db/schema";
import { treesService } from "@/services/trees.service";

const treeData = {
  name: "Chêne pédonculé",
  species: "Quercus robur",
  price: 25.99,
};

beforeEach(async () => {
  if (process.env["POSTGRES_DB"] !== "greenroots_test") {
    throw new Error(`Refusing to run tests against database "${process.env["POSTGRES_DB"]}" — expected "greenroots_test"`);
  }
  await db.delete(trees);
});

describe("treesService.findAll", () => {
  it("returns an empty list when there are no trees", async () => {
    const result = await treesService.findAll({ page: 1, limit: 10, sortOrder: "asc" });

    expect(result.data).toHaveLength(0);
    expect(result.meta.total).toBe(0);
    expect(result.meta.totalPages).toBe(0);
  });

  it("returns correct pagination meta", async () => {
    await db.insert(trees).values([
      treeData,
      { name: "Pin sylvestre", species: "Pinus sylvestris", price: 19.99 },
    ]);

    const result = await treesService.findAll({ page: 1, limit: 1, sortOrder: "asc" });

    expect(result.data).toHaveLength(1);
    expect(result.meta.total).toBe(2);
    expect(result.meta.totalPages).toBe(2);
  });
});

describe("treesService.findById", () => {
  it("returns the tree when found", async () => {
    const inserted = (await db.insert(trees).values(treeData).returning())[0]!;

    const result = await treesService.findById(inserted.id);

    expect(result?.name).toBe(treeData.name);
    expect(result?.species).toBe(treeData.species);
  });

  it("returns null when not found", async () => {
    const result = await treesService.findById("00000000-0000-0000-0000-000000000000");

    expect(result).toBeNull();
  });
});

describe("treesService.create", () => {
  it("creates and returns the new tree", async () => {
    const result = await treesService.create(treeData);

    expect(result?.name).toBe(treeData.name);
    expect(result?.species).toBe(treeData.species);
    expect(result?.price).toBe(treeData.price);
  });
});

describe("treesService.update", () => {
  it("updates and returns the modified tree", async () => {
    const inserted = (await db.insert(trees).values(treeData).returning())[0]!;

    const result = await treesService.update(inserted.id, { name: "Chêne rouvre" });

    expect(result?.name).toBe("Chêne rouvre");
    expect(result?.species).toBe(treeData.species);
  });

  it("returns null when tree not found", async () => {
    const result = await treesService.update("00000000-0000-0000-0000-000000000000", { name: "X" });

    expect(result).toBeNull();
  });
});

describe("treesService.delete", () => {
  it("removes the tree from the database", async () => {
    const inserted = (await db.insert(trees).values(treeData).returning())[0]!;

    await treesService.delete(inserted.id);

    const result = await treesService.findById(inserted.id);
    expect(result).toBeNull();
  });
});
