import { NextResponse } from "next/server";
import { isAdmin } from "@/lib/admin-auth";
import { db } from "@/lib/db";

export async function GET() {
  if (!(await isAdmin())) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const data = await db.readDb();
  return NextResponse.json({ categories: data.categories, stores: data.stores, messages: data.messages });
}

export async function POST(req: Request) {
  if (!(await isAdmin())) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const body = await req.json();
  const { kind } = body as { kind?: string };
  const data = await db.readDb();

  if (kind === "category") {
    if (!body.name?.trim()) return NextResponse.json({ error: "name required" }, { status: 400 });
    const cat = {
      id: `cat-${Date.now()}`,
      name: body.name.trim(),
      nameAr: body.nameAr?.trim() || body.name.trim(),
      slug: body.name.trim().toLowerCase().replace(/[^a-z0-9]+/g, "-") + `-${Date.now().toString(36)}`,
      description: body.description || "",
      descriptionAr: body.descriptionAr || "",
      image: body.image || "",
      active: body.active !== false,
    };
    data.categories.push(cat);
    await db.writeDb(data);
    return NextResponse.json({ category: cat }, { status: 201 });
  }

  if (kind === "store") {
    if (!body.name?.trim()) return NextResponse.json({ error: "name required" }, { status: 400 });
    const store = {
      id: `store-${Date.now()}`,
      name: body.name.trim(),
      nameAr: body.nameAr?.trim() || body.name.trim(),
      address: body.address || "",
      phone: body.phone || "",
      latitude: Number(body.latitude || 0),
      longitude: Number(body.longitude || 0),
      openingHours: body.openingHours || "",
      active: body.active !== false,
    };
    data.stores.push(store);
    await db.writeDb(data);
    return NextResponse.json({ store }, { status: 201 });
  }

  return NextResponse.json({ error: "Unknown kind" }, { status: 400 });
}

export async function PUT(req: Request) {
  if (!(await isAdmin())) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const body = await req.json();
  const data = await db.readDb();

  if (body.kind === "message-status") {
    const m = data.messages.find((x) => x.id === body.id);
    if (!m) return NextResponse.json({ error: "Not found" }, { status: 404 });
    m.status = body.status;
    await db.writeDb(data);
    return NextResponse.json({ message: m });
  }
  if (body.kind === "category") {
    const c = data.categories.find((x) => x.id === body.id);
    if (!c) return NextResponse.json({ error: "Not found" }, { status: 404 });
    Object.assign(c, {
      name: body.name ?? c.name,
      active: body.active ?? c.active,
      description: body.description ?? c.description,
    });
    await db.writeDb(data);
    return NextResponse.json({ category: c });
  }
  if (body.kind === "store") {
    const s = data.stores.find((x) => x.id === body.id);
    if (!s) return NextResponse.json({ error: "Not found" }, { status: 404 });
    Object.assign(s, {
      name: body.name ?? s.name,
      address: body.address ?? s.address,
      phone: body.phone ?? s.phone,
      latitude: body.latitude !== undefined ? Number(body.latitude) : s.latitude,
      longitude: body.longitude !== undefined ? Number(body.longitude) : s.longitude,
      openingHours: body.openingHours ?? s.openingHours,
      active: body.active ?? s.active,
    });
    await db.writeDb(data);
    return NextResponse.json({ store: s });
  }
  return NextResponse.json({ error: "Unknown kind" }, { status: 400 });
}

export async function DELETE(req: Request) {
  if (!(await isAdmin())) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const { searchParams } = new URL(req.url);
  const kind = searchParams.get("kind");
  const id = searchParams.get("id");
  const data = await db.readDb();
  if (kind === "category") data.categories = data.categories.filter((c) => c.id !== id);
  else if (kind === "store") data.stores = data.stores.filter((s) => s.id !== id);
  else return NextResponse.json({ error: "Unknown kind" }, { status: 400 });
  await db.writeDb(data);
  return NextResponse.json({ ok: true });
}
