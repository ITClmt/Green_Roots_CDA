import type { BadgeData } from "../types/profile";
import type { ApiResponse } from "../types/tree";
import { ApiError } from "../utils/ApiError";
import { API_BASE_URL } from "../utils/constant";

export async function getUserBadges(
  accessToken: string,
): Promise<ApiResponse<BadgeData[]>> {
  const res = await fetch(`${API_BASE_URL}/badges`, {
    headers: { Authorization: `Bearer ${accessToken}` },
  });
  const json: ApiResponse<BadgeData[]> = await res.json().catch(() => ({}));
  if (!res.ok)
    throw new ApiError(
      res.status,
      json.error ?? "Erreur lors de la récupération des badges",
    );
  return json;
}
