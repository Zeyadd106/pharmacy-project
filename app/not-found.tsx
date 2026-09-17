import Link from "next/link";

export default function NotFound() {
  return (
    <div className="grid min-h-screen place-items-center bg-[#f9fafb] p-4">
      <div className="rounded-3xl bg-white p-10 text-center">
        <h1 className="text-4xl font-bold text-[#273c98]">404</h1>
        <p className="mt-2 text-gray-500">Page not found.</p>
        <Link href="/" className="mt-5 inline-block rounded-full shams-orange btn-glow px-6 py-2 text-sm text-[#101c3f]">
          Back to Home
        </Link>
      </div>
    </div>
  );
}
