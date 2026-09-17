"use client";

import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { useState } from "react";

export default function ContactPage() {
  const [form, setForm] = useState({ name: "", phone: "", email: "", message: "" });
  const [status, setStatus] = useState("");
  const [loading, setLoading] = useState(false);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setStatus("");
    setLoading(true);
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const d = await res.json();
      if (!res.ok) {
        setStatus(d.error || "Failed to send.");
        return;
      }
      setStatus("Message sent! We will contact you soon. ✓");
      setForm({ name: "", phone: "", email: "", message: "" });
    } catch {
      setStatus("Network error.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex min-h-full flex-col bg-[#f9fafb]">
      <Navbar />
      <main className="mx-auto w-full max-w-5xl flex-1 px-4 py-8">
        <h1 className="text-3xl font-bold text-[#273c98]">Contact Us</h1>
        <div className="mt-6 grid gap-6 md:grid-cols-2">
          <div className="rounded-2xl bg-white p-6 text-sm">
            <h2 className="font-bold text-[#273c98]">Pharmacy info</h2>
            <p className="mt-2">Phone: 01000000000</p>
            <p>Email: info@mohamedhamed.com</p>
            <p>Address: Main Street, Cairo, Egypt</p>
            <iframe
              title="Pharmacy location map"
              src="https://www.google.com/maps?q=30.0884225,31.3030675&output=embed"
              className="mt-4 h-48 w-full rounded-xl border-0"
              loading="lazy"
            />
          </div>
          <form onSubmit={submit} className="rounded-2xl bg-white p-6">
            <label className="block text-sm font-medium">Name *</label>
            <input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className="mt-1 w-full rounded-xl border px-3 py-2 text-sm" required />
            <label className="mt-3 block text-sm font-medium">Phone *</label>
            <input value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} className="mt-1 w-full rounded-xl border px-3 py-2 text-sm" required />
            <label className="mt-3 block text-sm font-medium">Email</label>
            <input value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} type="email" className="mt-1 w-full rounded-xl border px-3 py-2 text-sm" />
            <label className="mt-3 block text-sm font-medium">Message *</label>
            <textarea value={form.message} onChange={(e) => setForm({ ...form, message: e.target.value })} className="mt-1 w-full rounded-xl border px-3 py-2 text-sm" rows={4} required />
            {status && <p className="mt-3 text-sm text-green-700">{status}</p>}
            <button disabled={loading} className="mt-4 w-full rounded-full shams-orange btn-glow py-3 text-sm font-semibold text-[#101c3f] disabled:opacity-50">
              {loading ? "Sending…" : "Send Message"}
            </button>
          </form>
        </div>
      </main>
      <Footer />
    </div>
  );
}
