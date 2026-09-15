/**
 * Tests de securite de l'authentification.
 *
 * Verifie trois proprietes attendues du referentiel :
 *  - aucune escalade de privilege possible depuis le formulaire d'inscription ;
 *  - aucune fuite du mot de passe (ni en clair, ni sous forme de hash) ;
 *  - aucune enumeration de comptes via les messages d'erreur de connexion.
 *
 * Les acces a la base sont mockes : seuls les mecanismes de securite sont testes.
 */
import { describe, it, expect, mock } from "bun:test";
import Elysia from "elysia";
import { ARGON2_OPTIONS } from "@/config/constants";

const KNOWN_PASSWORD = "MotDePasseSolide!2026";
const KNOWN_HASH = await Bun.password.hash(KNOWN_PASSWORD, ARGON2_OPTIONS);

const existingUser = {
  id: "00000000-0000-0000-0000-000000000300",
  email: "clement@example.com",
  password: KNOWN_HASH,
  role: "USER" as const,
  firstName: "Clement",
  lastName: "Andreani",
  createdAt: new Date("2026-01-01T00:00:00.000Z"),
  updatedAt: new Date("2026-01-01T00:00:00.000Z"),
};

// `usersService.create` ne renvoie jamais la colonne `password` : le mock
// reproduit fidelement ce contrat (cf. `publicColumns()` dans le service reel).
const { password: _hash, ...existingUserPublic } = existingUser;

const mockUsersService = {
  create: mock(async (data: Record<string, unknown>) => {
    const { password: _password, ...rest } = data;
    return { ...existingUserPublic, ...rest };
  }),
  findByEmail: mock(async (email: string) =>
    email === existingUser.email ? existingUser : null,
  ),
};

const mockRefreshTokenService = {
  create: mock(async () => "refresh-token-de-test"),
  rotate: mock(async () => ({ user: existingUser, token: "nouveau-token" })),
  revoke: mock(async () => undefined),
  deleteExpired: mock(async () => undefined),
};

mock.module("@/services/users.service", () => ({
  usersService: mockUsersService,
}));
mock.module("@/services/refresh-token.service", () => ({
  refreshTokenService: mockRefreshTokenService,
}));

const { authController } = await import("@/controllers/auth.controller");
const { errorMiddleware } = await import("@/middlewares/error.middleware");

const app = new Elysia().use(errorMiddleware).use(authController);

const BASE = "http://localhost/api/v1/auth";

async function post(path: string, body: unknown) {
  return app.handle(
    new Request(`${BASE}${path}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    }),
  );
}

describe("Securite : inscription", () => {
  it("ignore un role envoye par le client (pas d'escalade de privilege)", async () => {
    mockUsersService.create.mockClear();

    const res = await post("/register", {
      email: "attaquant@example.com",
      password: KNOWN_PASSWORD,
      firstName: "Attaquant",
      lastName: "Test",
      role: "ADMIN",
    });

    expect(res.status).toBe(201);

    const received = mockUsersService.create.mock.calls[0]?.[0] as
      | Record<string, unknown>
      | undefined;
    expect(received).toBeDefined();
    // Le schema Zod ne declare pas `role` : le champ est retire avant la couche metier.
    expect(received).not.toHaveProperty("role");
  });

  it("ne renvoie jamais le mot de passe, meme hache", async () => {
    const res = await post("/register", {
      email: "nouveau@example.com",
      password: KNOWN_PASSWORD,
      firstName: "Nouveau",
      lastName: "Compte",
    });

    const raw = await res.text();
    expect(raw).not.toContain(KNOWN_PASSWORD);
    expect(raw).not.toContain("$argon2");
    expect(JSON.parse(raw).data.user).not.toHaveProperty("password");
  });

  it("hache le mot de passe avant de le transmettre a la couche d'acces aux donnees", async () => {
    mockUsersService.create.mockClear();

    await post("/register", {
      email: "hash@example.com",
      password: KNOWN_PASSWORD,
      firstName: "Hash",
      lastName: "Test",
    });

    const received = mockUsersService.create.mock.calls[0]?.[0] as {
      password: string;
    };
    expect(received.password).not.toBe(KNOWN_PASSWORD);
    expect(received.password.startsWith("$argon2id$")).toBe(true);
  });

  it("refuse un mot de passe trop court", async () => {
    const res = await post("/register", {
      email: "faible@example.com",
      password: "1234",
      firstName: "Mot",
      lastName: "Faible",
    });

    expect(res.status).toBe(422);
  });

  it("refuse une adresse email invalide", async () => {
    const res = await post("/register", {
      email: "pas-une-adresse",
      password: KNOWN_PASSWORD,
      firstName: "Email",
      lastName: "Invalide",
    });

    expect(res.status).toBe(422);
  });
});

describe("Securite : connexion", () => {
  it("renvoie le meme message pour un email inconnu et un mot de passe faux", async () => {
    const emailInconnu = await post("/login", {
      email: "inconnu@example.com",
      password: KNOWN_PASSWORD,
    });
    const mauvaisMotDePasse = await post("/login", {
      email: existingUser.email,
      password: "MauvaisMotDePasse!2026",
    });

    expect(emailInconnu.status).toBe(401);
    expect(mauvaisMotDePasse.status).toBe(401);

    // Message identique dans les deux cas : impossible d'enumerer les comptes existants.
    const a = (await emailInconnu.json()) as { error: string };
    const b = (await mauvaisMotDePasse.json()) as { error: string };
    expect(a.error).toBe(b.error);
  });

  it("accepte les identifiants valides et ne divulgue pas le mot de passe", async () => {
    const res = await post("/login", {
      email: existingUser.email,
      password: KNOWN_PASSWORD,
    });

    expect(res.status).toBe(200);
    const raw = await res.text();
    expect(raw).not.toContain("$argon2");
    const body = JSON.parse(raw) as {
      data: { user: Record<string, unknown>; accessToken: string };
    };
    expect(body.data.user).not.toHaveProperty("password");
    expect(typeof body.data.accessToken).toBe("string");
  });
});

describe("Sécurité : transport du refresh token", () => {
  it("dépose le refresh token dans un cookie httpOnly et non dans la réponse", async () => {
    const res = await post("/register", {
      email: "cookie@example.com",
      password: KNOWN_PASSWORD,
      firstName: "Cookie",
      lastName: "Test",
    });

    expect(res.status).toBe(201);

    const setCookie = res.headers.get("set-cookie") ?? "";
    expect(setCookie).toContain("refresh_token=");
    expect(setCookie.toLowerCase()).toContain("httponly");
    expect(setCookie.toLowerCase()).toContain("samesite=strict");
    // Le cookie n'est envoyé qu'aux routes d'authentification.
    expect(setCookie).toContain("Path=/api/v1/auth");

    // Le jeton ne doit apparaître nulle part dans le corps de la réponse.
    const raw = await res.text();
    expect(raw).not.toContain("refresh-token-de-test");
    expect(JSON.parse(raw).data).not.toHaveProperty("refreshToken");
  });

  it("refuse un rafraîchissement sans cookie", async () => {
    const res = await app.handle(
      new Request(`${BASE}/refresh`, { method: "POST" }),
    );

    expect(res.status).toBe(401);
  });

  it("fait tourner le cookie lors d'un rafraîchissement valide", async () => {
    const res = await app.handle(
      new Request(`${BASE}/refresh`, {
        method: "POST",
        headers: { Cookie: "refresh_token=jeton-precedent" },
      }),
    );

    expect(res.status).toBe(200);
    const setCookie = res.headers.get("set-cookie") ?? "";
    expect(setCookie).toContain("refresh_token=");
    expect(setCookie.toLowerCase()).toContain("httponly");
  });
});
