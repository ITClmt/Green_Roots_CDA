import type { Tree, ApiResponse } from "../types/tree";

const API_BASE = "http://localhost:3000/api/v1";

export async function fetchTrees(): Promise<Tree[]> {
  const response = await fetch(`${API_BASE_URL}/trees`);

  if (!response.ok) {
    throw new Error(`Failed to fetch trees: ${response.statusText}`);
  }

  const json: ApiResponse<Tree[]> = await response.json();

  if (!json.success || !json.data) {
    throw new Error(json.error ?? "Unknown error");
  }

  return json.data;
}
