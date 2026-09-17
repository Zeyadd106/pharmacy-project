"use client";

import { useRouter } from "next/navigation";
import { use, useEffect, useState } from "react";
import type { Order, OrderStatus } from "@/types";

const FLOW: OrderStatus[] = ["PENDING", "CONFIRMED", "PREPARING", "OUT_FOR_DELIVERY", "COMPLETED"];

export default function OrderDetails({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const router = useRouter();
  const [order, setOrder] = useState<Order | null>(null);

  async function load() {
    const res = await fetch(`/api/admin/orders/${id}`);
    if (res.status === 401) {
      router.push("/admin/login");
      return;
    }
    const d = await res.json();
    setOrder(d.order);
  }

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  async function setStatus(status: OrderStatus) {
    const res = await fetch(`/api/admin/orders/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status }),
    });
    if (res.ok) load();
  }

  if (!order) return <p>Loading order…</p>;

  return (
    <div>
      <h1 className="text-2xl font-bold text-[#273c98]">{order.orderNumber}</h1>
      <p className="text-sm text-gray-500">{new Date(order.createdAt).toLocaleString()} · {order.status}</p>

      <div className="mt-4 grid gap-4 md:grid-cols-2">
        <div className="rounded-2xl bg-white p-5 text-sm">
          <h2 className="font-bold">Customer</h2>
          <p className="mt-2"><strong>Name:</strong> {order.customerName}</p>
          <p><strong>Phone:</strong> {order.customerPhone}</p>
          <p><strong>Address:</strong> {order.customerAddress}</p>
          {order.notes && <p><strong>Notes:</strong> {order.notes}</p>}
        </div>
        <div className="rounded-2xl bg-white p-5 text-sm">
          <h2 className="font-bold">Items</h2>
          {order.items.map((i) => (
            <p key={i.productId} className="mt-1 flex justify-between">
              <span>{i.productName} × {i.quantity}</span>
              <span>{i.subtotal} EGP</span>
            </p>
          ))}
          <p className="mt-3 flex justify-between border-t pt-2 font-bold">
            <span>Total</span><span>{order.totalAmount} EGP</span>
          </p>
        </div>
      </div>

      <div className="mt-4 rounded-2xl bg-white p-5">
        <h2 className="font-bold">Update status</h2>
        <div className="mt-2 flex flex-wrap gap-2">
          {FLOW.map((s) => (
            <button
              key={s}
              onClick={() => setStatus(s)}
              className={`rounded-full px-4 py-2 text-sm ${order.status === s ? "shams-orange btn-glow text-[#101c3f]" : "border"}`}
            >
              {s}
            </button>
          ))}
          <button onClick={() => setStatus("CANCELLED")} className="rounded-full bg-red-600 px-4 py-2 text-sm text-white">
            Cancel order
          </button>
        </div>
      </div>
    </div>
  );
}
