import { useMutation } from "@tanstack/react-query";
import { useNavigate } from "react-router";
import { createOrder } from "../api/orders";
import { useAuth } from "../features/auth/AuthContext";
import { useCart } from "../features/cart/CartContext";
import { withRefresh } from "../utils/withRefresh";
import type { CartItem } from "../types/cart";

export interface OrderConfirmationState {
  orderId: string;
  items: CartItem[];
  totalPrice: number;
}

export function useCheckout() {
  const { accessToken, refreshSession } = useAuth();
  const { items, totalPrice, clearCart } = useCart();
  const navigate = useNavigate();

  return useMutation({
    mutationFn: () => {
      if (!accessToken) throw new Error("Non authentifié");
      const orderItems = items.map((i) => ({ tree_id: i.tree.id, quantity: i.quantity }));
      return withRefresh((token) => createOrder(orderItems, token), accessToken, refreshSession);
    },
    onSuccess: async (result) => {
      const state: OrderConfirmationState = {
        orderId: result.data?.id ?? "",
        items,
        totalPrice,
      };
      clearCart();
      await navigate("/order-confirmation", { state });
    },
  });
}
