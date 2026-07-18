import type { Metadata, Viewport } from "next";
import { Cormorant_Garamond, Outfit } from "next/font/google";
import "./globals.css";
import { brand } from "@/lib/brand";
import { siteUrl, structuredData } from "@/lib/seo";

const cormorant = Cormorant_Garamond({
  variable: "--font-cormorant",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  display: "swap",
  // Keeps the fallback close in size so the headline doesn't jump when the
  // display font arrives — noticeable on slow mobile connections.
  adjustFontFallback: true,
});

const outfit = Outfit({
  variable: "--font-outfit",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600"],
  display: "swap",
  adjustFontFallback: true,
});

const title = `${brand.name} | Surprise & Birthday Decoration in Lagos, Abuja & Port Harcourt`;
const description =
  "Plan an unforgettable surprise in under 3 minutes. Birthday room decorations, balloon setups, proposals, flowers, cakes and gift boxes across Nigeria — get an instant quote from our AI concierge and book on WhatsApp.";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: title,
    template: `%s | ${brand.name}`,
  },
  description,
  applicationName: brand.name,
  authors: [{ name: brand.founder }],
  creator: brand.founder,
  publisher: brand.name,
  keywords: [
    "surprise planner Nigeria",
    "birthday decoration Lagos",
    "hotel room decoration Lagos",
    "balloon decoration Abuja",
    "proposal setup Nigeria",
    "romantic surprise Lagos",
    "gift delivery Nigeria",
    "birthday surprise Port Harcourt",
    "gender reveal decoration Nigeria",
    "Prettywraps NG",
  ],
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    locale: "en_NG",
    url: siteUrl,
    siteName: brand.name,
    title,
    description,
  },
  twitter: {
    card: "summary_large_image",
    title,
    description,
  },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true, "max-image-preview": "large" },
  },
  category: "Event Planning",
  formatDetection: {
    // Nigerian numbers get mangled by iOS auto-detection; we link them ourselves.
    telephone: false,
  },
};

export const viewport: Viewport = {
  themeColor: "#0e0518",
  width: "device-width",
  initialScale: 1,
  // Lets the layout extend under the notch / home indicator on modern phones.
  viewportFit: "cover",
  // Deliberately not restricting zoom — pinch-to-zoom must stay available.
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html
      lang="en-NG"
      className={`${cormorant.variable} ${outfit.variable} h-full`}
    >
      <head>
        <script
          type="application/ld+json"
          // Structured data is generated from our own catalogue, not user input.
          dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData()) }}
        />
      </head>
      <body className="min-h-full">{children}</body>
    </html>
  );
}
