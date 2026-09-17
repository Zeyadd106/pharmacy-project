"use client";

const KEY = "mh-favorites";

export function getFavorites(): string[] {
  if (typeof window === "undefined") return [];
  try {
    return JSON.parse(localStorage.getItem(KEY) || "[]");
  } catch {
    return [];
  }
}

export function isFavorite(id: string): boolean {
  return getFavorites().includes(id);
}

export function toggleFavorite(id: string): string[] {
  const favs = getFavorites();
  const next = favs.includes(id)
    ? favs.filter((f) => f !== id)
    : [...favs, id];
  localStorage.setItem(KEY, JSON.stringify(next));
  window.dispatchEvent(new Event("mh-fav-changed"));
  return next;
}
