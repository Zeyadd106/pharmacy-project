import { NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function GET() {
  const data = await db.readDb();
  return NextResponse.json({
    categories: data.categories.filter((c) => c.active),
  });
}
