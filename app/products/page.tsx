import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ProductCard from "@/components/ProductCard";
import Link from "next/link";
import { promises as fs } from "fs";
import path from "path";
import type { Category, Product } from "@/types";

async function load() {
  const raw = await fs.readFile(path.join(process.cwd(), "data", "db.json"), "utf-8");
  const db = JSON.parse(raw);
  return {
    categories: (db.categories as Category[]).filter((c) => c.active),
    products: (db.products as Product[]).filter((p) => p.active),
  };
}

export default async function ProductsPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string; category?: string }>;
}) {
  const { q = "", category = "" } = await searchParams;
  const { categories, products } = await load();
  const catById = new Map(categories.map((c) => [c.id, c]));
  const query = q.toLowerCase().trim();

  let list = products;
  if (category) {
    const cat = categories.find((c) => c.slug === category);
    if (cat) list = list.filter((p) => p.categoryId === cat.id);
  }
  if (query) {
    list = list.filter((p) => {
      const cat = catById.get(p.categoryId);
      return (
        p.name.toLowerCase().includes(query) ||
        p.description.toLowerCase().includes(query) ||
        (cat?.name.toLowerCase().includes(query) ?? false)
      );
    });
  }

  return (
    <div className="flex min-h-full flex-col bg-[#f9fafb]">
      <Navbar />
      <main className="mx-auto w-full max-w-7xl flex-1 px-4 py-8">
        <h1 className="text-3xl font-bold text-[#273c98]">Products</h1>
        {q && <p className="mt-1 text-sm text-gray-500">Results for “{q}” ({list.length})</p>}

        <div className="mt-4 flex flex-wrap gap-2">
          <Link
            href="/products"
            className={`rounded-full px-4 py-2 text-sm ${!category ? "shams-orange btn-glow text-[#101c3f]" : "bg-white text-[#273c98]"}`}
          >
            All
          </Link>
          {categories.map((c) => (
            <Link
              key={c.id}
              href={`/products?category=${c.slug}${q ? `&q=${encodeURIComponent(q)}` : ""}`}
              className={`rounded-full px-4 py-2 text-sm ${category === c.slug ? "shams-orange btn-glow text-[#101c3f]" : "bg-white text-[#273c98]"}`}
            >
              {c.name}
            </Link>
          ))}
        </div>

        {list.length === 0 ? (
          <div className="mt-10 rounded-2xl bg-white p-10 text-center">
            <p className="font-semibold text-[#273c98]">No products found</p>
            <p className="mt-1 text-sm text-gray-500">Try another search or category.</p>
            <Link href="/products" className="mt-4 inline-block rounded-full shams-orange btn-glow px-6 py-2 text-sm text-[#101c3f]">
              Clear search
            </Link>
          </div>
        ) : (
          <div className="mt-6 grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4">
            {list.map((p) => (
              <ProductCard key={p.id} product={p} categoryName={catById.get(p.categoryId)?.name ?? ""} />
            ))}
          </div>
        )}
      </main>
      <Footer />
    </div>
  );
}
