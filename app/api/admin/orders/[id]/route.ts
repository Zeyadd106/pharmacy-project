import { NextResponse } from "next/server";
import { isAdmin } from "@/lib/admin-auth";
import { db } from "@/lib/db";
import type { OrderStatus } from "@/types";

const ALLOWED: OrderStatus[] = [
  "PENDING",
  "CONFIRMED",
  "PREPARING",
  "OUT_FOR_DELIVERY",
  "COMPLETED",
  "CANCELLED",
];

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  if (!(await isAdmin())) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const { id } = await params;
  const data = await db.readDb();
  const order = data.orders.find((o) => o.id === id) ?? null;
  if (!order) return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json({ order });
}

export async function PUT(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  if (!(await isAdmin())) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const { id } = await params;
  const { status } = (await req.json()) as { status?: OrderStatus };
  if (!status || !ALLOWED.includes(status))
    return NextResponse.json({ error: "Invalid status" }, { status: 400 });
  const data = await db.readDb();
  const order = data.orders.find((o) => o.id === id);
  if (!order) return NextResponse.json({ error: "Not found" }, { status: 404 });
  order.status = status;
  order.updatedAt = new Date().toISOString();
  await db.writeDb(data);
  return NextResponse.json({ order });
}
