import { API_BASE_URL } from "../utils/constant";
import { ApiError } from "../utils/ApiError";
import type { ApiResponse } from "../types/tree";

export interface OrderItem {
  tree_id: string;
  quantity: number;
}

interface OrderData {
  orderId: string;
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
  if (!res.ok) throw new ApiError(res.status, json.error ?? "Erreur lors de la commande");
  return json;
}
