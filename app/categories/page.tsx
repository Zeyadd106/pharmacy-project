import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import CategoryCard from "@/components/CategoryCard";
import { promises as fs } from "fs";
import path from "path";
import type { Category } from "@/types";

export default async function CategoriesPage() {
  const raw = await fs.readFile(path.join(process.cwd(), "data", "db.json"), "utf-8");
  const categories = ((JSON.parse(raw).categories as Category[]) ?? []).filter((c) => c.active);
  return (
    <div className="flex min-h-full flex-col bg-[#f9fafb]">
      <Navbar />
      <main className="mx-auto w-full max-w-7xl flex-1 px-4 py-8">
        <h1 className="text-3xl font-bold text-[#273c98]">All Categories</h1>
        <div className="mt-6 grid grid-cols-2 gap-4 sm:grid-cols-3">
          {categories.map((c) => (
            <CategoryCard key={c.id} category={c} />
          ))}
        </div>
      </main>
      <Footer />
    </div>
  );
}
