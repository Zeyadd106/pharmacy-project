"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import type { Store } from "@/types";

export default function AdminStores() {
  const router = useRouter();
  const [stores, setStores] = useState<Store[]>([]);
  const [form, setForm] = useState({ name: "", address: "", phone: "", latitude: "", longitude: "", openingHours: "" });

  async function load() {
    const r = await fetch("/api/admin/manage");
    if (r.status === 401) {
      router.push("/admin/login");
      return;
    }
    setStores((await r.json()).stores);
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
      body: JSON.stringify({ kind: "store", ...form }),
    });
    setForm({ name: "", address: "", phone: "", latitude: "", longitude: "", openingHours: "" });
    load();
  }

  return (
    <div>
      <h1 className="text-2xl font-bold text-[#273c98]">Stores</h1>
      <form onSubmit={add} className="mt-4 grid gap-2 rounded-2xl bg-white p-4 md:grid-cols-3">
        <input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="Store name" className="rounded-xl border px-3 py-2 text-sm" required />
        <input value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} placeholder="Phone" className="rounded-xl border px-3 py-2 text-sm" />
        <input value={form.address} onChange={(e) => setForm({ ...form, address: e.target.value })} placeholder="Address" className="rounded-xl border px-3 py-2 text-sm" />
        <input value={form.latitude} onChange={(e) => setForm({ ...form, latitude: e.target.value })} placeholder="Latitude" className="rounded-xl border px-3 py-2 text-sm" />
        <input value={form.longitude} onChange={(e) => setForm({ ...form, longitude: e.target.value })} placeholder="Longitude" className="rounded-xl border px-3 py-2 text-sm" />
        <input value={form.openingHours} onChange={(e) => setForm({ ...form, openingHours: e.target.value })} placeholder="Opening hours" className="rounded-xl border px-3 py-2 text-sm" />
        <button className="rounded-xl shams-orange btn-glow px-4 py-2 text-sm text-[#101c3f] md:col-span-3">Add store</button>
      </form>
      <div className="mt-4 space-y-2">
        {stores.map((s) => (
          <div key={s.id} className="rounded-2xl bg-white p-3 text-sm">
            <p className="font-semibold">{s.name}</p>
            <p className="text-gray-500">{s.address} · {s.phone} · {s.openingHours}</p>
            <p className="text-gray-400">{s.latitude}, {s.longitude}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
