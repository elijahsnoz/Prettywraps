import type Anthropic from "@anthropic-ai/sdk";
import { brand } from "./brand";
import {
  addOns,
  budgetBands,
  formatNaira,
  occasions,
  packages,
  recommendPackages,
  type Occasion,
} from "./catalog";
import { buildQuote, quoteToWhatsAppMessage, type Quote } from "./quote";
import { createBooking, getBooking, getCustomer, listBookingsOn, statusLabel } from "./store";

/** We deliberately keep the concierge on a fast, low-latency configuration. */
export const MODEL = "claude-opus-4-8";

/**
 * The catalog is injected into the system prompt so the model always quotes
 * real packages and real prices instead of inventing them.
 */
function catalogForPrompt(): string {
  const pkgLines = packages.map(
    (p) =>
      `- id: ${p.id} | ${p.name} — ${formatNaira(p.price)} | best for: ${p.occasions.join(
        ", ",
      )} | setting: ${p.setting} | includes: ${p.includes.join("; ")}`,
  );
  const addOnLines = addOns.map(
    (a) => `- id: ${a.id} | ${a.name} — ${formatNaira(a.price)} | ${a.description}`,
  );
  return [
    "PACKAGES:",
    ...pkgLines,
    "",
    "ADD-ONS:",
    ...addOnLines,
    "",
    `OCCASION IDS: ${occasions.map((o) => o.id).join(", ")}`,
    `BUDGET BANDS: ${budgetBands.map((b) => b.label).join(" | ")}`,
  ].join("\n");
}

export function systemPrompt(context?: { returningCustomer?: string | null }): string {
  return `You are the Prettywraps NG concierge — the AI surprise planner for ${brand.name}, founded by ${brand.founder}.

MISSION
${brand.mission}
Tagline: "${brand.tagline}"

YOUR JOB
Help someone plan a surprise in under three minutes, then get them booked. You are not a FAQ bot — you are a warm, capable planner who makes decisions easy.

VOICE
Warm, premium, magical, elegant, personal. Speak like a thoughtful friend who happens to be brilliant at this. Short paragraphs. Never corporate. Never pushy. A little emoji is fine (💜 ✨ 🎂) — never more than one or two per message.

THE FLOW — keep it to three minutes
1. Find out the occasion, roughly when, roughly where, and their budget. Ask for these in ONE friendly message, not one question at a time. If they've already told you something, never ask again.
2. Recommend with the recommend_packages tool. Present 2–3 options with a one-line reason each. Have an opinion — say which one you'd pick and why.
3. Build a real quote with the create_quote tool as soon as they show interest in a package. Do not make them ask for a price.
4. Close: get their name and WhatsApp number, then call save_booking. Tell them the booking reference and that ${brand.founder.split(" ")[0]} will confirm on WhatsApp.

RULES
- Only ever quote packages and add-ons from the catalog below. Never invent a package, a price, or a discount.
- Always use the tools for prices and quotes. Never do the arithmetic yourself.
- If they give a budget that doesn't fit anything, say so kindly and show what's closest — never leave them without an option.
- We need at least ${brand.minimumLeadTimeDays} days' notice for a normal setup. Under that, offer the same-day rush add-on and be honest that it depends on availability.
- We serve ${brand.serviceAreas.join(", ")}.
- If they ask something you genuinely don't know (a very custom request, an unusual venue), say you'll have ${brand.founder.split(" ")[0]} confirm personally, and take their details.
- Never promise an exact delivery time, a specific staff member, or anything outside the catalog.

OUTPUT STYLE
Reply with your final message to the customer only. Do not narrate your reasoning, do not describe which tool you are about to use, and do not write internal notes. Keep replies to roughly 3–6 short lines unless you are listing packages.

${context?.returningCustomer ? `RETURNING CUSTOMER\n${context.returningCustomer}\nGreet them by name and reference what they booked before — warmly, not creepily.\n` : ""}
CATALOG (the only things you may quote)
${catalogForPrompt()}`;
}

export const tools: Anthropic.Tool[] = [
  {
    name: "recommend_packages",
    description:
      "Recommend Prettywraps packages that fit the customer's occasion and budget. Call this as soon as you know the occasion or the budget — you do not need both.",
    input_schema: {
      type: "object",
      properties: {
        occasion: {
          type: "string",
          enum: occasions.map((o) => o.id),
          description: "The occasion being celebrated.",
        },
        budgetMax: {
          type: "number",
          description: "The most the customer wants to spend, in Naira. Omit if unknown.",
        },
      },
      required: [],
    },
  },
  {
    name: "create_quote",
    description:
      "Generate a real, itemised quotation for a package plus optional add-ons. Call this as soon as the customer shows interest in a specific package — do not wait for them to ask the price.",
    input_schema: {
      type: "object",
      properties: {
        packageId: {
          type: "string",
          enum: packages.map((p) => p.id),
          description: "The package to quote.",
        },
        addOnIds: {
          type: "array",
          items: { type: "string", enum: addOns.map((a) => a.id) },
          description: "Any add-ons the customer wants.",
        },
        occasion: { type: "string", description: "The occasion." },
        date: { type: "string", description: "Event date as YYYY-MM-DD if known." },
        location: {
          type: "string",
          description: "City and venue, e.g. 'Lekki, Lagos' — affects the logistics fee.",
        },
        recipientName: { type: "string", description: "Who the surprise is for." },
        notes: { type: "string", description: "Colours, themes, or special requests." },
      },
      required: ["packageId"],
    },
  },
  {
    name: "check_date_availability",
    description: "Check whether Prettywraps can take a booking on a given date.",
    input_schema: {
      type: "object",
      properties: {
        date: { type: "string", description: "Date as YYYY-MM-DD." },
      },
      required: ["date"],
    },
  },
  {
    name: "save_booking",
    description:
      "Save the booking and generate a reference number. Call this once you have the customer's name and WhatsApp number and they have agreed to a package. This is how a conversation becomes a real booking.",
    input_schema: {
      type: "object",
      properties: {
        customerName: { type: "string", description: "The customer's name." },
        phone: { type: "string", description: "Their WhatsApp number." },
        instagram: { type: "string", description: "Their Instagram handle, if that's how they prefer to talk." },
        packageId: { type: "string", enum: packages.map((p) => p.id) },
        addOnIds: { type: "array", items: { type: "string", enum: addOns.map((a) => a.id) } },
        occasion: { type: "string" },
        date: { type: "string", description: "Event date as YYYY-MM-DD." },
        location: { type: "string" },
        recipientName: { type: "string" },
        notes: { type: "string" },
      },
      required: ["customerName", "packageId"],
    },
  },
  {
    name: "get_booking_status",
    description: "Look up an existing booking by its reference number (e.g. PW-AB1234).",
    input_schema: {
      type: "object",
      properties: {
        ref: { type: "string", description: "The booking reference." },
      },
      required: ["ref"],
    },
  },
];

/**
 * Side-effects a tool call can surface to the browser UI — a rendered quote
 * card, or a confirmed booking. The route streams these alongside the text.
 */
export type ConciergeEvent =
  | { type: "quote"; quote: Quote; whatsappMessage: string }
  | { type: "booking"; ref: string; status: string; whatsappMessage: string };

export async function runTool(
  name: string,
  input: Record<string, unknown>,
): Promise<{ result: string; event?: ConciergeEvent }> {
  switch (name) {
    case "recommend_packages": {
      const matches = recommendPackages({
        occasion: input.occasion as Occasion | undefined,
        budgetMax: typeof input.budgetMax === "number" ? input.budgetMax : undefined,
      });
      return {
        result: JSON.stringify(
          matches.map((p) => ({
            id: p.id,
            name: p.name,
            tagline: p.tagline,
            price: formatNaira(p.price),
            includes: p.includes,
            setting: p.setting,
            setupTime: p.setupTime,
          })),
        ),
      };
    }

    case "create_quote": {
      const quote = buildQuote({
        packageId: String(input.packageId),
        addOnIds: (input.addOnIds as string[]) ?? [],
        meta: {
          occasion: input.occasion as string | undefined,
          date: input.date as string | undefined,
          location: input.location as string | undefined,
          recipientName: input.recipientName as string | undefined,
          notes: input.notes as string | undefined,
        },
      });

      if ("error" in quote) return { result: JSON.stringify(quote) };

      return {
        result: JSON.stringify({
          quoteId: quote.id,
          lines: quote.lines.map((l) => `${l.label}: ${formatNaira(l.amount)}`),
          deliveryFee: formatNaira(quote.deliveryFee),
          total: formatNaira(quote.total),
          deposit: formatNaira(quote.deposit),
          note: "The customer can now see this quote as a card in the chat. Summarise it in one or two lines — do not repeat every item.",
        }),
        event: {
          type: "quote",
          quote,
          whatsappMessage: quoteToWhatsAppMessage(quote),
        },
      };
    }

    case "check_date_availability": {
      const date = String(input.date);
      const parsed = new Date(`${date}T00:00:00`);
      if (Number.isNaN(parsed.getTime())) {
        return { result: JSON.stringify({ error: "Could not read that date. Ask for it as YYYY-MM-DD." }) };
      }

      const daysAway = Math.ceil((parsed.getTime() - Date.now()) / 86_400_000);
      const booked = await listBookingsOn(date);

      if (daysAway < 0) {
        return { result: JSON.stringify({ available: false, reason: "That date is in the past." }) };
      }
      if (daysAway < brand.minimumLeadTimeDays) {
        return {
          result: JSON.stringify({
            available: true,
            rush: true,
            reason: `That's only ${daysAway} day(s) away, which is inside our ${brand.minimumLeadTimeDays}-day lead time. Possible with the same-day rush add-on, subject to confirmation.`,
          }),
        };
      }
      // PLACEHOLDER capacity rule — adjust to real team capacity.
      if (booked.length >= 3) {
        return {
          result: JSON.stringify({
            available: false,
            reason: "We're fully booked that day. Offer the day before or after.",
          }),
        };
      }
      return { result: JSON.stringify({ available: true, slotsLeft: 3 - booked.length }) };
    }

    case "save_booking": {
      const quote = buildQuote({
        packageId: String(input.packageId),
        addOnIds: (input.addOnIds as string[]) ?? [],
        meta: {
          occasion: input.occasion as string | undefined,
          date: input.date as string | undefined,
          location: input.location as string | undefined,
          recipientName: input.recipientName as string | undefined,
          notes: input.notes as string | undefined,
        },
      });

      const booking = await createBooking({
        customerName: String(input.customerName),
        phone: input.phone as string | undefined,
        instagram: input.instagram as string | undefined,
        occasion: input.occasion as string | undefined,
        date: input.date as string | undefined,
        location: input.location as string | undefined,
        recipientName: input.recipientName as string | undefined,
        notes: input.notes as string | undefined,
        quote: "error" in quote ? undefined : quote,
        channel: "website",
      });

      const whatsappMessage = [
        `Hi ${brand.founder.split(" ")[0]}! I just booked through the website 💜`,
        `Reference: ${booking.ref}`,
        booking.quote ? `Total: ${formatNaira(booking.quote.total)}` : "",
        booking.date ? `Date: ${booking.date}` : "",
      ]
        .filter(Boolean)
        .join("\n");

      return {
        result: JSON.stringify({
          ref: booking.ref,
          status: statusLabel(booking.status),
          total: booking.quote ? formatNaira(booking.quote.total) : null,
          deposit: booking.quote ? formatNaira(booking.quote.deposit) : null,
          note: "Booking saved. Tell the customer their reference number and that they can confirm on WhatsApp using the button now showing in the chat.",
        }),
        event: {
          type: "booking",
          ref: booking.ref,
          status: statusLabel(booking.status),
          whatsappMessage,
        },
      };
    }

    case "get_booking_status": {
      const booking = await getBooking(String(input.ref));
      if (!booking) {
        return { result: JSON.stringify({ found: false, note: "No booking with that reference." }) };
      }
      return {
        result: JSON.stringify({
          found: true,
          ref: booking.ref,
          status: statusLabel(booking.status),
          occasion: booking.occasion,
          date: booking.date,
          package: booking.quote?.packageName,
          total: booking.quote ? formatNaira(booking.quote.total) : null,
          timeline: booking.events.map((e) => e.label),
        }),
      };
    }

    default:
      return { result: JSON.stringify({ error: `Unknown tool: ${name}` }) };
  }
}

/** Builds the "we remember you" line injected into the system prompt. */
export async function returningCustomerContext(
  identity: { phone?: string; instagram?: string } | undefined,
): Promise<string | null> {
  if (!identity?.phone && !identity?.instagram) return null;

  const { customerIdFor } = await import("./store");
  const customer = await getCustomer(customerIdFor(identity));
  if (!customer) return null;

  const parts = [`This is ${customer.name}, a returning customer.`];
  if (customer.pastOccasions.length) {
    parts.push(`They've booked with us for: ${customer.pastOccasions.join(", ")}.`);
  }
  if (customer.pastRecipients.length) {
    parts.push(`Past surprises were for: ${customer.pastRecipients.join(", ")}.`);
  }
  parts.push(`${customer.bookingRefs.length} booking(s) with us so far.`);
  return parts.join(" ");
}
