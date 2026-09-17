import { cookies } from "next/headers";
import { createHash, randomBytes, timingSafeEqual } from "crypto";
import { db } from "@/lib/db";

const COOKIE = "mh_admin";
const TTL_MS = 1000 * 60 * 60 * 12; // 12h

function sha256(s: string): string {
  return createHash("sha256").update(s).digest("hex");
}

// Password can be plain in .env (beginner-friendly) — we compare via
// SHA-256 hashes with timingSafeEqual so we never leak via string compare.
export async function verifyCredentials(email: string, password: string): Promise<boolean> {
  const adminEmail = process.env.ADMIN_EMAIL || "admin@mohamedhamed.com";
  const adminPassword = process.env.ADMIN_PASSWORD || "admin123";
  if (email.trim().toLowerCase() !== adminEmail.toLowerCase()) return false;
  const a = sha256(password);
  const b = sha256(adminPassword);
  const ba = Buffer.from(a);
  const bb = Buffer.from(b);
  return ba.length === bb.length && timingSafeEqual(ba, bb);
}

export async function createSession(): Promise<string> {
  const token = randomBytes(32).toString("hex");
  const data = await db.readDb();
  data.sessions = data.sessions ?? [];
  data.sessions.push({
    token: sha256(token),
    expiresAt: new Date(Date.now() + TTL_MS).toISOString(),
  });
  // drop expired
  data.sessions = data.sessions.filter((s) => new Date(s.expiresAt).getTime() > Date.now());
  await db.writeDb(data);
  return token;
}

export async function destroySession(rawToken: string): Promise<void> {
  const data = await db.readDb();
  data.sessions = (data.sessions ?? []).filter((s) => s.token !== sha256(rawToken));
  await db.writeDb(data);
}

export async function isAdmin(): Promise<boolean> {
  const jar = await cookies();
  const raw = jar.get(COOKIE)?.value;
  if (!raw) return false;
  const data = await db.readDb();
  const hit = (data.sessions ?? []).find((s) => s.token === sha256(raw));
  if (!hit) return false;
  return new Date(hit.expiresAt).getTime() > Date.now();
}

export const adminCookieName = COOKIE;
export const adminSessionTtlMs = TTL_MS;
