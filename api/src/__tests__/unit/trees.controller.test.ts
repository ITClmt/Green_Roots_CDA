import { describe, it, expect, mock, beforeEach } from "bun:test";
import Elysia from "elysia";
import {
  makeAdminToken,
  makeUserToken,
  mockTree,
  createTreePayload,
} from "../helpers";

const mockTreesService = {
  findAll: mock(async () => ({
    data: [mockTree],
    meta: { total: 1, page: 1, limit: 10, totalPages: 1 },
  })),
  findById: mock(async () => mockTree),
  create: mock(async () => mockTree),
  update: mock(async () => mockTree),
  delete: mock(async () => undefined),
};

mock.module("@/services/trees.service", () => ({
  treesService: mockTreesService,
}));

const { treesController } = await import("@/controllers/trees.controller");
const { errorMiddleware } = await import("@/middlewares/error.middleware");

const app = new Elysia().use(errorMiddleware).use(treesController);

const BASE = "http://localhost/api/v1/trees";

beforeEach(() => {
  Object.values(mockTreesService).forEach((fn) => fn.mockClear());
});

async function request(
  method: string,
  url: string,
  options: { token?: string; body?: unknown } = {},
) {
  const headers: Record<string, string> = {};
  if (options.token) headers["Authorization"] = `Bearer ${options.token}`;
  if (options.body !== undefined) headers["Content-Type"] = "application/json";
  return app.handle(
    new Request(url, {
      method,
      headers,
      body:
        options.body !== undefined ? JSON.stringify(options.body) : undefined,
    }),
  );
}

describe("GET /api/v1/trees", () => {
  it("returns 200 with a list of trees", async () => {
    const res = await request("GET", BASE);

    expect(res.status).toBe(200);
    const body = (await res.json()) as Record<string, unknown>;
    expect(body.success).toBe(true);
    expect(body.data).toMatchObject({ data: [{ id: mockTree.id }] });
    expect(mockTreesService.findAll).toHaveBeenCalledTimes(1);
  });

  it("returns 422 for invalid query params", async () => {
    const res = await request("GET", `${BASE}?limit=999`);
    expect(res.status).toBe(422);
  });
});

describe("GET /api/v1/trees/:id", () => {
  const treeUrl = `${BASE}/${mockTree.id}`;

  it("returns 200 with the tree", async () => {
    const res = await request("GET", treeUrl);

    expect(res.status).toBe(200);
    const body = (await res.json()) as Record<string, unknown>;
    expect(body.success).toBe(true);
    expect(body.data).toMatchObject({ id: mockTree.id, name: mockTree.name });
    expect(mockTreesService.findById).toHaveBeenCalledWith(mockTree.id);
  });

  it("returns 422 for an invalid UUID param", async () => {
    const res = await request("GET", `${BASE}/not-a-uuid`);
    expect(res.status).toBe(422);
  });
});

describe("POST /api/v1/trees", () => {
  it("returns 401 without auth token", async () => {
    const res = await request("POST", BASE, { body: createTreePayload });
    expect(res.status).toBe(401);
  });

  it("returns 403 for non-admin user", async () => {
    const token = await makeUserToken();
    const res = await request("POST", BASE, { token, body: createTreePayload });
    expect(res.status).toBe(403);
  });

  it("returns 201 with the created tree for admin", async () => {
    const token = await makeAdminToken();
    const res = await request("POST", BASE, { token, body: createTreePayload });

    expect(res.status).toBe(201);
    const body = (await res.json()) as Record<string, unknown>;
    expect(body.success).toBe(true);
    expect(body.data).toMatchObject({ id: mockTree.id, name: mockTree.name });
    expect(mockTreesService.create).toHaveBeenCalledTimes(1);
  });

  it("returns 422 when price is missing", async () => {
    const token = await makeAdminToken();
    const res = await request("POST", BASE, {
      token,
      body: { name: "Sans prix", species: "sp." },
    });
    expect(res.status).toBe(422);
  });
});

describe("PATCH /api/v1/trees/:id", () => {
  const treeUrl = `${BASE}/${mockTree.id}`;

  it("returns 401 without auth token", async () => {
    const res = await request("PATCH", treeUrl, { body: { name: "Updated" } });
    expect(res.status).toBe(401);
  });

  it("returns 403 for non-admin user", async () => {
    const token = await makeUserToken();
    const res = await request("PATCH", treeUrl, {
      token,
      body: { name: "Updated" },
    });
    expect(res.status).toBe(403);
  });

  it("returns 200 with the updated tree for admin", async () => {
    const token = await makeAdminToken();
    const res = await request("PATCH", treeUrl, {
      token,
      body: { name: "Updated" },
    });

    expect(res.status).toBe(200);
    const body = (await res.json()) as Record<string, unknown>;
    expect(body.success).toBe(true);
    expect(body.data).toMatchObject({ id: mockTree.id });
    expect(mockTreesService.update).toHaveBeenCalledTimes(1);
  });

  it("returns 404 when the tree does not exist", async () => {
    mockTreesService.update.mockResolvedValueOnce(
      null as unknown as typeof mockTree,
    );
    const token = await makeAdminToken();
    const res = await request("PATCH", treeUrl, {
      token,
      body: { name: "Updated" },
    });

    expect(res.status).toBe(404);
  });

  it("returns 422 for an invalid UUID param", async () => {
    const token = await makeAdminToken();
    const res = await request("PATCH", `${BASE}/not-a-uuid`, {
      token,
      body: { name: "Updated" },
    });
    expect(res.status).toBe(422);
  });
});

describe("DELETE /api/v1/trees/:id", () => {
  const treeUrl = `${BASE}/${mockTree.id}`;

  it("returns 401 without auth token", async () => {
    const res = await request("DELETE", treeUrl);
    expect(res.status).toBe(401);
  });

  it("returns 403 for non-admin user", async () => {
    const token = await makeUserToken();
    const res = await request("DELETE", treeUrl, { token });
    expect(res.status).toBe(403);
  });

  it("returns 204 for admin", async () => {
    const token = await makeAdminToken();
    const res = await request("DELETE", treeUrl, { token });

    expect(res.status).toBe(204);
    expect(mockTreesService.delete).toHaveBeenCalledWith(mockTree.id);
  });
});
