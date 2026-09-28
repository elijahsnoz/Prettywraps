/**
 * ============================================================================
 *  PRICING & PACKAGE CATALOG  —  ⚠️  PLACEHOLDER PRICES  ⚠️
 * ============================================================================
 *
 *  Judith: every price below is a PLACEHOLDER I invented so the site works.
 *  They are NOT your real rates. Edit this one file and the whole website,
 *  the AI concierge, and every generated quote update automatically.
 *
 *  All prices are in Nigerian Naira (NGN), for the base package only.
 * ============================================================================
 */

export type Occasion =
  | "birthday"
  | "anniversary"
  | "proposal"
  | "romantic"
  | "baby"
  | "graduation"
  | "just-because"
  | "corporate";

export const occasions: { id: Occasion; label: string; emoji: string }[] = [
  { id: "birthday", label: "Birthday", emoji: "🎂" },
  { id: "anniversary", label: "Anniversary", emoji: "💍" },
  { id: "proposal", label: "Proposal", emoji: "💐" },
  { id: "romantic", label: "Romantic surprise", emoji: "❤️" },
  { id: "baby", label: "Baby shower / Gender reveal", emoji: "🍼" },
  { id: "graduation", label: "Graduation", emoji: "🎓" },
  { id: "just-because", label: "Just because", emoji: "✨" },
  { id: "corporate", label: "Corporate / Team", emoji: "🥂" },
];

export type Pkg = {
  id: string;
  name: string;
  tagline: string;
  /** Base price in NGN. PLACEHOLDER — replace with real rates. */
  price: number;
  /** Occasions this package suits. */
  occasions: Occasion[];
  /** What's included in the base price. */
  includes: string[];
  /** Where it is typically set up. */
  setting: string;
  /** Roughly how long the setup takes on the day. */
  setupTime: string;
  /** Marks the package we lead with. */
  featured?: boolean;
};

export const packages: Pkg[] = [
  {
    id: "sweet-surprise",
    name: "Sweet Surprise",
    tagline: "A small gesture that lands big.",
    price: 45_000,
    occasions: ["birthday", "just-because", "romantic", "graduation"],
    includes: [
      "Curated gift bag",
      "Fresh flower bouquet",
      "Special customized card",
      "Chocolate treats",
      "Hand-written note",
    ],
    setting: "Delivered to their door, office, or hotel front desk",
    setupTime: "Delivery only — no setup",
  },
  {
    id: "birthday-bliss",
    name: "Birthday Bliss",
    tagline: "The classic room takeover.",
    price: 85_000,
    occasions: ["birthday", "graduation", "just-because"],
    featured: true,
    includes: [
      "Fresh flower bouquet",
      "Helium balloon",
      "Sweet chocolate treats",
      "Special customized card",
      "Curated gift bag",
      "Hand-written note",
    ],
    setting: "Home living room, bedroom, or a booked hotel room",
    setupTime: "About 2 hours",
  },
  {
    id: "room-of-roses",
    name: "Room of Roses",
    tagline: "Their room, styled with intention.",
    price: 120_000,
    occasions: ["romantic", "anniversary", "birthday", "proposal"],
    includes: [
      "Customized hot air balloon",
      "Fresh flower bouquet",
      "Special chocolate treats",
      "Special customized card",
      "Curated gift packaging",
      "Hand-written note",
    ],
    setting: "Hotel room or private home",
    setupTime: "About 3 hours",
  },
  {
    id: "sweet-arrival",
    name: "Sweet Arrival",
    tagline: "For a big feeling in a beautifully timed moment.",
    price: 150_000,
    occasions: ["baby", "romantic", "birthday", "just-because"],
    includes: [
      "Hot air balloon with special treats",
      "I Love You money box",
      "Customized helium balloon",
      "Special customized card",
      "Curated gift packaging",
    ],
    setting: "Home, event hall, or private venue",
    setupTime: "About 3 hours",
  },
  {
    id: "luxe-hotel",
    name: "Luxe Hotel Experience",
    tagline: "A whole evening, designed end to end.",
    price: 250_000,
    occasions: ["anniversary", "romantic", "birthday", "proposal"],
    includes: [
      "Hot air balloon with special treats",
      "I 💜 You money box / money bouquet",
      "Fresh flower bouquet",
      "Special customized card",
      "Curated gift packaging",
      "Customized helium balloon",
    ],
    setting: "Hotel suite (we can help you book one)",
    setupTime: "About 4 hours",
  },
  {
    id: "grand-romance",
    name: "The Grand Romance",
    tagline: "For the yes you only get to ask for once.",
    price: 450_000,
    occasions: ["proposal", "anniversary", "birthday"],
    includes: [
      "1 rectangular backdrop (with shimmer panel in color choice / with celebrant picture in color choice) or 1 arch backdrop (with text in color choice)",
      "Elegant balloon styling on backdrop / happy birthday light",
      "1 cake stand",
      "1 welcome signage",
      "Table setting for 20–30 guests (table cloth, flower vase with flower arrangement, candles, napkins and custom menu card)",
    ],
    setting: "Rooftop, garden, beach, private venue, or hotel suite",
    setupTime: "5+ hours",
  },
];

export type AddOn = {
  id: string;
  name: string;
  /** Price in NGN. PLACEHOLDER. */
  price: number;
  description: string;
};

export const addOns: AddOn[] = [
  { id: "cake-6", name: "Custom cake (6-inch)", price: 25_000, description: "Flavour and design of your choice." },
  { id: "cake-8", name: "Custom cake (8-inch)", price: 40_000, description: "Serves 12–15 people." },
  { id: "flowers-premium", name: "Premium rose bouquet", price: 35_000, description: "Two dozen fresh imported roses." },
  { id: "photographer", name: "Photographer (1 hour)", price: 60_000, description: "Edited gallery delivered in 48 hours." },
  { id: "videographer", name: "Reel / video coverage", price: 80_000, description: "A cinematic 60-second reel of the reveal." },
  { id: "neon-sign", name: "Custom neon sign", price: 55_000, description: "Their name or your message, in light." },
  { id: "musician", name: "Live acoustic musician (1 hour)", price: 90_000, description: "Saxophone, violin, or guitar and vocals." },
  { id: "hamper", name: "Luxury gift hamper", price: 45_000, description: "Perfume, skincare, wine, and treats." },
  { id: "hotel-booking", name: "Hotel booking assistance", price: 15_000, description: "We find and book the room. Room rate billed separately." },
  { id: "same-day", name: "Same-day rush setup", price: 30_000, description: "For when you decided this morning." },
];

/** Budget bands used by the AI and the budget picker on the site. */
export const budgetBands = [
  { id: "under-50", label: "Under ₦50,000", min: 0, max: 50_000 },
  { id: "50-100", label: "₦50,000 – ₦100,000", min: 50_000, max: 100_000 },
  { id: "100-250", label: "₦100,000 – ₦250,000", min: 100_000, max: 250_000 },
  { id: "250-500", label: "₦250,000 – ₦500,000", min: 250_000, max: 500_000 },
  { id: "500-plus", label: "₦500,000+", min: 500_000, max: Number.MAX_SAFE_INTEGER },
] as const;

export function formatNaira(amount: number): string {
  return `₦${amount.toLocaleString("en-NG")}`;
}

export function getPackage(id: string): Pkg | undefined {
  return packages.find((p) => p.id === id);
}

export function getAddOn(id: string): AddOn | undefined {
  return addOns.find((a) => a.id === id);
}

/**
 * Recommends packages for a budget and occasion.
 * Returns best fits first, and never returns an empty list — if nothing fits
 * the budget we still surface the cheapest option so the customer has a path.
 */
export function recommendPackages(opts: {
  budgetMax?: number;
  occasion?: Occasion;
  limit?: number;
}): Pkg[] {
  const { budgetMax, occasion, limit = 3 } = opts;

  let pool = packages;
  if (occasion) {
    const matching = pool.filter((p) => p.occasions.includes(occasion));
    if (matching.length > 0) pool = matching;
  }

  const withinBudget = budgetMax
    ? pool.filter((p) => p.price <= budgetMax)
    : pool;

  if (withinBudget.length === 0) {
    // Nothing fits — offer the most affordable options rather than nothing.
    return [...pool].sort((a, b) => a.price - b.price).slice(0, limit);
  }

  // Best value first: the most inclusive package they can actually afford.
  return [...withinBudget].sort((a, b) => b.price - a.price).slice(0, limit);
}
