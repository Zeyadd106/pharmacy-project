import { promises as fs } from "fs";
import path from "path";
import { cache } from "react";
import type {
  Category,
  ContactMessage,
  Order,
  Product,
  Store,
} from "@/types";

interface Database {
  categories: Category[];
  products: Product[];
  orders: Order[];
  stores: Store[];
  messages: ContactMessage[];
  sessions?: { token: string; expiresAt: string }[];
  admin: { email: string; password: string };
}

const DB_PATH = path.join(process.cwd(), "data", "db.json");

// cache() dedupes reads within one request render (safe: per-request only,
// so new orders still show on the next request).
const readDb = cache(async (): Promise<Database> => {
  const raw = await fs.readFile(DB_PATH, "utf-8");
  return JSON.parse(raw) as Database;
});

async function writeDb(db: Database): Promise<void> {
  await fs.writeFile(DB_PATH, JSON.stringify(db, null, 2), "utf-8");
}

export const db = { readDb, writeDb, DB_PATH };
