"use client";

import { useRouter } from "next/navigation";
import { Search, X } from "lucide-react";
import { useState } from "react";

export default function SearchBar() {
  const [q, setQ] = useState("");
  const router = useRouter();

  return (
    <form
      role="search"
      onSubmit={(e) => {
        e.preventDefault();
        router.push(`/products?q=${encodeURIComponent(q.trim())}`);
      }}
      className="flex w-full max-w-xl items-center gap-2 rounded-full bg-white p-2 pl-4 shadow-lg ring-1 ring-black/5"
    >
      <Search size={18} className="shrink-0 text-[#02a9e0]" />
      <label htmlFor="home-search" className="sr-only">
        Search products
      </label>
      <input
        id="home-search"
        value={q}
        onChange={(e) => setQ(e.target.value)}
        placeholder="Search Panadol, vitamins, baby care…"
        className="w-full bg-transparent text-sm text-[#273c98] outline-none placeholder:text-gray-400"
      />
      {q && (
        <button
          type="button"
          aria-label="Clear search"
          onClick={() => setQ("")}
          className="rounded-full p-1 hover:bg-gray-100"
        >
          <X size={16} />
        </button>
      )}
      <button
        type="submit"
        className="shrink-0 rounded-full shams-orange btn-glow px-5 py-2 text-sm font-semibold text-[#101c3f]"
      >
        Search
      </button>
    </form>
  );
}
