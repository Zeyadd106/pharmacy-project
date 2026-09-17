import { NextResponse } from "next/server";
import { isAdmin } from "@/lib/admin-auth";
import { db } from "@/lib/db";

export async function GET(req: Request) {
  if (!(await isAdmin())) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const { searchParams } = new URL(req.url);
  const status = searchParams.get("status") || "";
  const q = (searchParams.get("q") || "").toLowerCase();

  const data = await db.readDb();
  let orders = [...data.orders].sort(
    (a, b) => +new Date(b.createdAt) - +new Date(a.createdAt)
  );
  if (status) orders = orders.filter((o) => o.status === status);
  if (q)
    orders = orders.filter(
      (o) =>
        o.orderNumber.toLowerCase().includes(q) ||
        o.customerName.toLowerCase().includes(q) ||
        o.customerPhone.includes(q)
    );
  return NextResponse.json({ orders });
}
