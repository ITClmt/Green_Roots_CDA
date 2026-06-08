import { API_BASE_URL } from "../utils/constant";

export interface OrderItem {
  tree_id: string;
  quantity: number;
}

interface OrderResponse {
  data: { orderId: string };
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

export async function createOrder(
  items: OrderItem[],
  accessToken: string,
): Promise<OrderResponse> {
  const res = await fetch(`${API_BASE_URL}/orders`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${accessToken}`,
    },
    body: JSON.stringify(items),
  });
  const json = await res.json();
  if (!res.ok) throw new Error(parseError(json));
  return json;
}
