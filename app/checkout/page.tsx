"use client";

import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import type { Product } from "@/types";
import { getCart } from "@/lib/cart";

export default function CheckoutPage() {
  const router = useRouter();
  const [rows, setRows] = useState<{ product: Product; quantity: number }[]>([]);
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [notes, setNotes] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const cart = getCart();
    if (cart.length === 0) return;
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
  }, []);

  const total = rows.reduce((n, r) => n + r.product.price * r.quantity, 0);

  async function placeOrder(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    if (!name.trim()) return setError("Full name is required.");
    if (!/^[0-9+\s-]{7,15}$/.test(phone.trim()))
      return setError("Enter a valid phone number.");
    if (!address.trim()) return setError("Address is required.");

    setLoading(true);
    try {
      const res = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          customerName: name,
          customerPhone: phone,
          customerAddress: address,
          notes,
          items: rows.map((r) => ({ productId: r.product.id, quantity: r.quantity })),
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Failed to place order.");
        return;
      }
      localStorage.setItem("mh-cart", "[]");
      window.dispatchEvent(new Event("mh-cart-changed"));
      router.push(`/order/${data.order.id}`);
    } catch {
      setError("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex min-h-full flex-col bg-[#f9fafb]">
      <Navbar />
      <main className="mx-auto w-full max-w-5xl flex-1 px-4 py-8">
        <h1 className="text-3xl font-bold text-[#273c98]">Checkout</h1>
        <p className="text-sm text-gray-500">No login needed — just name, phone and address.</p>

        <div className="mt-6 grid gap-6 md:grid-cols-[1fr_320px]">
          <form onSubmit={placeOrder} className="rounded-2xl bg-white p-6">
            <label className="block text-sm font-medium">Full Name *</label>
            <input value={name} onChange={(e) => setName(e.target.value)} className="mt-1 w-full rounded-xl border px-3 py-2" placeholder="e.g. Ahmed Ali" />
            <label className="mt-4 block text-sm font-medium">Phone Number *</label>
            <input value={phone} onChange={(e) => setPhone(e.target.value)} className="mt-1 w-full rounded-xl border px-3 py-2" placeholder="e.g. 01001234567" />
            <label className="mt-4 block text-sm font-medium">Full Address *</label>
            <textarea value={address} onChange={(e) => setAddress(e.target.value)} className="mt-1 w-full rounded-xl border px-3 py-2" placeholder="Street, building, city" />
            <label className="mt-4 block text-sm font-medium">Notes (optional)</label>
            <textarea value={notes} onChange={(e) => setNotes(e.target.value)} className="mt-1 w-full rounded-xl border px-3 py-2" />
            {error && <p className="mt-3 rounded-xl bg-red-50 p-3 text-sm text-red-600">{error}</p>}
            <button disabled={loading || rows.length === 0} className="btn-glow shams-orange mt-5 w-full rounded-full py-3 font-bold text-[#101c3f] disabled:opacity-40">
              {loading ? "Placing order…" : "Place Order"}
            </button>
          </form>

          <div className="h-fit rounded-2xl bg-white p-5">
            <h2 className="font-semibold text-[#273c98]">Order Summary</h2>
            <div className="mt-3 space-y-2 text-sm">
              {rows.map(({ product, quantity }) => (
                <p key={product.id} className="flex justify-between">
                  <span>{product.name} × {quantity}</span>
                  <span>{product.price * quantity} EGP</span>
                </p>
              ))}
            </div>
            <p className="mt-4 flex justify-between border-t pt-3 font-bold text-[#273c98]">
              <span>Total</span><span>{total} EGP</span>
            </p>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
