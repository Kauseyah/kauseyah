"use client";

import React, { createContext, useContext, useReducer, useEffect, useState } from "react";
import type { Cart, CartItem, Product, ProductVariant, GiftDetails } from "@/types";
import {
  FREE_SHIPPING_THRESHOLD,
  STANDARD_SHIPPING_FEE,
  calculateShipping,
  calculateGiftCharge,
  DEFAULT_GIFT_CHARGE
} from "@/constants";

// ─── Stable Cart Line Identifier ──────────────────────────────────────────────

export function getCartLineId(variantId: string, giftDetails?: GiftDetails): string {
  if (!giftDetails?.isGift) {
    return `${variantId}::standard`;
  }
  const pack = giftDetails.packaging ? "pack" : "nopack";
  const msg = (giftDetails.message || "").trim();
  return `${variantId}::gift::${pack}::${msg}`;
}

// ─── State & Actions ──────────────────────────────────────────────────────────

type CartAction =
  | { type: "ADD_ITEM"; product: Product; variant: ProductVariant; giftDetails?: GiftDetails }
  | { type: "REMOVE_ITEM"; lineId: string }
  | { type: "UPDATE_QTY"; lineId: string; quantity: number }
  | { type: "CLEAR_CART" }
  | { type: "INIT_CART"; cart: Cart };

function calcCart(items: CartItem[]): Cart {
  const subtotal = items.reduce(
    (sum, item) => sum + item.variant.price * item.quantity,
    0
  );
  const shipping = calculateShipping(subtotal, items.length);
  const giftCharge = calculateGiftCharge(items);
  return {
    items,
    subtotal,
    shipping,
    giftCharge,
    discount: 0,
    total: subtotal + shipping + giftCharge
  };
}

function cartReducer(state: Cart, action: CartAction): Cart {
  switch (action.type) {
    case "ADD_ITEM": {
      const lineId = getCartLineId(action.variant.id, action.giftDetails);
      const existingIndex = state.items.findIndex(
        (i) => (i.id || getCartLineId(i.variant.id, i.giftDetails)) === lineId
      );

      let newItems: CartItem[];
      if (existingIndex > -1) {
        newItems = state.items.map((item, idx) =>
          idx === existingIndex
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      } else {
        const sanitizedGiftDetails: GiftDetails | undefined = action.giftDetails?.isGift
          ? {
              isGift: true,
              packaging: Boolean(action.giftDetails.packaging),
              message: action.giftDetails.message?.trim().substring(0, 250) || "",
            }
          : undefined;

        newItems = [
          ...state.items,
          {
            id: lineId,
            product: action.product,
            variant: action.variant,
            quantity: 1,
            giftDetails: sanitizedGiftDetails,
          },
        ];
      }
      return calcCart(newItems);
    }
    case "REMOVE_ITEM": {
      return calcCart(
        state.items.filter(
          (i) => (i.id || getCartLineId(i.variant.id, i.giftDetails)) !== action.lineId && i.variant.id !== action.lineId
        )
      );
    }
    case "UPDATE_QTY": {
      return calcCart(
        state.items.map((i) => {
          const match = (i.id || getCartLineId(i.variant.id, i.giftDetails)) === action.lineId || i.variant.id === action.lineId;
          return match ? { ...i, quantity: action.quantity } : i;
        })
      );
    }
    case "CLEAR_CART":
      return calcCart([]);
    case "INIT_CART":
      return action.cart;
    default:
      return state;
  }
}

// ─── Context ──────────────────────────────────────────────────────────────────

interface CartContextValue {
  cart: Cart;
  addItem: (product: Product, variant: ProductVariant, giftDetails?: GiftDetails) => void;
  removeItem: (lineId: string) => void;
  updateQty: (lineId: string, quantity: number) => void;
  clearCart: () => void;
  itemCount: number;
}

const CartContext = createContext<CartContextValue | null>(null);

const INITIAL_CART: Cart = { items: [], subtotal: 0, shipping: 0, giftCharge: 0, discount: 0, total: 0 };

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [cart, dispatch] = useReducer(cartReducer, INITIAL_CART);
  const [isInitialized, setIsInitialized] = useState(false);

  useEffect(() => {
    const savedCart = localStorage.getItem("kauseyah_cart");
    if (savedCart) {
      try {
        const parsed = JSON.parse(savedCart);
        if (parsed && Array.isArray(parsed.items)) {
          // Normalize items with stable line IDs and sanitize missing gift details
          const normalizedItems: CartItem[] = parsed.items.map((i: any) => ({
            ...i,
            id: i.id || getCartLineId(i.variant.id, i.giftDetails),
            giftDetails: i.giftDetails?.isGift
              ? {
                  isGift: true,
                  packaging: Boolean(i.giftDetails.packaging),
                  message: typeof i.giftDetails.message === "string" ? i.giftDetails.message : "",
                }
              : undefined,
          }));
          dispatch({ type: "INIT_CART", cart: calcCart(normalizedItems) });
        }
      } catch (e) {
        // console.error("Failed to parse cart from local storage", e);
      }
    }
    setIsInitialized(true);
  }, []);

  useEffect(() => {
    if (isInitialized) {
      localStorage.setItem("kauseyah_cart", JSON.stringify(cart));
    }
  }, [cart, isInitialized]);

  const addItem = (product: Product, variant: ProductVariant, giftDetails?: GiftDetails) =>
    dispatch({ type: "ADD_ITEM", product, variant, giftDetails });

  const removeItem = (lineId: string) =>
    dispatch({ type: "REMOVE_ITEM", lineId });

  const updateQty = (lineId: string, quantity: number) =>
    dispatch({ type: "UPDATE_QTY", lineId, quantity });

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
