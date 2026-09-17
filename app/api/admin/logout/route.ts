import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { adminCookieName, destroySession } from "@/lib/admin-auth";

export async function POST() {
  const jar = await cookies();
  const raw = jar.get(adminCookieName)?.value;
  if (raw) await destroySession(raw);
  const res = NextResponse.json({ ok: true });
  res.cookies.set(adminCookieName, "", { path: "/", maxAge: 0 });
  return res;
}
