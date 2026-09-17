"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Heart, Pill, ShoppingCart } from "lucide-react";
import { useEffect, useState } from "react";
import type { Product } from "@/types";
import { addToCart } from "@/lib/cart";
import { isFavorite, toggleFavorite } from "@/lib/favorites";

export default function ProductCard({
  product,
  categoryName,
}: {
  product: Product;
  categoryName: string;
}) {
  const [fav, setFav] = useState(false);
  const [added, setAdded] = useState(false);
  const router = useRouter();
  const outOfStock = product.stock <= 0;

  useEffect(() => {
    setFav(isFavorite(product.id));
  }, [product.id]);

  return (
    <motion.article
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.35 }}
      className="flex flex-col overflow-hidden rounded-2xl bg-white shadow-sm ring-1 ring-black/5 transition hover:shadow-lg"
    >
      <div className="relative">
        <Link
          href={`/products/${product.slug}`}
          aria-label={`View details of ${product.name}`}
          className="group grid h-40 place-items-center bg-[#273c98]/[.07]"
        >
          <Pill
            size={48}
            className="text-[#273c98]/40 transition group-hover:scale-110 group-hover:text-[#273c98]/60"
            aria-hidden
          />
        </Link>
        <button
          aria-label={fav ? "Remove from favorites" : "Add to favorites"}
          onClick={() => setFav(toggleFavorite(product.id).includes(product.id))}
          className={`absolute right-3 top-3 rounded-full p-2 shadow ${
            fav ? "bg-red-500 text-white" : "bg-white text-[#273c98]"
          }`}
        >
          <Heart size={16} fill={fav ? "currentColor" : "none"} />
        </button>
        {outOfStock && (
          <span className="absolute left-3 top-3 rounded-full bg-red-600 px-2 py-1 text-xs text-white">
            Out of stock
          </span>
        )}
      </div>

      <div className="flex flex-1 flex-col gap-1 p-4">
        <p className="text-xs font-medium text-[#02a9e0]">{categoryName}</p>
        <Link href={`/products/${product.slug}`} className="hover:underline">
          <h3 className="line-clamp-2 font-semibold text-[#273c98]">
            {product.name}
          </h3>
        </Link>
        <p className="text-lg font-bold text-[#273c98]">
          {product.price} <span className="text-sm font-normal">EGP</span>
        </p>
        <p className="text-xs text-gray-500">
          {outOfStock ? "Unavailable" : `In stock: ${product.stock}`}
        </p>
        <div className="mt-3 flex flex-col gap-2 min-[480px]:flex-row">
          <button
            disabled={outOfStock}
            onClick={() => {
              addToCart(product.id, 1);
              setAdded(true);
              router.push("/cart");
            }}
            className="shams-orange flex flex-1 items-center justify-center gap-1 rounded-full px-3 py-2 text-sm font-bold text-[#101c3f] disabled:opacity-40"
          >
            <ShoppingCart size={15} />
            {added ? "Added ✓" : "Add to Cart"}
          </button>
          <Link
            href={`/products/${product.slug}`}
            className="rounded-full border border-[#02a9e0]/30 px-3 py-2 text-sm text-[#273c98]"
          >
            Details
          </Link>
        </div>
      </div>
    </motion.article>
  );
}
