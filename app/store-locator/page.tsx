import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { MapPin, Navigation, Phone } from "lucide-react";
import { promises as fs } from "fs";
import path from "path";
import type { Store } from "@/types";

export const metadata = {
  title: "Store Locator",
  description: "Find Mohamed Hamed Pharmacy branches near you with Google Maps directions.",
};

export default async function StoreLocatorPage() {
  const raw = await fs.readFile(path.join(process.cwd(), "data", "db.json"), "utf-8");
  const stores = ((JSON.parse(raw).stores as Store[]) ?? []).filter((s) => s.active !== false);

  return (
    <div className="flex min-h-full flex-col bg-[#f9fafb]">
      <Navbar />
      <main className="mx-auto w-full max-w-7xl flex-1 px-4 py-8">
        <h1 className="text-3xl font-bold text-[#273c98]">Store Locator</h1>
        <p className="text-sm text-gray-500">Find our branches — tap Get Directions to open Google Maps.</p>

        <div className="mt-6 grid gap-4 md:grid-cols-2">
          {stores.map((s) => (
            <article key={s.id} className="overflow-hidden rounded-2xl bg-white shadow-sm">
              {/* No API key needed: standard Google Maps embed. For the JS API, see README. */}
              <iframe
                title={`Map of ${s.name}`}
                src={`https://www.google.com/maps?q=${s.latitude},${s.longitude}&output=embed`}
                className="h-56 w-full border-0"
                loading="lazy"
              />
              <div className="p-5">
                <h2 className="font-bold text-[#273c98]">{s.name}</h2>
                <p className="mt-1 flex items-start gap-1 text-sm text-gray-600">
                  <MapPin size={15} className="mt-0.5 shrink-0" /> {s.address}
                </p>
                <p className="mt-1 flex items-center gap-1 text-sm text-gray-600">
                  <Phone size={15} /> {s.phone} · {s.openingHours}
                </p>
                <a
                  href={`https://www.google.com/maps/dir/?api=1&destination=${s.latitude},${s.longitude}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-3 inline-flex items-center gap-1 rounded-full shams-orange btn-glow px-5 py-2 text-sm font-semibold text-[#101c3f]"
                >
                  <Navigation size={15} /> Get Directions
                </a>
              </div>
            </article>
          ))}
        </div>
        {stores.length === 0 && (
          <p className="mt-8 rounded-2xl bg-white p-8 text-center text-gray-500">No branches yet.</p>
        )}
      </main>
      <Footer />
    </div>
  );
}
