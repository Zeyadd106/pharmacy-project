"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Heart, ShoppingCart } from "lucide-react";
import { addToCart } from "@/lib/cart";
import { isFavorite, toggleFavorite } from "@/lib/favorites";

export default function AddToCartBox({
  productId,
  stock,
}: {
  productId: string;
  stock: number;
}) {
  const [qty, setQty] = useState(1);
  const [fav, setFav] = useState(() => isFavorite(productId));
  const router = useRouter();

  return (
    <div className="mt-6">
      <div className="flex items-center gap-3">
        <div className="flex items-center rounded-full border">
          <button
            aria-label="Decrease quantity"
            className="px-4 py-2"
            onClick={() => setQty(Math.max(1, qty - 1))}
          >
            −
          </button>
          <span className="w-8 text-center font-semibold">{qty}</span>
          <button
            aria-label="Increase quantity"
            className="px-4 py-2"
            onClick={() => setQty(Math.min(stock || 1, qty + 1))}
          >
            +
          </button>
        </div>
        <button
          aria-label="Toggle favorite"
          onClick={() => setFav(toggleFavorite(productId).includes(productId))}
          className={`rounded-full p-3 ${fav ? "bg-red-500 text-white" : "bg-gray-100 text-[#273c98]"}`}
        >
          <Heart size={18} fill={fav ? "currentColor" : "none"} />
        </button>
      </div>
      <button
        disabled={stock <= 0}
        onClick={() => {
          addToCart(productId, qty);
          router.push("/cart");
        }}
        className="shams-orange mt-4 flex w-full items-center justify-center gap-2 rounded-full py-3 font-bold text-[#101c3f] disabled:opacity-40"
      >
        <ShoppingCart size={18} /> Add to Cart
      </button>
    </div>
  );
}
