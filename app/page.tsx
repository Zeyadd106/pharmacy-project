import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import SearchBar from "@/components/SearchBar";
import CategoryCard from "@/components/CategoryCard";
import ProductCard from "@/components/ProductCard";
import Link from "next/link";
import { MapPin, Phone, ShieldCheck, Truck } from "lucide-react";
import { promises as fs } from "fs";
import path from "path";
import type { Category, Product } from "@/types";

async function getHomeData(): Promise<{
  categories: Category[];
  products: Product[];
}> {
  const raw = await fs.readFile(
    path.join(process.cwd(), "data", "db.json"),
    "utf-8"
  );
  const db = JSON.parse(raw);
  return {
    categories: (db.categories as Category[]).filter((c) => c.active),
    products: (db.products as Product[]).filter((p) => p.active),
  };
}

function Section({
  id,
  title,
  subtitle,
  slug,
  products,
  categories,
}: {
  id: string;
  title: string;
  subtitle: string;
  slug: string;
  products: Product[];
  categories: Category[];
}) {
  const items = products.filter(
    (p) => categories.find((c) => c.id === p.categoryId)?.slug === slug
  );
  if (items.length === 0) return null;
  const catName =
    categories.find((c) => c.slug === slug)?.name ?? title;
  return (
    <section id={id} className="mx-auto mt-12 w-full max-w-7xl px-4">
      <div className="mb-4 flex items-end justify-between">
        <div>
          <h2 className="text-2xl font-bold text-[#273c98]">{title}</h2>
          <span className="mt-1 block h-1 w-12 rounded-full bg-[#ff6a00]" aria-hidden />
          <p className="mt-1 text-sm text-gray-500">{subtitle}</p>
        </div>
        <Link
          href={`/products?category=${slug}`}
          className="rounded-full border border-[#02a9e0]/30 px-4 py-2 text-sm text-[#273c98]"
        >
          View all
        </Link>
      </div>
      <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4">
        {items.slice(0, 4).map((p) => (
          <ProductCard key={p.id} product={p} categoryName={catName} />
        ))}
      </div>
    </section>
  );
}

export default async function Home() {
  const { categories, products } = await getHomeData();
  const catNameOf = (id: string) =>
    categories.find((c) => c.id === id)?.name ?? "";

  return (
    <div className="flex min-h-full flex-col bg-[#f9fafb]">
      <Navbar />
      <main className="flex-1">
        {/* HERO — Shams-style gradient */}
        <section className="shams-gradient text-white">
          <div className="mx-auto grid max-w-7xl gap-8 px-4 py-12 md:py-16">
            <div className="flex max-w-2xl flex-col justify-center">
              <p className="w-fit rounded-full bg-[#ff6a00]/15 px-3 py-1 text-xs text-[#ffb37a]">
                Mohamed Hamed Pharmacy | صيدلية محمد حامد
              </p>
              <h1 className="mt-3 text-3xl font-bold leading-tight sm:text-4xl md:text-5xl">
                Your Health,
                <br />
                <span className="glow-orange text-[#ff6a00]">Our Priority</span>
              </h1>
              <p className="mt-3 max-w-md text-white/80">
                Quality medicines and healthcare products delivered with
                care. Order as a guest — no account needed.
              </p>
              <div className="mt-6">
                <SearchBar />
              </div>
              <div className="mt-6 flex flex-wrap gap-3">
                <Link
                  href="/products"
                  className="btn-glow shams-orange rounded-full px-7 py-3 font-bold text-[#101c3f]"
                >
                  Shop Now
                </Link>
                <Link
                  href="/store-locator"
                  className="flex items-center gap-2 rounded-full border border-white/30 px-6 py-3"
                >
                  <MapPin size={16} /> Find Stores
                </Link>
              </div>
              <div className="mt-6 flex flex-wrap gap-4 text-xs text-white/70">
                <span className="flex items-center gap-1">
                  <Truck size={14} /> Fast ordering
                </span>
                <span className="flex items-center gap-1">
                  <ShieldCheck size={14} /> Pharmacist advice
                </span>
                <span className="flex items-center gap-1">
                  <Phone size={14} /> 01000000000
                </span>
              </div>
            </div>
          </div>
        </section>

        {/* ALL CATEGORIES */}
        <section className="mx-auto mt-10 w-full max-w-7xl px-4">
          <h2 className="text-2xl font-bold text-[#273c98]">
            All Categories
          </h2>
          <span className="mt-1 block h-1 w-12 rounded-full bg-[#ff6a00]" aria-hidden />
          <p className="mt-1 text-sm text-gray-500">
            Medicines, health, beauty, medical, personal & baby care
          </p>
          <div className="mt-4 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6">
            {categories.map((c) => (
              <CategoryCard key={c.id} category={c} />
            ))}
          </div>
        </section>

        {/* PRODUCT SECTIONS per category */}
        <Section
          id="medicines"
          title="Medicines"
          subtitle="Essential treatments — pharmacist advice available"
          slug="medicines"
          products={products}
          categories={categories}
        />
        <Section
          id="health"
          title="Health & Wellness"
          subtitle="Vitamins, supplements and first aid"
          slug="health"
          products={products}
          categories={categories}
        />
        <Section
          id="beauty"
          title="Beauty"
          subtitle="Skin, hair and body care"
          slug="beauty"
          products={products}
          categories={categories}
        />
        <Section
          id="medical"
          title="Medical Products"
          subtitle="Devices, monitors and healthcare accessories"
          slug="medical-products"
          products={products}
          categories={categories}
        />
        <Section
          id="personal"
          title="Personal Care"
          subtitle="Daily hygiene and oral care"
          slug="personal-care"
          products={products}
          categories={categories}
        />
        <Section
          id="baby"
          title="Baby Care"
          subtitle="Diapers, skincare and hygiene for babies"
          slug="baby-care"
          products={products}
          categories={categories}
        />

        {/* DISCLAIMER */}
        <section className="mx-auto mt-12 w-full max-w-7xl px-4">
          <div className="rounded-2xl border border-[#02a9e0]/20 bg-white p-5 text-sm text-gray-600">
            <strong className="text-[#273c98]">Pharmacy notice: </strong>
            Demo products are for development. Prescription medicines
            require a valid prescription and pharmacist verification
            before dispensing. Always follow your doctor/pharmacist advice.
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
