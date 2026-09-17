import type { Metadata } from "next";
import { Cairo, Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { LanguageProvider } from "@/lib/i18n";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

// Shams uses Cairo for Arabic typography
const cairo = Cairo({
  variable: "--font-cairo",
  subsets: ["arabic", "latin"],
});

export const metadata: Metadata = {
  title: {
    default: "Mohamed Hamed Pharmacy | صيدلية محمد حامد",
    template: "%s | Mohamed Hamed Pharmacy",
  },
  description:
    "Mohamed Hamed Pharmacy - Quality medicines, health, beauty, baby care and medical products. Order as a guest, no account needed.",
  keywords: ["pharmacy", "صيدلية", "medicines", "Mohamed Hamed", "beauty", "baby care"],
  openGraph: {
    title: "Mohamed Hamed Pharmacy",
    description: "Your Health, Our Priority — order online as a guest.",
    type: "website",
  },
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} ${cairo.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        <LanguageProvider>{children}</LanguageProvider>
      </body>
    </html>
  );
}
