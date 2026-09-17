"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { LayoutDashboard, LogOut, Mail, MapPin, Package, ShoppingBag, Tags } from "lucide-react";

const items = [
  { href: "/admin/dashboard", label: "Dashboard", Icon: LayoutDashboard },
  { href: "/admin/orders", label: "Orders", Icon: ShoppingBag },
  { href: "/admin/products", label: "Products", Icon: Package },
  { href: "/admin/categories", label: "Categories", Icon: Tags },
  { href: "/admin/stores", label: "Stores", Icon: MapPin },
  { href: "/admin/messages", label: "Messages", Icon: Mail },
];

export default function AdminSidebar() {
  const path = usePathname();
  const router = useRouter();

  async function logout() {
    await fetch("/api/admin/logout", { method: "POST" });
    router.push("/admin/login");
  }

  return (
    <aside className="w-full shrink-0 bg-[#101c3f] text-white md:w-60">
      <div className="p-4 font-bold">Mohamed Hamed <span className="block text-xs font-normal text-[#ff6a00]">Admin</span></div>
      <nav className="flex flex-row gap-1 overflow-x-auto p-2 md:flex-col">
        {items.map(({ href, label, Icon }) => (
          <Link
            key={href}
            href={href}
            className={`flex items-center gap-2 rounded-lg px-3 py-2 text-sm whitespace-nowrap ${path.startsWith(href) ? "bg-white/15" : "hover:bg-white/10"}`}
          >
            <Icon size={16} /> {label}
          </Link>
        ))}
        <button onClick={logout} className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm hover:bg-white/10">
          <LogOut size={16} /> Logout
        </button>
      </nav>
    </aside>
  );
}
