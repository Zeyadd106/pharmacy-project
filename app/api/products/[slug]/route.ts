import { NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params;
  const data = await db.readDb();
  const product = data.products.find((p) => p.slug === slug && p.active);
  if (!product) {
    return NextResponse.json({ error: "Product not found" }, { status: 404 });
  }
  const category = data.categories.find((c) => c.id === product.categoryId);
  const related = data.products
    .filter((p) => p.categoryId === product.categoryId && p.id !== product.id && p.active)
    .slice(0, 4);
  return NextResponse.json({ product, category, related });
}
