import type { Metadata, Viewport } from "next";
import { Cormorant_Garamond, Outfit } from "next/font/google";
import "./globals.css";
import { brand } from "@/lib/brand";

const cormorant = Cormorant_Garamond({
  variable: "--font-cormorant",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  display: "swap",
});

const outfit = Outfit({
  variable: "--font-outfit",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600"],
  display: "swap",
});

export const metadata: Metadata = {
  title: `${brand.name} — ${brand.tagline}`,
  description: `${brand.mission} Surprise packages, decorations, gifts and custom experiences, planned with an AI concierge in under three minutes.`,
  keywords: [
    "surprise planner Nigeria",
    "birthday decoration Lagos",
    "hotel room decoration",
    "proposal setup Nigeria",
    "Prettywraps NG",
  ],
  openGraph: {
    title: `${brand.name} — ${brand.tagline}`,
    description: brand.mission,
    type: "website",
  },
};

export const viewport: Viewport = {
  themeColor: "#0e0518",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={`${cormorant.variable} ${outfit.variable} h-full`}>
      <body className="min-h-full">{children}</body>
    </html>
  );
}
