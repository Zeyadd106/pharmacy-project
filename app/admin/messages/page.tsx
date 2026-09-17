"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import type { ContactMessage } from "@/types";

export default function AdminMessages() {
  const router = useRouter();
  const [msgs, setMsgs] = useState<ContactMessage[]>([]);

  async function load() {
    const r = await fetch("/api/admin/manage");
    if (r.status === 401) {
      router.push("/admin/login");
      return;
    }
    setMsgs((await r.json()).messages);
  }

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function setStatus(id: string, status: ContactMessage["status"]) {
    await fetch("/api/admin/manage", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ kind: "message-status", id, status }),
    });
    load();
  }

  return (
    <div>
      <h1 className="text-2xl font-bold text-[#273c98]">Contact Messages</h1>
      <div className="mt-4 space-y-2">
        {msgs.map((m) => (
          <div key={m.id} className="rounded-2xl bg-white p-4 text-sm">
            <p className="font-semibold">{m.name} · {m.phone} · {m.status}</p>
            <p className="text-gray-500">{m.email}</p>
            <p className="mt-1">{m.message}</p>
            <div className="mt-2 flex gap-2">
              <button onClick={() => setStatus(m.id, "READ")} className="rounded-full border px-3 py-1 text-xs">Mark read</button>
              <button onClick={() => setStatus(m.id, "HANDLED")} className="rounded-full border px-3 py-1 text-xs">Mark handled</button>
            </div>
          </div>
        ))}
        {msgs.length === 0 && <p className="rounded-2xl bg-white p-6 text-center text-gray-500">No messages.</p>}
      </div>
    </div>
  );
}
