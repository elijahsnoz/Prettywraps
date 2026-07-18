import { NextRequest } from "next/server";
import { getBooking, statusLabel, storageIsDurable, type BookingStatus } from "@/lib/store";
import { formatNaira } from "@/lib/catalog";
import { brand } from "@/lib/brand";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/** The customer-facing journey, in order. Drives the progress bar. */
const JOURNEY: BookingStatus[] = [
  "enquiry",
  "deposit-pending",
  "confirmed",
  "in-preparation",
  "delivered",
];

export async function GET(req: NextRequest) {
  const ref = req.nextUrl.searchParams.get("ref");
  if (!ref) {
    return Response.json({ error: "Add a booking reference." }, { status: 400 });
  }

  const booking = await getBooking(ref);
  if (!booking) {
    // Without durable storage a real booking can genuinely be missing from
    // this instance, so don't tell the customer it doesn't exist — point them
    // at WhatsApp, where the full booking was sent anyway.
    const error = storageIsDurable()
      ? `We couldn't find a booking with reference ${ref.toUpperCase()}. Please check the reference, or message us on WhatsApp at ${brand.whatsappDisplay} and we'll look it up for you.`
      : `We can't look that up automatically right now. Message us on WhatsApp at ${brand.whatsappDisplay} with reference ${ref.toUpperCase()} and we'll give you an update straight away.`;

    return Response.json({ found: false, error }, { status: 404 });
  }

  const stepIndex = JOURNEY.indexOf(booking.status);

  return Response.json({
    found: true,
    ref: booking.ref,
    status: booking.status,
    statusLabel: statusLabel(booking.status),
    cancelled: booking.status === "cancelled",
    // -1 when cancelled, which the UI renders as a stopped journey.
    stepIndex,
    totalSteps: JOURNEY.length,
    journey: JOURNEY.map((s) => statusLabel(s)),
    customerName: booking.customerName,
    recipientName: booking.recipientName,
    occasion: booking.occasion,
    date: booking.date,
    location: booking.location,
    packageName: booking.quote?.packageName ?? null,
    total: booking.quote ? formatNaira(booking.quote.total) : null,
    deposit: booking.quote ? formatNaira(booking.quote.deposit) : null,
    events: booking.events,
  });
}
