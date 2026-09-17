import { NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function POST(req: Request) {
  try {
    const { name, phone, email, message } = (await req.json()) as {
      name?: string;
      phone?: string;
      email?: string;
      message?: string;
    };
    if (!name?.trim()) return NextResponse.json({ error: "Name required" }, { status: 400 });
    if (!phone?.trim()) return NextResponse.json({ error: "Phone required" }, { status: 400 });
    if (!message?.trim()) return NextResponse.json({ error: "Message required" }, { status: 400 });

    const data = await db.readDb();
    const entry = {
      id: `msg-${Date.now()}`,
      name: name.trim(),
      phone: phone.trim(),
      email: email?.trim() || "",
      message: message.trim(),
      status: "NEW" as const,
      createdAt: new Date().toISOString(),
    };
    data.messages.push(entry);
    await db.writeDb(data);
    return NextResponse.json({ ok: true }, { status: 201 });
  } catch {
    return NextResponse.json({ error: "Failed to send message" }, { status: 500 });
  }
}
