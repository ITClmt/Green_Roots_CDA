import Elysia from "elysia";
import { jwt } from "@elysiajs/jwt";
import type { JWTPayloadInput } from "@elysiajs/jwt";
import type { CreateTreeDto } from "@/models/tree";

type SignPayload = JWTPayloadInput & Record<string, string | number | boolean | null | undefined>;

export async function signToken(payload: SignPayload): Promise<string> {
  const signer = new Elysia()
    .use(jwt({ name: "jwt", secret: process.env["JWT_SECRET"]!, exp: "15m" }))
    .get("/sign", ({ jwt: j }) => j.sign(payload));
  const res = await signer.handle(new Request("http://localhost/sign"));
  return res.text();
}

export const makeAdminToken = () =>
  signToken({ id: "00000000-0000-0000-0000-000000000100", role: "ADMIN" });

export const makeUserToken = () =>
  signToken({ id: "00000000-0000-0000-0000-000000000200", role: "USER" });

export const mockTree = {
  id: "00000000-0000-0000-0000-000000000001",
  name: "Chêne pédonculé",
  species: "Quercus robur",
  description: "Grand chêne européen",
  location: "France",
  co2: 20,
  oxygen: 15,
  price: 25.99,
  imageUrl: null as string | null,
  stock: 10,
  createdAt: "2024-01-01T00:00:00.000Z",
  updatedAt: "2024-01-01T00:00:00.000Z",
};

export const createTreePayload: CreateTreeDto = {
  name: "Chêne pédonculé",
  species: "Quercus robur",
  price: 25.99,
};
