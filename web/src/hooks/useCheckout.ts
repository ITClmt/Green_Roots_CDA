import { useMutation } from "@tanstack/react-query";
import { useNavigate } from "react-router";
import { createOrder } from "../api/orders";
import { useAuth } from "../features/auth/AuthContext";
import { useCart } from "../features/cart/useCart";

export function useCheckout() {
  const { accessToken } = useAuth();
  const { items, clearCart } = useCart();
  const navigate = useNavigate();

  const mutation = useMutation({
    mutationFn: () => {
      if (!accessToken) throw new Error("Vous devez être connecté pour passer une commande.");
      return createOrder(
        items.map((i) => ({ tree_id: i.tree.id, quantity: i.quantity })),
        accessToken,
      );
    },
    onSuccess: () => {
      clearCart();
      void navigate("/profil");
    },
  });

  return mutation;
}
