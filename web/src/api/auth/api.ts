import type { User } from "../../types/profile";
import { API_BASE_URL } from "../../utils/constant";

interface AuthResponse {
  data: { user: User; accessToken: string; refreshToken: string };
}

function parseError(json: Record<string, unknown>): string {
  const raw = json.error;
  if (typeof raw === "string") {
    try {
      const parsed = JSON.parse(raw);
      return parsed.message ?? raw;
    } catch {
      return raw;
    }
  }
  if (typeof json.message === "string") return json.message;
  return "Une erreur est survenue.";
}

export async function login(
  email: string,
  password: string,
): Promise<AuthResponse> {
  const res = await fetch(`${API_BASE_URL}/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
  });
  const json = await res.json();
  if (!res.ok) throw new Error(parseError(json));
  return json;
}

export async function register(
  email: string,
  password: string,
  firstName: string,
  lastName: string,
): Promise<AuthResponse> {
  const res = await fetch(`${API_BASE_URL}/auth/register`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password, firstName, lastName }),
  });
  const json = await res.json();
  if (!res.ok) throw new Error(parseError(json));
  return json;
}

export async function refresh(refreshToken: string): Promise<AuthResponse> {
  const res = await fetch(`${API_BASE_URL}/auth/refresh`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ refreshToken }),
  });
  const json = await res.json();
  if (!res.ok) throw new Error(parseError(json));
  return json;
}

export async function logout(
  accessToken: string,
  refreshToken: string,
): Promise<void> {
  await fetch(`${API_BASE_URL}/auth/logout`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${accessToken}`,
    },
    body: JSON.stringify({ refreshToken }),
  });
}
