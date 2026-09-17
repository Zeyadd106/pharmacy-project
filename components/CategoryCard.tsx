"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Baby, HeartPulse, Pill, Sparkles, Stethoscope, ShowerHead } from "lucide-react";
import type { Category } from "@/types";

const icons: Record<string, typeof Pill> = {
  medicines: Pill,
  health: HeartPulse,
  beauty: Sparkles,
  "medical-products": Stethoscope,
  "personal-care": ShowerHead,
  "baby-care": Baby,
};

export default function CategoryCard({ category }: { category: Category }) {
  const Icon = icons[category.slug] ?? Pill;
  return (
    <motion.div whileHover={{ y: -4, scale: 1.02 }} transition={{ duration: 0.2 }}>
      <Link
        href={`/products?category=${category.slug}`}
        className="flex flex-col items-center gap-2 rounded-2xl bg-white p-5 text-center shadow-sm ring-1 ring-black/5 transition hover:shadow-lg"
      >
        <span className="grid h-14 w-14 place-items-center rounded-full bg-[#273c98]/10 text-[#273c98]">
          <Icon size={26} />
        </span>
        <span className="font-semibold text-[#273c98]">{category.name}</span>
        <span className="text-xs text-gray-500">{category.nameAr}</span>
        <span className="line-clamp-1 text-xs text-gray-400">
          {category.description}
        </span>
      </Link>
    </motion.div>
  );
}
