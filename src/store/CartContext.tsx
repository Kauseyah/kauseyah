"use client";

import React, { createContext, useContext, useReducer } from "react";
import type { Cart, CartItem, Product, ProductVariant } from "@/types";
import { FREE_SHIPPING_THRESHOLD, STANDARD_SHIPPING_FEE } from "@/constants";

// ─── State & Actions ──────────────────────────────────────────────────────────

type CartAction =
  | { type: "ADD_ITEM"; product: Product; variant: ProductVariant }
  | { type: "REMOVE_ITEM"; variantId: string }
  | { type: "UPDATE_QTY"; variantId: string; quantity: number }
  | { type: "CLEAR_CART" };

function calcCart(items: CartItem[]): Cart {
  const subtotal = items.reduce(
    (sum, item) => sum + item.variant.price * item.quantity,
    0
  );
  const shipping = subtotal >= FREE_SHIPPING_THRESHOLD ? 0 : STANDARD_SHIPPING_FEE;
  return { items, subtotal, discount: 0, total: subtotal + shipping };
}

function cartReducer(state: Cart, action: CartAction): Cart {
  switch (action.type) {
    case "ADD_ITEM": {
      const existing = state.items.find(
        (i) => i.variant.id === action.variant.id
      );
      const items = existing
        ? state.items.map((i) =>
            i.variant.id === action.variant.id
              ? { ...i, quantity: i.quantity + 1 }
              : i
          )
        : [...state.items, { product: action.product, variant: action.variant, quantity: 1 }];
      return calcCart(items);
    }
    case "REMOVE_ITEM": {
      return calcCart(state.items.filter((i) => i.variant.id !== action.variantId));
    }
    case "UPDATE_QTY": {
      return calcCart(
        state.items.map((i) =>
          i.variant.id === action.variantId ? { ...i, quantity: action.quantity } : i
        )
      );
    }
    case "CLEAR_CART":
      return calcCart([]);
    default:
      return state;
  }
}

// ─── Context ──────────────────────────────────────────────────────────────────

interface CartContextValue {
  cart: Cart;
  addItem: (product: Product, variant: ProductVariant) => void;
  removeItem: (variantId: string) => void;
  updateQty: (variantId: string, quantity: number) => void;
  clearCart: () => void;
  itemCount: number;
}

const CartContext = createContext<CartContextValue | null>(null);

const INITIAL_CART: Cart = { items: [], subtotal: 0, discount: 0, total: 0 };

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [cart, dispatch] = useReducer(cartReducer, INITIAL_CART);

  const addItem = (product: Product, variant: ProductVariant) =>
    dispatch({ type: "ADD_ITEM", product, variant });

  const removeItem = (variantId: string) =>
    dispatch({ type: "REMOVE_ITEM", variantId });

  const updateQty = (variantId: string, quantity: number) =>
    dispatch({ type: "UPDATE_QTY", variantId, quantity });

  const clearCart = () => dispatch({ type: "CLEAR_CART" });

  const itemCount = cart.items.reduce((sum, i) => sum + i.quantity, 0);

  return (
    <CartContext.Provider value={{ cart, addItem, removeItem, updateQty, clearCart, itemCount }}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used inside <CartProvider>");
  return ctx;
}
