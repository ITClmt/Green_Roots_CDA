import { createContext, useCallback, useReducer, type ReactNode } from "react";
import type { CartItem } from "../../types/cart";
import type { Tree } from "../../types/tree";

type CartAction =
  | { type: "ADD"; tree: Tree; quantity: number }
  | { type: "REMOVE"; treeId: string }
  | { type: "INCREMENT"; treeId: string }
  | { type: "DECREMENT"; treeId: string }
  | { type: "CLEAR" };

type CartState = { items: CartItem[] };

export type CartContextValue = CartState & {
  totalItems: number;
  totalPrice: number;
  addToCart: (tree: Tree, quantity: number) => void;
  removeFromCart: (treeId: string) => void;
  increment: (treeId: string) => void;
  decrement: (treeId: string) => void;
  clearCart: () => void;
};
const STORAGE_KEY = "green-roots-cart";

function loadFromStorage(): CartState {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? (JSON.parse(raw) as CartState) : { items: [] };
  } catch {
    return { items: [] };
  }
}

function cartReducer(state: CartState, action: CartAction): CartState {
  switch (action.type) {
    case "ADD": {
      const existing = state.items.find((i) => i.tree.id === action.tree.id);
      if (existing) {
        return {
          items: state.items.map((i) =>
            i.tree.id === action.tree.id
              ? { ...i, quantity: i.quantity + action.quantity }
              : i
          ),
        };
      }
      return {
        items: [...state.items, { tree: action.tree, quantity: action.quantity }],
      };
    }
    case "REMOVE":
      return { items: state.items.filter((i) => i.tree.id !== action.treeId) };
    case "INCREMENT":
      return {
        items: state.items.map((i) =>
          i.tree.id === action.treeId ? { ...i, quantity: i.quantity + 1 } : i
        ),
      };
    case "DECREMENT":
      return {
        items: state.items
          .map((i) =>
            i.tree.id === action.treeId ? { ...i, quantity: i.quantity - 1 } : i
          )
          .filter((i) => i.quantity > 0),
      };
    case "CLEAR":
      return { items: [] };
    default:
      return state;
  }
}

export const CartContext = createContext<CartContextValue | null>(null);

export function CartProvider({ children }: { children: ReactNode }) {
  const persistedReducer = useCallback(
    (state: CartState, action: CartAction): CartState => {
      const next = cartReducer(state, action);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
      return next;
    },
    []
  );

  const [state, dispatch] = useReducer(persistedReducer, undefined, loadFromStorage);

  const totalItems = state.items.reduce((sum, i) => sum + i.quantity, 0);
  const totalPrice = state.items.reduce(
    (sum, i) => sum + parseFloat(i.tree.price) * i.quantity,
    0
  );

  const value: CartContextValue = {
    ...state,
    totalItems,
    totalPrice,
    addToCart: (tree, quantity) => dispatch({ type: "ADD", tree, quantity }),
    removeFromCart: (treeId) => dispatch({ type: "REMOVE", treeId }),
    increment: (treeId) => dispatch({ type: "INCREMENT", treeId }),
    decrement: (treeId) => dispatch({ type: "DECREMENT", treeId }),
    clearCart: () => dispatch({ type: "CLEAR" }),
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}