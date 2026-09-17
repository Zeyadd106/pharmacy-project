"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import type { Order, Product } from "@/types";

interface Stats {
  totalOrders: number;
  pendingOrders: number;
  completedOrders: number;
  cancelledOrders: number;
  totalProducts: number;
  lowStock: number;
  revenue: number;
}

export default function AdminDashboard() {
  const router = useRouter();
  const [stats, setStats] = useState<Stats | null>(null);
  const [recent, setRecent] = useState<Order[]>([]);
  const [low, setLow] = useState<Product[]>([]);
  const [newCount, setNewCount] = useState(0);

  async function load() {
    const res = await fetch("/api/admin/stats");
    if (res.status === 401) {
      router.push("/admin/login");
      return;
    }
    const d = await res.json();
    setStats(d.stats);
    setRecent(d.recentOrders);
    setLow(d.lowStockProducts);
    setNewCount((d.recentOrders as Order[]).filter((o) => o.status === "PENDING").length);
  }

  useEffect(() => {
    load();
    const t = setInterval(load, 15000); // reliable polling for new orders
    return () => clearInterval(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (!stats) return <p>Loading dashboard…</p>;

  const cards: [string, number][] = [
    ["Total Orders", stats.totalOrders],
    ["Pending Orders", stats.pendingOrders],
    ["Completed", stats.completedOrders],
    ["Cancelled", stats.cancelledOrders],
    ["Products", stats.totalProducts],
    ["Low Stock", stats.lowStock],
  ];

  return (
    <div>
      <div className="flex items-center gap-3">
        <h1 className="text-2xl font-bold text-[#273c98]">Dashboard</h1>
        {newCount > 0 && (
          <span className="rounded-full bg-red-600 px-3 py-1 text-xs font-bold text-white">
            {newCount} New Order{newCount > 1 ? "s" : ""}
          </span>
        )}
      </div>
      <p className="text-sm text-gray-500">Revenue (non-cancelled): {stats.revenue} EGP · auto-refresh every 15s</p>

      <div className="mt-4 grid grid-cols-2 gap-3 md:grid-cols-3">
        {cards.map(([label, n]) => (
          <div key={label} className="rounded-2xl bg-white p-5 shadow-sm">
            <p className="text-2xl font-bold text-[#273c98]">{n}</p>
            <p className="text-sm text-gray-500">{label}</p>
          </div>
        ))}
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-2">
        <div className="rounded-2xl bg-white p-5">
          <div className="mb-3 flex justify-between">
            <h2 className="font-bold text-[#273c98]">Recent Orders</h2>
            <Link href="/admin/orders" className="text-sm text-[#02a9e0]">View all</Link>
          </div>
          <div className="space-y-2 text-sm">
            {recent.map((o) => (
              <Link key={o.id} href={`/admin/orders/${o.id}`} className="flex justify-between rounded-xl bg-[#f9fafb] px-3 py-2 hover:ring-1">
                <span>{o.orderNumber} · {o.customerName}</span>
                <span className="font-semibold">{o.totalAmount} EGP · {o.status}</span>
              </Link>
            ))}
            {recent.length === 0 && <p className="text-gray-500">No orders yet.</p>}
          </div>
        </div>
        <div className="rounded-2xl bg-white p-5">
          <div className="mb-3 flex justify-between">
            <h2 className="font-bold text-[#273c98]">Low Stock</h2>
            <Link href="/admin/products?stock=low" className="text-sm text-[#02a9e0]">View all</Link>
          </div>
          <div className="space-y-2 text-sm">
            {low.map((p) => (
              <p key={p.id} className="flex justify-between rounded-xl bg-[#f9fafb] px-3 py-2">
                <span>{p.name}</span><span className="font-semibold text-red-600">{p.stock} left</span>
              </p>
            ))}
            {low.length === 0 && <p className="text-gray-500">Stock levels OK.</p>}
          </div>
        </div>
      </div>
    </div>
  );
}
