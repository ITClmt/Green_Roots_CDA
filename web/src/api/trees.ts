import type { Tree, ApiResponse, PaginatedTrees, TreePayload } from "../types/tree";
import { API_BASE_URL } from "../utils/constant";

export async function fetchTrees(page = 1, limit = 10): Promise<PaginatedTrees> {
  const res = await fetch(`${API_BASE_URL}/trees?page=${page}&limit=${limit}`);
  const json: ApiResponse<PaginatedTrees> = await res.json();
  if (!res.ok || !json.success || !json.data)
    throw new Error(json.error ?? "Erreur");
  return json.data;
}

export async function createTree(
  payload: TreePayload,
  token: string,
): Promise<Tree> {
  const res = await fetch(`${API_BASE_URL}/trees`, {
    method: "POST",
    headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
    body: JSON.stringify(payload),
  });
  const json: ApiResponse<Tree> = await res.json();
  if (!res.ok || !json.success || !json.data)
    throw new Error(json.error ?? "Erreur lors de la création");
  return json.data;
}

export async function updateTree(
  id: string,
  payload: Partial<TreePayload>,
  token: string,
): Promise<Tree> {
  const res = await fetch(`${API_BASE_URL}/trees/${id}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
    body: JSON.stringify(payload),
  });
  const json: ApiResponse<Tree> = await res.json();
  if (!res.ok || !json.success || !json.data)
    throw new Error(json.error ?? "Erreur lors de la modification");
  return json.data;
}

export async function deleteTree(id: string, token: string): Promise<void> {
  const res = await fetch(`${API_BASE_URL}/trees/${id}`, {
    method: "DELETE",
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!res.ok) {
    const json: ApiResponse<never> = await res
      .json()
      .catch(() => ({}) as ApiResponse<never>);
    throw new Error(json.error ?? "Erreur lors de la suppression");
  }
}
