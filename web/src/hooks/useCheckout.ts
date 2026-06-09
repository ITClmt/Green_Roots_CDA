import { useMutation } from "@tanstack/react-query";
import { useNavigate } from "react-router";
import { createOrder } from "../api/orders";
import { useAuth } from "../features/auth/AuthContext";
import { useCart } from "../features/cart/useCart";
import type { CartItem } from "../types/cart";

export interface OrderConfirmationState {
  orderId: string;
  items: CartItem[];
  totalPrice: number;
}

export function useCheckout() {
  const { refreshSession } = useAuth();
  const { items, totalPrice, clearCart } = useCart();
  const navigate = useNavigate();

  const mutation = useMutation({
    mutationFn: async () => {
      const freshToken = await refreshSession();
      return createOrder(
        items.map((i) => ({ tree_id: i.tree.id, quantity: i.quantity })),
        freshToken,
      );
    },
    onSuccess: (result) => {
      const state: OrderConfirmationState = {
        orderId: result.data.orderId,
        items,
        totalPrice,
      };
      clearCart();
      void navigate("/order-confirmation", { state });
    },
  });

  return mutation;
}
