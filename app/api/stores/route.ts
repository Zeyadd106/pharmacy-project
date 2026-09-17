import { NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function GET() {
  const data = await db.readDb();
  return NextResponse.json({
    stores: data.stores.filter((s) => s.active !== false),
  });
}
