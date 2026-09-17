"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

export default function AdminLogin() {
  const router = useRouter();
  const [email, setEmail] = useState("admin@mohamedhamed.com");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const res = await fetch("/api/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Login failed");
        return;
      }
      router.push("/admin/dashboard");
    } catch {
      setError("Network error");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="grid min-h-screen place-items-center bg-[#101c3f] p-4">
      <form onSubmit={submit} className="w-full max-w-sm rounded-3xl bg-white p-8">
        <h1 className="text-2xl font-bold text-[#273c98]">Admin Login</h1>
        <p className="text-sm text-gray-500">Mohamed Hamed Pharmacy — staff only</p>
        <label className="mt-4 block text-sm font-medium">Email</label>
        <input value={email} onChange={(e) => setEmail(e.target.value)} type="email" className="mt-1 w-full rounded-xl border px-3 py-2" />
        <label className="mt-3 block text-sm font-medium">Password</label>
        <input value={password} onChange={(e) => setPassword(e.target.value)} type="password" className="mt-1 w-full rounded-xl border px-3 py-2" />
        {error && <p className="mt-3 rounded-xl bg-red-50 p-2 text-sm text-red-600">{error}</p>}
        <button disabled={loading} className="btn-glow shams-orange mt-5 w-full rounded-full py-3 font-semibold text-[#101c3f] disabled:opacity-50">
          {loading ? "Signing in…" : "Sign In"}
        </button>
      </form>
    </div>
  );
}
