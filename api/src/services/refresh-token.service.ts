import { eq, getTableColumns, lt } from "drizzle-orm";
import { db } from "@/db/client";
import { refreshTokens, users } from "@/db/schema";
import { UnauthorizedError, NotFoundError } from "@/utils/errors";
import type { UserResponse } from "@/types/user";

const REFRESH_TOKEN_TTL_MS = 7 * 24 * 60 * 60 * 1000; // 7 days

function generateToken(): string {
  return Buffer.from(crypto.getRandomValues(new Uint8Array(32))).toString("hex");
}

function hashToken(token: string): string {
  const hasher = new Bun.CryptoHasher("sha256");
  hasher.update(token);
  return hasher.digest("hex");
}

export const refreshTokenService = {
  async create(userId: string): Promise<string> {
    const token = generateToken();
    const tokenHash = hashToken(token);
    const expiresAt = new Date(Date.now() + REFRESH_TOKEN_TTL_MS);

    await db.insert(refreshTokens).values({ userId, tokenHash, expiresAt });
    return token;
  },

  async rotate(rawToken: string): Promise<{ user: UserResponse; token: string }> {
    const tokenHash = hashToken(rawToken);
    const { password: _, ...publicColumns } = getTableColumns(users);

    const [stored] = await db
      .select()
      .from(refreshTokens)
      .where(eq(refreshTokens.tokenHash, tokenHash))
      .limit(1);

    if (!stored || stored.expiresAt < new Date()) {
      throw new UnauthorizedError("Invalid or expired refresh token");
    }

    if (stored.rotatedAt !== null) {
      await db.delete(refreshTokens).where(eq(refreshTokens.userId, stored.userId));
      throw new UnauthorizedError("Invalid or expired refresh token");
    }

    const [user] = await db
      .select(publicColumns)
      .from(users)
      .where(eq(users.id, stored.userId))
      .limit(1);

    if (!user) throw new NotFoundError("User");

    await db
      .update(refreshTokens)
      .set({ rotatedAt: new Date() })
      .where(eq(refreshTokens.id, stored.id));

    const newToken = await refreshTokenService.create(stored.userId);
    return { user, token: newToken };
  },

  async revoke(rawToken: string): Promise<void> {
    const tokenHash = hashToken(rawToken);
    await db.delete(refreshTokens).where(eq(refreshTokens.tokenHash, tokenHash));
  },

  async deleteExpired(): Promise<void> {
    await db.delete(refreshTokens).where(lt(refreshTokens.expiresAt, new Date()));
  },
};
