"use client";

import { createContext, useContext, useEffect, useState } from "react";

type Lang = "en" | "ar";

const dict = {
  en: {
    home: "Home",
    categories: "Categories",
    products: "Products",
    storeLocator: "Store Locator",
    contact: "Contact Us",
    shopNow: "Shop Now",
    findStores: "Find Stores",
    searchPlaceholder: "Search Panadol, vitamins, baby care…",
  },
  ar: {
    home: "الرئيسية",
    categories: "الأقسام",
    products: "المنتجات",
    storeLocator: "فروعنا",
    contact: "اتصل بنا",
    shopNow: "تسوق الآن",
    findStores: "اعثر على الفروع",
    searchPlaceholder: "ابحث عن بنادول، فيتامينات، عناية أطفال…",
  },
} as const;

const Ctx = createContext<{
  lang: Lang;
  t: (typeof dict)[Lang];
  toggle: () => void;
}>({ lang: "en", t: dict.en, toggle: () => {} });

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [lang, setLang] = useState<Lang>("en");

  useEffect(() => {
    const saved = localStorage.getItem("mh-lang") as Lang | null;
    if (saved === "ar" || saved === "en") setLang(saved);
  }, []);

  useEffect(() => {
    document.documentElement.lang = lang;
    document.documentElement.dir = lang === "ar" ? "rtl" : "ltr";
    localStorage.setItem("mh-lang", lang);
  }, [lang]);

  return (
    <Ctx.Provider
      value={{ lang, t: dict[lang], toggle: () => setLang(lang === "en" ? "ar" : "en") }}
    >
      {children}
    </Ctx.Provider>
  );
}

export function useLang() {
  return useContext(Ctx);
}
