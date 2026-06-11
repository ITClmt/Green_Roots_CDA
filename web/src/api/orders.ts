import type { OrderData } from "../types/profile";
import type { ApiResponse } from "../types/tree";
import { ApiError } from "../utils/ApiError";
import { API_BASE_URL } from "../utils/constant";
export interface OrderItem {
  tree_id: string;
  quantity: number;
}

export async function createOrder(
  items: OrderItem[],
  accessToken: string,
): Promise<ApiResponse<OrderData>> {
  const res = await fetch(`${API_BASE_URL}/orders/`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${accessToken}`,
    },
    body: JSON.stringify(items),
  });
  const json: ApiResponse<OrderData> = await res.json().catch(() => ({}));
  if (!res.ok)
    throw new ApiError(res.status, json.error ?? "Erreur lors de la commande");
  return json;
}

export async function getUserOrders(
  accessToken: string,
): Promise<ApiResponse<OrderData[]>> {
  const res = await fetch(`${API_BASE_URL}/orders/`, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });
  const json: ApiResponse<OrderData[]> = await res.json().catch(() => ({}));
  if (!res.ok)
    throw new ApiError(
      res.status,
      json.error ?? "Erreur lors de la récupération des commandes",
    );
  return json;
}
