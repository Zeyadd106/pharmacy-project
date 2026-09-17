import { NextResponse } from "next/server";
import { isAdmin } from "@/lib/admin-auth";
import { db } from "@/lib/db";

export async function PUT(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  if (!(await isAdmin())) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const { id } = await params;
  const body = await req.json();
  const data = await db.readDb();
  const p = data.products.find((x) => x.id === id);
  if (!p) return NextResponse.json({ error: "Not found" }, { status: 404 });
  if (body.name !== undefined) p.name = String(body.name);
  if (body.nameAr !== undefined) p.nameAr = String(body.nameAr);
  if (body.description !== undefined) p.description = String(body.description);
  if (body.price !== undefined) p.price = Number(body.price);
  if (body.stock !== undefined) p.stock = Number(body.stock);
  if (body.active !== undefined) p.active = !!body.active;
  if (body.categoryId !== undefined) p.categoryId = String(body.categoryId);
  if (body.image !== undefined) p.image = String(body.image);
  if (body.requiresPrescription !== undefined)
    p.requiresPrescription = !!body.requiresPrescription;
  p.updatedAt = new Date().toISOString();
  await db.writeDb(data);
  return NextResponse.json({ product: p });
}

export async function DELETE(
  _req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  if (!(await isAdmin())) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const { id } = await params;
  const data = await db.readDb();
  data.products = data.products.filter((x) => x.id !== id);
  await db.writeDb(data);
  return NextResponse.json({ ok: true });
}
