"use client";

import type { CartItem } from "@/types";

const KEY = "mh-cart";

export function getCart(): CartItem[] {
  if (typeof window === "undefined") return [];
  try {
    return JSON.parse(localStorage.getItem(KEY) || "[]");
  } catch {
    return [];
  }
}

export function addToCart(productId: string, qty = 1): CartItem[] {
  const cart = getCart();
  const found = cart.find((c) => c.productId === productId);
  if (found) found.quantity += qty;
  else cart.push({ productId, quantity: qty });
  localStorage.setItem(KEY, JSON.stringify(cart));
  window.dispatchEvent(new Event("mh-cart-changed"));
  return cart;
}

export function cartCount(): number {
  return getCart().reduce((n, c) => n + c.quantity, 0);
}
