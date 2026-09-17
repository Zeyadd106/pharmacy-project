"use client";

import Link from "next/link";
import { Heart, Menu, Pill, ShoppingCart, X } from "lucide-react";
import { useEffect, useState } from "react";
import { useLang } from "@/lib/i18n";
import { cartCount } from "@/lib/cart";
import { getFavorites } from "@/lib/favorites";

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const [cartN, setCartN] = useState(0);
  const [favN, setFavN] = useState(0);
  const { t, lang, toggle } = useLang();

  // Live badge counts — update whenever cart/favorites change anywhere
  useEffect(() => {
    const refresh = () => {
      setCartN(cartCount());
      setFavN(getFavorites().length);
    };
    refresh();
    window.addEventListener("mh-cart-changed", refresh);
    window.addEventListener("mh-fav-changed", refresh);
    return () => {
      window.removeEventListener("mh-cart-changed", refresh);
      window.removeEventListener("mh-fav-changed", refresh);
    };
  }, []);
  const links = [
    { href: "/", label: t.home },
    { href: "/categories", label: t.categories },
    { href: "/products", label: t.products },
    { href: "/store-locator", label: t.storeLocator },
    { href: "/contact", label: t.contact },
  ];

  return (
    <header className="sticky top-0 z-50 border-t-4 border-[#ff6a00] bg-[#101c3f] text-white shadow-md">
      <div className="mx-auto flex max-w-7xl items-center gap-1 px-2 py-3 sm:gap-3 sm:px-4">
        <Link href="/" className="flex items-center gap-2 text-base font-bold sm:text-lg">
          <span className="btn-glow grid h-9 w-9 place-items-center rounded-full bg-[#ff6a00] text-[#101c3f]">
            <Pill size={20} />
          </span>
          <span>
            Mohamed Hamed
            <span className="glow-orange block text-xs font-normal text-[#ff6a00]">
              Pharmacy | صيدلية محمد حامد
            </span>
          </span>
        </Link>

        <nav className="ml-6 hidden items-center gap-5 lg:flex" aria-label="Main">
          {links.map((l) => (
            <Link key={l.href} href={l.href} className="text-sm hover:text-[#ff6a00]">
              {l.label}
            </Link>
          ))}
        </nav>

        <div className="ml-auto flex items-center gap-2">
          <Link href="/products" aria-label="Search" className="rounded-full p-2 hover:bg-white/10">
            <span className="sr-only">Search</span>
            <span aria-hidden>⌕</span>
          </Link>
          <Link href="/favorites" aria-label={`Favorites (${favN})`} className="relative rounded-full p-2 hover:bg-white/10">
            <Heart size={20} />
            {favN > 0 && (
              <span className="absolute -right-0.5 -top-0.5 grid h-5 min-w-5 place-items-center rounded-full bg-red-500 px-1 text-[11px] font-bold text-white">
                {favN}
              </span>
            )}
          </Link>
          <Link href="/cart" aria-label={`Cart (${cartN})`} className="relative rounded-full p-2 hover:bg-white/10">
            <ShoppingCart size={20} />
            {cartN > 0 && (
              <span className="btn-glow absolute -right-0.5 -top-0.5 grid h-5 min-w-5 place-items-center rounded-full bg-[#ff6a00] px-1 text-[11px] font-bold text-[#101c3f]">
                {cartN}
              </span>
            )}
          </Link>
          <button
            onClick={toggle}
            aria-label="Switch language"
            className="hidden rounded-full bg-white/10 px-3 py-1.5 text-sm sm:block"
          >
            {lang === "en" ? "عربي" : "EN"}
          </button>
          <button
            aria-label="Menu"
            className="rounded-full p-2 hover:bg-white/10 lg:hidden"
            onClick={() => setOpen(!open)}
          >
            {open ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </div>

      {open && (
        <nav className="border-t border-white/10 px-4 py-3 lg:hidden" aria-label="Mobile">
          <div className="flex flex-col gap-3">
            {links.map((l) => (
              <Link
                key={l.href}
                href={l.href}
                onClick={() => setOpen(false)}
                className="rounded-lg px-2 py-2 hover:bg-white/10"
              >
                {l.label}
              </Link>
            ))}
          </div>
        </nav>
      )}
    </header>
  );
}
