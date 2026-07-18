import { NextRequest } from "next/server";
import { listBookingsOn } from "@/lib/store";
import { brand } from "@/lib/brand";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/** PLACEHOLDER capacity rule — how many setups the team can run in one day. */
const DAILY_CAPACITY = 3;

/**
 * Returns availability for every day in a month, for the booking calendar.
 * Query: ?year=2026&month=8   (month is 1-indexed)
 */
export async function GET(req: NextRequest) {
  const now = new Date();
  const year = Number(req.nextUrl.searchParams.get("year")) || now.getFullYear();
  const month = Number(req.nextUrl.searchParams.get("month")) || now.getMonth() + 1;

  if (month < 1 || month > 12 || year < 2000 || year > 2100) {
    return Response.json({ error: "Invalid year or month." }, { status: 400 });
  }

  const daysInMonth = new Date(year, month, 0).getDate();
  const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate()).getTime();

  const days = await Promise.all(
    Array.from({ length: daysInMonth }, async (_, i) => {
      const day = i + 1;
      const date = `${year}-${String(month).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
      const dayStart = new Date(year, month - 1, day).getTime();
      const daysAway = Math.round((dayStart - todayStart) / 86_400_000);

      if (daysAway < 0) {
        return { date, day, state: "past" as const, slotsLeft: 0 };
      }

      const booked = await listBookingsOn(date);
      const slotsLeft = Math.max(0, DAILY_CAPACITY - booked.length);

      if (slotsLeft === 0) return { date, day, state: "full" as const, slotsLeft };
      if (daysAway < brand.minimumLeadTimeDays) {
        return { date, day, state: "rush" as const, slotsLeft };
      }
      return { date, day, state: "open" as const, slotsLeft };
    }),
  );

  return Response.json({ year, month, capacity: DAILY_CAPACITY, days });
}
