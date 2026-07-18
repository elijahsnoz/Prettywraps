import { addOns, formatNaira, getAddOn, getPackage, packages } from "./catalog";
import { brand } from "./brand";

export type QuoteLine = {
  label: string;
  amount: number;
  note?: string;
};

export type Quote = {
  id: string;
  packageId: string;
  packageName: string;
  addOnIds: string[];
  lines: QuoteLine[];
  subtotal: number;
  deliveryFee: number;
  total: number;
  /** Deposit required to lock the date. */
  deposit: number;
  currency: "NGN";
  createdAt: string;
  /** Quotes are honoured for this long. */
  validUntil: string;
  meta: QuoteMeta;
};

export type QuoteMeta = {
  occasion?: string;
  date?: string;
  location?: string;
  recipientName?: string;
  notes?: string;
};

/** Delivery / logistics fee by service area. PLACEHOLDER — edit with real rates. */
const DELIVERY_FEES: Record<string, number> = {
  lagos: 10_000,
  abuja: 15_000,
  "port harcourt": 15_000,
};
const DEFAULT_DELIVERY_FEE = 25_000;

const DEPOSIT_RATE = 0.7; // 70% to lock the date, balance on the day.
const QUOTE_VALID_DAYS = 7;

function deliveryFeeFor(location?: string): number {
  if (!location) return DEFAULT_DELIVERY_FEE;
  const key = location.trim().toLowerCase();
  for (const [area, fee] of Object.entries(DELIVERY_FEES)) {
    if (key.includes(area)) return fee;
  }
  return DEFAULT_DELIVERY_FEE;
}

function quoteId(): string {
  // Human-readable and easy to read out over WhatsApp.
  const n = Math.floor(Math.random() * 9000) + 1000;
  return `PW-${n}`;
}

export function buildQuote(input: {
  packageId: string;
  addOnIds?: string[];
  meta?: QuoteMeta;
}): Quote | { error: string } {
  const pkg = getPackage(input.packageId);
  if (!pkg) {
    return {
      // Listing the valid ids lets the AI correct itself on the next tool call.
      error: `Unknown package "${input.packageId}". Valid options: ${packages
        .map((p) => p.id)
        .join(", ")}`,
    };
  }

  const meta = input.meta ?? {};
  const lines: QuoteLine[] = [{ label: pkg.name, amount: pkg.price, note: pkg.tagline }];

  const validAddOnIds: string[] = [];
  for (const id of input.addOnIds ?? []) {
    const addOn = getAddOn(id);
    if (!addOn) continue; // Ignore unknown add-ons rather than breaking the quote.
    validAddOnIds.push(id);
    lines.push({ label: addOn.name, amount: addOn.price, note: addOn.description });
  }

  const subtotal = lines.reduce((sum, l) => sum + l.amount, 0);
  const deliveryFee = deliveryFeeFor(meta.location);
  const total = subtotal + deliveryFee;

  const now = new Date();
  const validUntil = new Date(now.getTime() + QUOTE_VALID_DAYS * 86_400_000);

  return {
    id: quoteId(),
    packageId: pkg.id,
    packageName: pkg.name,
    addOnIds: validAddOnIds,
    lines,
    subtotal,
    deliveryFee,
    total,
    deposit: Math.round((total * DEPOSIT_RATE) / 1000) * 1000,
    currency: "NGN",
    createdAt: now.toISOString(),
    validUntil: validUntil.toISOString(),
    meta,
  };
}

/** Plain-text quote summary — used in WhatsApp messages and the AI's replies. */
export function quoteToText(quote: Quote): string {
  const lines = [
    `${brand.name} — Quotation ${quote.id}`,
    "",
    ...quote.lines.map((l) => `• ${l.label} — ${formatNaira(l.amount)}`),
    `• Delivery & logistics — ${formatNaira(quote.deliveryFee)}`,
    "",
    `Total: ${formatNaira(quote.total)}`,
    `Deposit to lock the date: ${formatNaira(quote.deposit)}`,
  ];

  if (quote.meta.occasion) lines.push("", `Occasion: ${quote.meta.occasion}`);
  if (quote.meta.date) lines.push(`Date: ${quote.meta.date}`);
  if (quote.meta.location) lines.push(`Location: ${quote.meta.location}`);
  if (quote.meta.recipientName) lines.push(`For: ${quote.meta.recipientName}`);
  if (quote.meta.notes) lines.push(`Notes: ${quote.meta.notes}`);

  return lines.join("\n");
}

/** The message we pre-fill into WhatsApp when a customer taps "Book on WhatsApp". */
export function quoteToWhatsAppMessage(quote: Quote): string {
  return [
    `Hi ${brand.founder.split(" ")[0]}! I'd like to book this surprise 💜`,
    "",
    quoteToText(quote),
    "",
    "Sent from the Prettywraps NG website.",
  ].join("\n");
}

export const allAddOns = addOns;
