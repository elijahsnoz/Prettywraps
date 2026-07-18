import { NextRequest } from "next/server";
import { createBooking } from "@/lib/store";
import { buildQuote, quoteToWhatsAppMessage } from "@/lib/quote";
import { formatNaira } from "@/lib/catalog";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/**
 * Direct booking endpoint used by the site's own quote builder — the path a
 * customer takes when they'd rather click than chat.
 */
export async function POST(req: NextRequest) {
  let body: Record<string, unknown>;
  try {
    body = await req.json();
  } catch {
    return Response.json({ error: "Invalid JSON body." }, { status: 400 });
  }

  const customerName = typeof body.customerName === "string" ? body.customerName.trim() : "";
  const packageId = typeof body.packageId === "string" ? body.packageId : "";

  if (!customerName) {
    return Response.json({ error: "Please tell us your name." }, { status: 400 });
  }
  if (!packageId) {
    return Response.json({ error: "Please choose a package." }, { status: 400 });
  }

  const quote = buildQuote({
    packageId,
    addOnIds: Array.isArray(body.addOnIds) ? (body.addOnIds as string[]) : [],
    meta: {
      occasion: body.occasion as string | undefined,
      date: body.date as string | undefined,
      location: body.location as string | undefined,
      recipientName: body.recipientName as string | undefined,
      notes: body.notes as string | undefined,
    },
  });

  if ("error" in quote) {
    return Response.json({ error: quote.error }, { status: 400 });
  }

  const booking = await createBooking({
    customerName,
    phone: body.phone as string | undefined,
    instagram: body.instagram as string | undefined,
    occasion: body.occasion as string | undefined,
    date: body.date as string | undefined,
    location: body.location as string | undefined,
    recipientName: body.recipientName as string | undefined,
    notes: body.notes as string | undefined,
    quote,
    channel: "website",
  });

  return Response.json({
    ref: booking.ref,
    total: formatNaira(quote.total),
    deposit: formatNaira(quote.deposit),
    whatsappMessage: quoteToWhatsAppMessage(quote).replace(
      "Sent from the Prettywraps NG website.",
      `Booking reference: ${booking.ref}`,
    ),
  });
}
