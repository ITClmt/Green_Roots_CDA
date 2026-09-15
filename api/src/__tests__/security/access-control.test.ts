/**
 * Tests de securite : controle d'acces et robustesse des entrees.
 *
 * Cible : le controleur `trees`, dont les routes d'ecriture sont reservees au
 * role ADMIN. Le service est mocke : on teste ici les barrieres de securite
 * (authentification, autorisation, validation), pas la logique metier.
 */
import { describe, it, expect, mock } from "bun:test";
import Elysia from "elysia";
import { jwt } from "@elysiajs/jwt";
import { makeAdminToken, mockTree, createTreePayload } from "../helpers";

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

async function request(
  method: string,
  url: string,
  options: { authorization?: string; body?: unknown } = {},
) {
  const headers: Record<string, string> = {};
  if (options.authorization) headers["Authorization"] = options.authorization;
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

/** Signe un jeton avec un secret ou une duree de vie choisis, pour forger des cas d'attaque. */
async function signWith(
  secret: string,
  exp: string,
  payload: Record<string, string> = {
    id: "00000000-0000-0000-0000-000000000100",
    role: "ADMIN",
  },
) {
  const signer = new Elysia()
    .use(jwt({ name: "jwt", secret, exp }))
    .get("/sign", ({ jwt: j }) => j.sign(payload));
  const res = await signer.handle(new Request("http://localhost/sign"));
  return res.text();
}

describe("Securite : validation de la signature du jeton", () => {
  it("refuse un jeton signe avec un autre secret", async () => {
    const forged = await signWith(
      "un-secret-d-attaquant-de-plus-de-32-caracteres!",
      "15m",
    );

    const res = await request("POST", BASE, {
      authorization: `Bearer ${forged}`,
      body: createTreePayload,
    });

    expect(res.status).toBe(401);
    expect(mockTreesService.create).not.toHaveBeenCalled();
  });

  it("refuse un jeton expire", async () => {
    const expired = await signWith(process.env["JWT_SECRET"]!, "-1h");

    const res = await request("DELETE", `${BASE}/${mockTree.id}`, {
      authorization: `Bearer ${expired}`,
    });

    expect(res.status).toBe(401);
  });

  it("refuse un jeton altere (charge utile modifiee)", async () => {
    const valid = await makeAdminToken();
    const [header, , signature] = valid.split(".");
    const tamperedPayload = Buffer.from(
      JSON.stringify({
        id: "00000000-0000-0000-0000-000000000200",
        role: "ADMIN",
      }),
    ).toString("base64url");

    const res = await request("DELETE", `${BASE}/${mockTree.id}`, {
      authorization: `Bearer ${header}.${tamperedPayload}.${signature}`,
    });

    expect(res.status).toBe(401);
  });
});

describe("Securite : en-tete Authorization malforme", () => {
  it("refuse un schema d'authentification autre que Bearer", async () => {
    const token = await makeAdminToken();

    const res = await request("DELETE", `${BASE}/${mockTree.id}`, {
      authorization: `Basic ${token}`,
    });

    expect(res.status).toBe(401);
  });

  it("refuse un Bearer vide", async () => {
    const res = await request("DELETE", `${BASE}/${mockTree.id}`, {
      authorization: "Bearer ",
    });

    expect(res.status).toBe(401);
  });
});

describe("Securite : robustesse des entrees", () => {
  it("rejette une tentative d'injection SQL dans le parametre de tri", async () => {
    const payload = encodeURIComponent("price; DROP TABLE trees;--");

    const res = await request("GET", `${BASE}?sortBy=${payload}`);

    // Le tri s'appuie sur une liste blanche de colonnes : toute autre valeur
    // est rejetee par la validation avant d'atteindre la couche d'acces aux donnees.
    expect(res.status).toBe(422);
    expect(mockTreesService.findAll).not.toHaveBeenCalled();
  });

  it("rejette une tentative d'injection SQL dans l'identifiant de ressource", async () => {
    const payload = encodeURIComponent("1 OR 1=1");

    const res = await request("GET", `${BASE}/${payload}`);

    // Le parametre est contraint au format UUID.
    expect(res.status).toBe(422);
  });

  it("ignore les champs non declares dans le schema de creation", async () => {
    const token = await makeAdminToken();
    mockTreesService.create.mockClear();

    const res = await request("POST", BASE, {
      authorization: `Bearer ${token}`,
      body: {
        ...createTreePayload,
        id: "00000000-0000-0000-0000-0000000000ff",
        createdAt: "1970-01-01T00:00:00.000Z",
        isAdmin: true,
      },
    });

    expect(res.status).toBe(201);
    const calls = mockTreesService.create.mock.calls as unknown as Array<
      [Record<string, unknown>]
    >;
    const received = calls[0]?.[0];
    expect(received).toBeDefined();
    expect(received).not.toHaveProperty("id");
    expect(received).not.toHaveProperty("createdAt");
    expect(received).not.toHaveProperty("isAdmin");
  });
});
