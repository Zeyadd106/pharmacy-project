import { NextResponse } from "next/server";
import { adminCookieName, adminSessionTtlMs, createSession, verifyCredentials } from "@/lib/admin-auth";

export async function POST(req: Request) {
  try {
    const { email, password } = (await req.json()) as {
      email?: string;
      password?: string;
    };
    if (!email || !password)
      return NextResponse.json({ error: "Email and password required" }, { status: 400 });

    const ok = await verifyCredentials(email, password);
    if (!ok)
      return NextResponse.json({ error: "Invalid credentials" }, { status: 401 });

    const token = await createSession();
    const res = NextResponse.json({ ok: true });
    res.cookies.set(adminCookieName, token, {
      httpOnly: true,
      sameSite: "lax",
      secure: process.env.NODE_ENV === "production",
      path: "/",
      maxAge: Math.floor(adminSessionTtlMs / 1000),
    });
    return res;
  } catch {
    return NextResponse.json({ error: "Login failed" }, { status: 500 });
  }
}
