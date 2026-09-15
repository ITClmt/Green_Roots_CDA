import type { User } from "../../types/profile";
import { API_BASE_URL } from "../../utils/constant";

/**
 * Le refresh token n'apparaît plus dans les réponses : il est déposé par
 * l'API dans un cookie httpOnly, inaccessible au JavaScript de la page.
 * Le front et l'API partageant la même origine, le navigateur joint ce
 * cookie automatiquement aux appels de cette section.
 */
interface AuthResponse {
  data: { user: User; accessToken: string };
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
    credentials: "same-origin",
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
    credentials: "same-origin",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password, firstName, lastName }),
  });
  const json = await res.json();
  if (!res.ok) throw new Error(parseError(json));
  return json;
}

export async function refresh(): Promise<AuthResponse> {
  const res = await fetch(`${API_BASE_URL}/auth/refresh`, {
    method: "POST",
    credentials: "same-origin",
  });
  const json = await res.json();
  if (!res.ok) throw new Error(parseError(json));
  return json;
}

export async function logout(accessToken: string): Promise<void> {
  await fetch(`${API_BASE_URL}/auth/logout`, {
    method: "POST",
    credentials: "same-origin",
    headers: { Authorization: `Bearer ${accessToken}` },
  });
}
