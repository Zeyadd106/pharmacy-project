export default function Loading() {
  return (
    <div className="grid min-h-screen place-items-center bg-[#f9fafb] p-4">
      <div className="w-full max-w-3xl animate-pulse space-y-3">
        <div className="h-10 w-1/3 rounded-full bg-[#273c98]/10" />
        <div className="h-48 rounded-3xl bg-[#273c98]/10" />
        <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
          {[0, 1, 2, 3].map((i) => (
            <div key={i} className="h-40 rounded-2xl bg-white shadow-sm" />
          ))}
        </div>
        <p className="glow-orange text-center text-sm font-bold text-[#ff6a00]">Loading Mohamed Hamed Pharmacy…</p>
      </div>
    </div>
  );
}
