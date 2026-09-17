import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ProductCard from "@/components/ProductCard";
import AddToCartBox from "./AddToCartBox";
import { Pill } from "lucide-react";
import { promises as fs } from "fs";
import path from "path";
import { notFound } from "next/navigation";
import type { Category, Product } from "@/types";

async function load(slug: string) {
  const raw = await fs.readFile(path.join(process.cwd(), "data", "db.json"), "utf-8");
  const db = JSON.parse(raw);
  const categories = db.categories as Category[];
  const products = db.products as Product[];
  const product = products.find((p) => p.slug === slug && p.active);
  if (!product) return null;
  const category = categories.find((c) => c.id === product.categoryId);
  const related = products
    .filter((p) => p.categoryId === product.categoryId && p.id !== product.id && p.active)
    .slice(0, 4);
  return { product, category, related };
}

export default async function ProductDetails({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const data = await load(slug);
  if (!data) notFound();
  const { product, category, related } = data;

  return (
    <div className="flex min-h-full flex-col bg-[#f9fafb]">
      <Navbar />
      <main className="mx-auto w-full max-w-7xl flex-1 px-4 py-8">
        <div className="grid gap-8 rounded-3xl bg-white p-6 md:grid-cols-2 md:p-10">
          <div className="grid h-72 place-items-center rounded-2xl bg-[#ff6a00]/30 md:h-96">
            <Pill size={80} className="text-[#02a9e0]" />
          </div>
          <div>
            <p className="text-sm text-[#02a9e0]">{category?.name}</p>
            <h1 className="mt-1 text-3xl font-bold text-[#273c98]">{product.name}</h1>
            <p className="text-sm text-gray-500">{product.nameAr}</p>
            <p className="mt-4 text-gray-600">{product.description}</p>
            <p className="mt-4 text-3xl font-bold text-[#273c98]">
              {product.price} <span className="text-base font-normal">EGP</span>
            </p>
            <p className="mt-1 text-sm text-gray-500">
              {product.stock > 0 ? `In stock: ${product.stock}` : "Out of stock"}
            </p>
            {product.requiresPrescription && (
              <p className="mt-2 rounded-xl bg-yellow-50 p-3 text-sm text-yellow-800">
                Requires a valid prescription — pharmacist will verify before dispensing.
              </p>
            )}
            <AddToCartBox productId={product.id} stock={product.stock} />
          </div>
        </div>

        {related.length > 0 && (
          <section className="mt-10">
            <h2 className="text-xl font-bold text-[#273c98]">Related products</h2>
            <div className="mt-4 grid grid-cols-2 gap-4 md:grid-cols-4">
              {related.map((p) => (
                <ProductCard key={p.id} product={p} categoryName={category?.name ?? ""} />
              ))}
            </div>
          </section>
        )}
      </main>
      <Footer />
    </div>
  );
}
