import Link from "next/link";

export default function Footer() {
  return (
    <footer className="mt-12 border-t-4 border-[#ff6a00] bg-[#101c3f] text-white">
      <div className="mx-auto grid max-w-7xl gap-8 px-4 py-10 sm:grid-cols-3">
        <div>
          <h3 className="font-bold">
            Mohamed Hamed <span className="glow-orange text-[#ff6a00]">Pharmacy</span>
          </h3>
          <p className="mt-1 text-xs text-white/60">صيدلية د / محمد حامد</p>
          <p className="mt-2 text-sm text-white/80">
            Quality medicines and healthcare products delivered with care.
          </p>
        </div>
        <div>
          <h4 className="font-semibold">Links</h4>
          <div className="mt-2 flex flex-col gap-1 text-sm text-white/80">
            <Link href="/products">Products</Link>
            <Link href="/categories">Categories</Link>
            <Link href="/store-locator">Store Locator</Link>
            <Link href="/contact">Contact Us</Link>
          </div>
        </div>
        <div>
          <h4 className="font-semibold">Contact</h4>
          <p className="mt-2 text-sm text-white/80">
            Phone: 01000000000
            <br />
            Email: info@mohamedhamed.com
            <br />
            Cairo, Egypt
          </p>
        </div>
      </div>
      <div className="border-t border-white/10 py-4 text-center text-xs text-white/60">
        © 2026 Mohamed Hamed Pharmacy. All rights reserved.
      </div>
    </footer>
  );
}
