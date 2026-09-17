"use client";

import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ProductCard from "@/components/ProductCard";
import Link from "next/link";
import { useEffect, useState } from "react";
import type { Product } from "@/types";
import { getFavorites } from "@/lib/favorites";

export default function FavoritesPage() {
  const [products, setProducts] = useState<Product[]>([]);

  useEffect(() => {
    const favs = getFavorites();
    fetch("/api/products")
      .then((r) => r.json())
      .then((d) =>
        setProducts((d.products as Product[]).filter((p) => favs.includes(p.id)))
      );
  }, []);

  return (
    <div className="flex min-h-full flex-col bg-[#f9fafb]">
      <Navbar />
      <main className="mx-auto w-full max-w-7xl flex-1 px-4 py-8">
        <h1 className="text-3xl font-bold text-[#273c98]">Favorites</h1>
        <p className="text-sm text-gray-500">Saved in your browser (no account needed).</p>
        {products.length === 0 ? (
          <div className="mt-8 rounded-2xl bg-white p-10 text-center">
            <p className="font-semibold">No favorites yet</p>
            <Link href="/products" className="mt-4 inline-block rounded-full shams-orange btn-glow px-6 py-2 text-sm text-[#101c3f]">
              Browse products
            </Link>
          </div>
        ) : (
          <div className="mt-6 grid grid-cols-2 gap-4 md:grid-cols-4">
            {products.map((p) => (
              <ProductCard key={p.id} product={p} categoryName="" />
            ))}
          </div>
        )}
      </main>
      <Footer />
    </div>
  );
}
