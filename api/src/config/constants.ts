import { env } from "./env";

export const IS_PROD = env.NODE_ENV === "production";
export const IS_DEV = env.NODE_ENV === "development";
export const IS_TEST = env.NODE_ENV === "test";

export const API_PREFIX = "/api";
export const API_VERSION = "v1";
export const API_BASE = `${API_PREFIX}/${API_VERSION}`;

export const ARGON2_OPTIONS = {
  algorithm: "argon2id",
  memoryCost: 19456,
  timeCost: 2,
} as const;
