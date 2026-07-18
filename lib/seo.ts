import { brand } from "./brand";
import { formatNaira, packages } from "./catalog";

/**
 * Canonical site URL. Set NEXT_PUBLIC_SITE_URL to your real domain once it's
 * live — it drives canonical tags, the sitemap, and social share images.
 */
export const siteUrl = (
  process.env.NEXT_PUBLIC_SITE_URL ?? "https://prettywrapsng.com"
).replace(/\/$/, "");

/**
 * Structured data so Google can show Prettywraps as a real local business with
 * a service catalogue, rather than just a page of text.
 *
 * Note: no ratings or review counts are declared here. Those must reflect
 * genuine customer reviews — inventing them breaks Google's guidelines and can
 * get the site penalised. Add them only when they're real.
 */
export function structuredData() {
  const business = {
    "@type": "LocalBusiness",
    "@id": `${siteUrl}/#business`,
    name: brand.name,
    description: brand.mission,
    slogan: brand.tagline,
    url: siteUrl,
    image: `${siteUrl}/logo.jpg`,
    logo: `${siteUrl}/logo.jpg`,
    telephone: `+${brand.whatsappNumber}`,
    founder: { "@type": "Person", name: brand.founder },
    priceRange: `${formatNaira(Math.min(...packages.map((p) => p.price)))}–${formatNaira(
      Math.max(...packages.map((p) => p.price)),
    )}`,
    currenciesAccepted: "NGN",
    address: { "@type": "PostalAddress", addressCountry: "NG" },
    areaServed: brand.serviceAreas.map((area) => ({
      "@type": "Place",
      name: area,
    })),
    sameAs: [brand.instagramUrl],
    hasOfferCatalog: {
      "@type": "OfferCatalog",
      name: "Surprise packages",
      itemListElement: packages.map((pkg) => ({
        "@type": "Offer",
        name: pkg.name,
        description: pkg.tagline,
        price: pkg.price,
        priceCurrency: "NGN",
        itemOffered: {
          "@type": "Service",
          name: pkg.name,
          description: pkg.includes.join(". "),
          serviceType: "Event decoration and surprise planning",
        },
      })),
    },
  };

  const website = {
    "@type": "WebSite",
    "@id": `${siteUrl}/#website`,
    url: siteUrl,
    name: brand.name,
    description: brand.mission,
    publisher: { "@id": `${siteUrl}/#business` },
    inLanguage: "en-NG",
  };

  return { "@context": "https://schema.org", "@graph": [business, website] };
}
