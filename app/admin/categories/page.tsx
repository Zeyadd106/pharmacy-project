"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import type { Category } from "@/types";

export default function AdminCategories() {
  const router = useRouter();
  const [cats, setCats] = useState<Category[]>([]);
  const [name, setName] = useState("");

  async function load() {
    const r = await fetch("/api/admin/manage");
    if (r.status === 401) {
      router.push("/admin/login");
      return;
    }
    setCats((await r.json()).categories);
  }

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function add(e: React.FormEvent) {
    e.preventDefault();
    await fetch("/api/admin/manage", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ kind: "category", name }),
    });
    setName("");
    load();
  }

  async function toggle(c: Category) {
    await fetch("/api/admin/manage", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ kind: "category", id: c.id, active: !c.active }),
    });
    load();
  }

  async function remove(id: string) {
    if (!confirm("Delete category? Products in it will remain but uncategorized.")) return;
    await fetch(`/api/admin/manage?kind=category&id=${id}`, { method: "DELETE" });
    load();
  }

  return (
    <div>
      <h1 className="text-2xl font-bold text-[#273c98]">Categories</h1>
      <form onSubmit={add} className="mt-4 flex gap-2">
        <input value={name} onChange={(e) => setName(e.target.value)} placeholder="New category name" className="flex-1 rounded-full border px-4 py-2 text-sm" required />
        <button className="rounded-full shams-orange btn-glow px-5 py-2 text-sm text-[#101c3f]">Add</button>
      </form>
      <div className="mt-4 space-y-2">
        {cats.map((c) => (
          <div key={c.id} className="flex items-center gap-3 rounded-2xl bg-white p-3 text-sm">
            <span className="flex-1 font-semibold">{c.name} <span className="text-gray-400">({c.slug})</span></span>
            <span>{c.active ? "active" : "hidden"}</span>
            <button onClick={() => toggle(c)} className="rounded-full border px-4 py-1">Toggle</button>
            <button onClick={() => remove(c.id)} className="rounded-full bg-red-50 px-4 py-1 text-red-600">Delete</button>
          </div>
        ))}
      </div>
    </div>
  );
}
