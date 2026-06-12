import { useMutation } from "@tanstack/react-query";
import { createCheckoutSession } from "../api/checkout";
import { useAuth } from "../features/auth/AuthContext";
import { useCart } from "../features/cart/CartContext";
import { withRefresh } from "../utils/withRefresh";


export function useCheckout() {
  const { accessToken, refreshSession } = useAuth();
  const { items } = useCart();

  return useMutation({
    mutationFn: async () => {
      if (!accessToken) throw new Error("Non authentifié");
      const orderItems = items.map((i) => ({
        tree_id: i.tree.id,
        quantity: i.quantity,
      }));
      const res = await withRefresh(
        (token) => createCheckoutSession(orderItems, token),
        accessToken,
        refreshSession,
      );
      const url = res.data?.url;
      if (!url) throw new Error("URL de paiement indisponible");
      return url;
    },
    onSuccess: (url) => {
      window.location.href = url;
    },
  });
}
