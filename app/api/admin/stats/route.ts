import { NextResponse } from "next/server";
import { isAdmin } from "@/lib/admin-auth";
import { db } from "@/lib/db";

export async function GET() {
  if (!(await isAdmin())) return NextResponse.json({ ok: false }, { status: 401 });
  const data = await db.readDb();
  const orders = data.orders;
  const stats = {
    totalOrders: orders.length,
    pendingOrders: orders.filter((o) => o.status === "PENDING").length,
    completedOrders: orders.filter((o) => o.status === "COMPLETED").length,
    cancelledOrders: orders.filter((o) => o.status === "CANCELLED").length,
    totalProducts: data.products.length,
    lowStock: data.products.filter((p) => p.stock <= 10).length,
    revenue: orders
      .filter((o) => o.status !== "CANCELLED")
      .reduce((n, o) => n + o.totalAmount, 0),
  };
  const recentOrders = [...orders]
    .sort((a, b) => +new Date(b.createdAt) - +new Date(a.createdAt))
    .slice(0, 8);
  const lowStockProducts = data.products
    .filter((p) => p.stock <= 10)
    .slice(0, 8);
  return NextResponse.json({ ok: true, stats, recentOrders, lowStockProducts });
}
