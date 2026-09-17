"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import type { Category, Product } from "@/types";

export default function AdminProducts() {
  const router = useRouter();
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [q, setQ] = useState("");
  const [form, setForm] = useState({ name: "", price: "", stock: "", categoryId: "" });
  const [editing, setEditing] = useState<Product | null>(null);

  async function load() {
    const r = await fetch(`/api/admin/products?q=${encodeURIComponent(q)}`);
    if (r.status === 401) {
      router.push("/admin/login");
      return;
    }
    setProducts((await r.json()).products);
    const m = await fetch("/api/admin/manage");
    if (m.ok) {
      const d = await m.json();
      setCategories(d.categories);
      if (!form.categoryId && d.categories[0]) setForm((f) => ({ ...f, categoryId: d.categories[0].id }));
    }
  }

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function create(e: React.FormEvent) {
    e.preventDefault();
    const res = await fetch("/api/admin/products", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: form.name,
        price: Number(form.price),
        stock: Number(form.stock || 0),
        categoryId: form.categoryId,
      }),
    });
    if (res.ok) {
      setForm({ name: "", price: "", stock: "", categoryId: form.categoryId });
      load();
    }
  }

  async function saveEdit() {
    if (!editing) return;
    await fetch(`/api/admin/products/${editing.id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name: editing.name, price: editing.price, stock: editing.stock, active: editing.active }),
    });
    setEditing(null);
    load();
  }

  async function remove(id: string) {
    if (!confirm("Delete this product?")) return;
    await fetch(`/api/admin/products/${id}`, { method: "DELETE" });
    load();
  }

  return (
    <div>
      <h1 className="text-2xl font-bold text-[#273c98]">Products</h1>

      <form onSubmit={create} className="mt-4 grid gap-2 rounded-2xl bg-white p-4 md:grid-cols-5">
        <input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="Name" className="rounded-xl border px-3 py-2 text-sm" required />
        <input value={form.price} onChange={(e) => setForm({ ...form, price: e.target.value })} placeholder="Price EGP" type="number" className="rounded-xl border px-3 py-2 text-sm" required />
        <input value={form.stock} onChange={(e) => setForm({ ...form, stock: e.target.value })} placeholder="Stock" type="number" className="rounded-xl border px-3 py-2 text-sm" />
        <select value={form.categoryId} onChange={(e) => setForm({ ...form, categoryId: e.target.value })} className="rounded-xl border px-3 py-2 text-sm">
          {categories.map((c) => (
            <option key={c.id} value={c.id}>{c.name}</option>
          ))}
        </select>
        <button className="rounded-xl shams-orange btn-glow px-4 py-2 text-sm text-[#101c3f]">Add product</button>
      </form>

      <div className="mt-3 flex gap-2">
        <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search products…" className="flex-1 rounded-full border px-4 py-2 text-sm" />
        <button onClick={load} className="rounded-full border px-5 py-2 text-sm">Search</button>
      </div>

      <div className="mt-4 space-y-2">
        {products.map((p) => (
          <div key={p.id} className="flex flex-wrap items-center gap-3 rounded-2xl bg-white p-3 text-sm">
            <div className="flex-1">
              <p className="font-semibold">{p.name}</p>
              <p className="text-gray-500">{p.price} EGP · stock {p.stock} · {p.active ? "active" : "hidden"}</p>
            </div>
            <button onClick={() => setEditing(p)} className="rounded-full border px-4 py-1">Edit</button>
            <button onClick={() => remove(p.id)} className="rounded-full bg-red-50 px-4 py-1 text-red-600">Delete</button>
          </div>
        ))}
      </div>

      {editing && (
        <div className="fixed inset-0 grid place-items-center bg-black/40 p-4">
          <div className="w-full max-w-sm rounded-2xl bg-white p-5">
            <h2 className="font-bold">Edit product</h2>
            <input value={editing.name} onChange={(e) => setEditing({ ...editing, name: e.target.value })} className="mt-3 w-full rounded-xl border px-3 py-2 text-sm" />
            <div className="mt-2 grid grid-cols-2 gap-2">
              <input value={editing.price} onChange={(e) => setEditing({ ...editing, price: Number(e.target.value) })} type="number" className="rounded-xl border px-3 py-2 text-sm" />
              <input value={editing.stock} onChange={(e) => setEditing({ ...editing, stock: Number(e.target.value) })} type="number" className="rounded-xl border px-3 py-2 text-sm" />
            </div>
            <label className="mt-2 flex items-center gap-2 text-sm">
              <input type="checkbox" checked={editing.active} onChange={(e) => setEditing({ ...editing, active: e.target.checked })} /> Active
            </label>
            <div className="mt-4 flex gap-2">
              <button onClick={saveEdit} className="flex-1 rounded-full shams-orange btn-glow py-2 text-sm text-[#101c3f]">Save</button>
              <button onClick={() => setEditing(null)} className="flex-1 rounded-full border py-2 text-sm">Cancel</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
