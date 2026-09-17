import { NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const q = (searchParams.get("q") || "").toLowerCase().trim();
  const category = searchParams.get("category") || "";

  const data = await db.readDb();
  const catById = new Map(data.categories.map((c) => [c.id, c]));
  const catBySlug = new Map(data.categories.map((c) => [c.slug, c]));

  let products = data.products.filter((p) => p.active);

  if (category) {
    const cat = catBySlug.get(category);
    if (cat) products = products.filter((p) => p.categoryId === cat.id);
  }

  if (q) {
    products = products.filter((p) => {
      const cat = catById.get(p.categoryId);
      return (
        p.name.toLowerCase().includes(q) ||
        p.nameAr.includes(q) ||
        p.description.toLowerCase().includes(q) ||
        (cat?.name.toLowerCase().includes(q) ?? false)
      );
    });
  }

  return NextResponse.json({ products });
}
