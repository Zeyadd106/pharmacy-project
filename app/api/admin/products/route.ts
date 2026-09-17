import { NextResponse } from "next/server";
import { isAdmin } from "@/lib/admin-auth";
import { db } from "@/lib/db";

export async function GET(req: Request) {
  if (!(await isAdmin())) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const { searchParams } = new URL(req.url);
  const q = (searchParams.get("q") || "").toLowerCase();
  const category = searchParams.get("category") || "";
  const stock = searchParams.get("stock") || ""; // low | out | all
  const data = await db.readDb();
  let products = data.products;
  if (category) products = products.filter((p) => p.categoryId === category);
  if (stock === "low") products = products.filter((p) => p.stock <= 10 && p.stock > 0);
  if (stock === "out") products = products.filter((p) => p.stock <= 0);
  if (q)
    products = products.filter(
      (p) => p.name.toLowerCase().includes(q) || p.slug.includes(q)
    );
  return NextResponse.json({ products });
}

export async function POST(req: Request) {
  if (!(await isAdmin())) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const body = await req.json();
  if (!body.name?.trim() || !body.categoryId || body.price == null)
    return NextResponse.json({ error: "name, categoryId, price required" }, { status: 400 });
  const data = await db.readDb();
  const slug =
    (body.slug?.trim() ||
      body.name.trim().toLowerCase().replace(/[^a-z0-9]+/g, "-")) +
    `-${Date.now().toString(36)}`;
  const product = {
    id: `p-${Date.now()}`,
    name: body.name.trim(),
    nameAr: body.nameAr?.trim() || body.name.trim(),
    slug,
    description: body.description?.trim() || "",
    descriptionAr: body.descriptionAr?.trim() || "",
    price: Number(body.price),
    image: body.image?.trim() || "",
    stock: Number(body.stock ?? 0),
    active: body.active !== false,
    requiresPrescription: !!body.requiresPrescription,
    categoryId: body.categoryId,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
  data.products.push(product);
  await db.writeDb(data);
  return NextResponse.json({ product }, { status: 201 });
}
