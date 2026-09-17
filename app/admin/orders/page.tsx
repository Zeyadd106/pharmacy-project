"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense, useEffect, useState } from "react";
import type { Order } from "@/types";

function OrdersInner() {
  const router = useRouter();
  const sp = useSearchParams();
  const [orders, setOrders] = useState<Order[]>([]);
  const [status, setStatus] = useState(sp.get("status") || "");
  const [q, setQ] = useState("");

  async function load() {
    const res = await fetch(
      `/api/admin/orders?status=${encodeURIComponent(status)}&q=${encodeURIComponent(q)}`
    );
    if (res.status === 401) {
      router.push("/admin/login");
      return;
    }
    const d = await res.json();
    setOrders(d.orders);
  }

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [status]);

  return (
    <div>
      <h1 className="text-2xl font-bold text-[#273c98]">Orders</h1>
      <form
        className="mt-3 flex flex-wrap gap-2"
        onSubmit={(e) => {
          e.preventDefault();
          load();
        }}
      >
        <select value={status} onChange={(e) => setStatus(e.target.value)} className="rounded-full border bg-white px-4 py-2 text-sm">
          <option value="">All statuses</option>
          {["PENDING", "CONFIRMED", "PREPARING", "OUT_FOR_DELIVERY", "COMPLETED", "CANCELLED"].map((s) => (
            <option key={s} value={s}>{s}</option>
          ))}
        </select>
        <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search name, phone, order #" className="min-w-52 flex-1 rounded-full border px-4 py-2 text-sm" />
        <button className="rounded-full shams-orange btn-glow px-5 py-2 text-sm text-[#101c3f]">Filter</button>
      </form>

      <div className="mt-4 overflow-x-auto rounded-2xl bg-white">
        <table className="w-full min-w-[720px] text-sm">
          <thead>
            <tr className="border-b text-left text-gray-500">
              <th className="p-3">Order</th>
              <th className="p-3">Customer</th>
              <th className="p-3">Total</th>
              <th className="p-3">Date</th>
              <th className="p-3">Status</th>
            </tr>
          </thead>
          <tbody>
            {orders.map((o) => (
              <tr key={o.id} className="border-b last:border-0 hover:bg-[#f9fafb]">
                <td className="p-3"><Link href={`/admin/orders/${o.id}`} className="font-semibold text-[#02a9e0]">{o.orderNumber}</Link></td>
                <td className="p-3">{o.customerName}<br /><span className="text-gray-500">{o.customerPhone}</span></td>
                <td className="p-3">{o.totalAmount} EGP</td>
                <td className="p-3">{new Date(o.createdAt).toLocaleString()}</td>
                <td className="p-3">{o.status}</td>
              </tr>
            ))}
          </tbody>
        </table>
        {orders.length === 0 && <p className="p-6 text-center text-gray-500">No orders.</p>}
      </div>
    </div>
  );
}

export default function OrdersPage() {
  return (
    <Suspense fallback={<p>Loading…</p>}>
      <OrdersInner />
    </Suspense>
  );
}
