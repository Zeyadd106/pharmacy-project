"use client";

import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Link from "next/link";
import { useEffect, useState } from "react";
import type { Product } from "@/types";
import { getCart } from "@/lib/cart";

interface Row {
  product: Product;
  quantity: number;
}

export default function CartPage() {
  const [rows, setRows] = useState<Row[]>([]);

  function reload() {
    const cart = getCart();
    if (cart.length === 0) {
      setRows([]);
      return;
    }
    fetch("/api/products")
      .then((r) => r.json())
      .then((d) => {
        const all = d.products as Product[];
        setRows(
          cart
            .map((c) => ({
              product: all.find((p) => p.id === c.productId)!,
              quantity: c.quantity,
            }))
            .filter((r) => r.product)
        );
      });
  }

  useEffect(() => {
    reload();
    window.addEventListener("mh-cart-changed", reload);
    return () => window.removeEventListener("mh-cart-changed", reload);
  }, []);

  function setQty(id: string, qty: number) {
    const cart = getCart();
    const item = cart.find((c) => c.productId === id);
    if (!item) return;
    if (qty <= 0) {
      const next = cart.filter((c) => c.productId !== id);
      localStorage.setItem("mh-cart", JSON.stringify(next));
    } else {
      item.quantity = qty;
      localStorage.setItem("mh-cart", JSON.stringify(cart));
    }
    window.dispatchEvent(new Event("mh-cart-changed"));
    reload();
  }

  const subtotal = rows.reduce((n, r) => n + r.product.price * r.quantity, 0);

  return (
    <div className="flex min-h-full flex-col bg-[#f9fafb]">
      <Navbar />
      <main className="mx-auto w-full max-w-5xl flex-1 px-4 py-8">
        <h1 className="text-3xl font-bold text-[#273c98]">Shopping Cart</h1>
        {rows.length === 0 ? (
          <div className="mt-8 rounded-2xl bg-white p-10 text-center">
            <p className="font-semibold">Your cart is empty</p>
            <Link href="/products" className="mt-4 inline-block rounded-full shams-orange btn-glow px-6 py-2 text-sm text-[#101c3f]">
              Continue shopping
            </Link>
          </div>
        ) : (
          <div className="mt-6 grid gap-6 md:grid-cols-[1fr_300px]">
            <div className="space-y-3">
              {rows.map(({ product, quantity }) => (
                <div key={product.id} className="flex items-center gap-3 rounded-2xl bg-white p-4 sm:gap-4">
                  <div className="min-w-0 flex-1">
                    <p className="break-words font-semibold text-[#273c98]">{product.name}</p>
                    <p className="text-sm text-gray-500">{product.price} EGP each</p>
                    <div className="mt-2 flex flex-wrap items-center gap-2">
                      <button aria-label="Decrease" className="rounded-full border px-3 py-1" onClick={() => setQty(product.id, quantity - 1)}>−</button>
                      <span className="w-8 text-center font-semibold">{quantity}</span>
                      <button aria-label="Increase" className="rounded-full border px-3 py-1" onClick={() => setQty(product.id, quantity + 1)}>+</button>
                      <button className="ml-2 text-sm text-red-600" onClick={() => setQty(product.id, 0)}>Remove</button>
                    </div>
                  </div>
                  <p className="font-bold">{product.price * quantity} EGP</p>
                </div>
              ))}
            </div>
            <div className="h-fit rounded-2xl bg-white p-5">
              <p className="flex justify-between text-sm"><span>Subtotal</span><span>{subtotal} EGP</span></p>
              <p className="mt-2 flex justify-between font-bold text-[#273c98]"><span>Total</span><span>{subtotal} EGP</span></p>
              <Link href="/checkout" className="shams-orange mt-4 block rounded-full py-3 text-center font-bold text-[#101c3f]">
                Proceed to Checkout
              </Link>
              <Link href="/products" className="mt-2 block text-center text-sm text-[#02a9e0]">
                Continue shopping
              </Link>
            </div>
          </div>
        )}
      </main>
      <Footer />
    </div>
  );
}
