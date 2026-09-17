import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import type { Order, OrderItem } from "@/types";

function makeOrderNumber(count: number): string {
  const d = new Date();
  const ymd = `${d.getFullYear()}${String(d.getMonth() + 1).padStart(2, "0")}${String(
    d.getDate()
  ).padStart(2, "0")}`;
  return `PH-${ymd}-${String(count + 1).padStart(4, "0")}`;
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { customerName, customerPhone, customerAddress, notes, items } = body as {
      customerName?: string;
      customerPhone?: string;
      customerAddress?: string;
      notes?: string;
      items?: { productId: string; quantity: number }[];
    };

    // Validate customer data (server-side, never trust client)
    if (!customerName?.trim())
      return NextResponse.json({ error: "Full name is required" }, { status: 400 });
    if (!customerPhone?.trim() || !/^[0-9+\s-]{7,15}$/.test(customerPhone.trim()))
      return NextResponse.json({ error: "Valid phone number is required" }, { status: 400 });
    if (!customerAddress?.trim())
      return NextResponse.json({ error: "Address is required" }, { status: 400 });
    if (!Array.isArray(items) || items.length === 0)
      return NextResponse.json({ error: "Cart is empty" }, { status: 400 });

    const data = await db.readDb();

    // Validate products + fetch REAL prices from DB
    const orderItems: OrderItem[] = [];
    let total = 0;

    for (const it of items) {
      const product = data.products.find((p) => p.id === it.productId && p.active);
      if (!product)
        return NextResponse.json(
          { error: `Product not available: ${it.productId}` },
          { status: 400 }
        );
      const qty = Math.floor(Number(it.quantity));
      if (!qty || qty < 1)
        return NextResponse.json({ error: "Invalid quantity" }, { status: 400 });
      if (product.stock < qty)
        return NextResponse.json(
          { error: `Not enough stock for ${product.name} (available: ${product.stock})` },
          { status: 400 }
        );
      const subtotal = product.price * qty;
      total += subtotal;
      orderItems.push({
        productId: product.id,
        productName: product.name,
        quantity: qty,
        unitPrice: product.price, // server price, not client price
        subtotal,
      });
    }

    // Decrease stock safely (single transaction = single file write)
    for (const oi of orderItems) {
      const p = data.products.find((x) => x.id === oi.productId)!;
      p.stock -= oi.quantity;
      p.updatedAt = new Date().toISOString();
    }

    const order: Order = {
      id: `ord-${Date.now()}`,
      orderNumber: makeOrderNumber(data.orders.length),
      customerName: customerName.trim(),
      customerPhone: customerPhone.trim(),
      customerAddress: customerAddress.trim(),
      notes: notes?.trim() || "",
      items: orderItems,
      totalAmount: total,
      status: "PENDING",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    data.orders.push(order);
    await db.writeDb(data);

    return NextResponse.json({ order }, { status: 201 });
  } catch {
    return NextResponse.json({ error: "Failed to create order" }, { status: 500 });
  }
}

export async function GET() {
  // Public cannot list all orders; admin endpoint will handle that.
  // Keep this minimal for confirmation lookup via /api/orders/[id].
  return NextResponse.json({ error: "Use /api/orders/[id]" }, { status: 400 });
}
