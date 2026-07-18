import { brand } from "./brand";
import { formatNaira, occasions, packages, recommendPackages, type Occasion } from "./catalog";
import { buildQuote, quoteToWhatsAppMessage } from "./quote";
import type { ConciergeEvent } from "./concierge";

/**
 * A scripted concierge used when ANTHROPIC_API_KEY is not configured.
 *
 * It is deliberately simple — it exists so the site is fully demoable (and can
 * still take a booking through WhatsApp) before the AI is switched on. Once the
 * key is set, this file is never called.
 */

export type ChatTurn = { role: "user" | "assistant"; content: string };

function findOccasion(text: string): Occasion | undefined {
  const t = text.toLowerCase();
  for (const o of occasions) {
    if (t.includes(o.id.replace("-", " ")) || t.includes(o.label.toLowerCase())) return o.id;
  }
  if (t.includes("bday") || t.includes("birthday")) return "birthday";
  if (t.includes("propose") || t.includes("engage")) return "proposal";
  return undefined;
}

function findBudget(text: string): number | undefined {
  // Matches "100k", "₦150,000", "200000"
  const k = text.match(/(\d{1,4})\s*k\b/i);
  if (k) return parseInt(k[1], 10) * 1000;
  const full = text.match(/([\d,]{4,})/);
  if (full) {
    const n = parseInt(full[1].replace(/,/g, ""), 10);
    if (n >= 1000) return n;
  }
  return undefined;
}

export function scriptedReply(history: ChatTurn[]): {
  text: string;
  event?: ConciergeEvent;
} {
  const userText = history
    .filter((m) => m.role === "user")
    .map((m) => m.content)
    .join(" ");
  const occasion = findOccasion(userText);
  const budget = findBudget(userText);
  const turnCount = history.filter((m) => m.role === "user").length;

  // Someone asked for a specific package by name → quote it immediately.
  const named = packages.find((p) => userText.toLowerCase().includes(p.name.toLowerCase()));
  if (named) {
    const quote = buildQuote({
      packageId: named.id,
      meta: { occasion: occasion ?? undefined },
    });
    if (!("error" in quote)) {
      return {
        text: `Beautiful choice — ${named.name} is one of our favourites. ✨\n\nI've put a quote together for you below. If it feels right, tap through to WhatsApp and ${brand.founder.split(" ")[0]} will lock in your date.`,
        event: { type: "quote", quote, whatsappMessage: quoteToWhatsAppMessage(quote) },
      };
    }
  }

  if (turnCount <= 1 && !occasion && !budget) {
    return {
      text: `Hi love, welcome to ${brand.name} 💜\n\nTell me three quick things and I'll design something beautiful:\n\n• What are we celebrating?\n• Roughly when, and in which city?\n• What budget are you working with?`,
    };
  }

  if (!occasion) {
    return {
      text: "Lovely. What are we celebrating — a birthday, an anniversary, a proposal, or something else? ✨",
    };
  }

  const matches = recommendPackages({ occasion, budgetMax: budget, limit: 3 });
  const list = matches
    .map((p) => `• **${p.name}** — ${formatNaira(p.price)}\n  ${p.tagline}`)
    .join("\n\n");

  const budgetLine = budget
    ? `Working with ${formatNaira(budget)}, here's what I'd suggest:`
    : "Here's where I'd start:";

  return {
    text: `${budgetLine}\n\n${list}\n\nTell me which one speaks to you and I'll build your quote — or say the name and I'll price it right away. 💜`,
  };
}

export const FALLBACK_NOTICE =
  "AI concierge is running in basic mode — set ANTHROPIC_API_KEY to enable the full assistant.";
