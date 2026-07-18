/**
 * Prettywraps NG — brand constants.
 * Single source of truth for identity, contact channels, and social links.
 */

export const brand = {
  name: "Prettywraps NG",
  founder: "Judith Anadumaka",
  tagline: "Don't just say Happy Birthday. Create unforgettable memories.",
  mission:
    "Turn birthdays and special moments into unforgettable experiences.",

  /** WhatsApp number in international format, digits only (for wa.me links). */
  whatsappNumber: "2348138630863",
  whatsappDisplay: "+234 813 863 0863",

  instagramHandle: "prettywraps_ng",
  instagramUrl: "https://www.instagram.com/prettywraps_ng/",

  /**
   * Instagram posts featured in the website gallery.
   *
   * NOTE: Instagram does not allow a website to pull a profile feed automatically
   * without going through the Meta Graph API (which needs a Business account +
   * app review). So the gallery uses Instagram's OFFICIAL post embed instead —
   * each post below renders as a real, live Instagram card.
   *
   * To add a post: open it on Instagram, copy the URL, and paste it here.
   * Only public posts can be embedded.
   */
  instagramPosts: [
    "https://www.instagram.com/p/DZ8RvO-Dhff/",
  ],

  serviceAreas: ["Lagos", "Abuja", "Port Harcourt", "Nationwide (on request)"],

  /** Lead time we need to guarantee a setup, in days. */
  minimumLeadTimeDays: 2,
} as const;

/** Builds a wa.me deep link with a pre-filled message. */
export function whatsappLink(message: string): string {
  return `https://wa.me/${brand.whatsappNumber}?text=${encodeURIComponent(message)}`;
}

export const instagramDmLink = `https://ig.me/m/${brand.instagramHandle}`;
