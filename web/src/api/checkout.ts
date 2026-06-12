import type { ApiResponse } from "../types/tree";
import { ApiError } from "../utils/ApiError";
import { API_BASE_URL } from "../utils/constant";
import type { OrderItem } from "./orders";

export interface CheckoutSessionResponse {
  url: string;
}


export async function createCheckoutSession(
  items: OrderItem[],
  accessToken: string,
): Promise<ApiResponse<CheckoutSessionResponse>> {
  const res = await fetch(`${API_BASE_URL}/checkout/session`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${accessToken}`,
    },
    body: JSON.stringify(items),
  });
  const json: ApiResponse<CheckoutSessionResponse> = await res
    .json()
    .catch(() => ({}));
  if (!res.ok)
    throw new ApiError(res.status, json.error ?? "Erreur lors du paiement");
  return json;
}

export type OrderStatus = "PENDING" | "PAID" | "CANCELLED";

export interface OrderSummaryItem {
  id: string;
  name: string;
  species: string;
  quantity: number;
  unitPrice: string;
}

export interface OrderSummary {
  id: string;
  status: OrderStatus;
  totalAmount: string;
  createdAt: string;
  items: OrderSummaryItem[];
}


export async function getOrderBySession(
  sessionId: string,
  accessToken: string,
): Promise<ApiResponse<OrderSummary>> {
  const res = await fetch(`${API_BASE_URL}/checkout/orders/${sessionId}`, {
    method: "GET",
    headers: { Authorization: `Bearer ${accessToken}` },
  });
  const json: ApiResponse<OrderSummary> = await res.json().catch(() => ({}));
  if (!res.ok)
    throw new ApiError(
      res.status,
      json.error ?? "Erreur lors de la récupération de la commande",
    );
  return json;
}
