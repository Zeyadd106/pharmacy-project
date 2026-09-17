import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Link from "next/link";
import { CheckCircle2 } from "lucide-react";
import { promises as fs } from "fs";
import path from "path";
import { notFound } from "next/navigation";
import type { Order } from "@/types";

async function load(id: string): Promise<Order | null> {
  const raw = await fs.readFile(path.join(process.cwd(), "data", "db.json"), "utf-8");
  const db = JSON.parse(raw);
  return (db.orders as Order[]).find((o) => o.id === id || o.orderNumber === id) ?? null;
}

export default async function OrderPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const order = await load(id);
  if (!order) notFound();

  return (
    <div className="flex min-h-full flex-col bg-[#f9fafb]">
      <Navbar />
      <main className="mx-auto w-full max-w-3xl flex-1 px-4 py-10">
        <div className="rounded-3xl bg-white p-8 text-center">
          <CheckCircle2 size={56} className="mx-auto text-green-600" />
          <h1 className="mt-3 text-3xl font-bold text-[#273c98]">Order Placed Successfully!</h1>
          <p className="mt-1 text-gray-500">Thank you, {order.customerName}. We will call you soon.</p>
          <div className="mx-auto mt-6 max-w-md space-y-2 rounded-2xl bg-[#f9fafb] p-5 text-left text-sm">
            <p><strong>Order number:</strong> {order.orderNumber}</p>
            <p><strong>Name:</strong> {order.customerName}</p>
            <p><strong>Phone:</strong> {order.customerPhone}</p>
            <p><strong>Status:</strong> {order.status}</p>
            <p><strong>Total:</strong> {order.totalAmount} EGP</p>
            <div className="border-t pt-2">
              {order.items.map((i) => (
                <p key={i.productId} className="flex justify-between">
                  <span>{i.productName} × {i.quantity}</span>
                  <span>{i.subtotal} EGP</span>
                </p>
              ))}
            </div>
          </div>
          <Link href="/products" className="btn-glow shams-orange mt-6 inline-block rounded-full px-8 py-3 font-bold text-[#101c3f]">
            Continue Shopping
          </Link>
        </div>
      </main>
      <Footer />
    </div>
  );
}
