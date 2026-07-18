import { promises as fs } from "node:fs";
import path from "node:path";
import type { Quote } from "./quote";

/**
 * A small file-backed store for bookings, quotes, and returning customers.
 *
 * This keeps the app dependency-free and works on any normal server or on a
 * local machine. It writes JSON to `.data/` in the project root.
 *
 * ⚠️ If you deploy to a serverless platform (Vercel, Netlify functions), the
 * filesystem is ephemeral and this will NOT persist between requests. Swap the
 * `read`/`write` functions below for a real database (Postgres, Supabase,
 * Firebase) — everything else in the app talks to this file's exported
 * functions only, so that is the only file you need to change.
 */

const DATA_DIR = path.join(process.cwd(), ".data");
const DB_FILE = path.join(DATA_DIR, "prettywraps.json");

export type BookingStatus =
  | "enquiry"
  | "quoted"
  | "deposit-pending"
  | "confirmed"
  | "in-preparation"
  | "delivered"
  | "cancelled";

export type Booking = {
  ref: string;
  customerId: string;
  customerName: string;
  phone?: string;
  instagram?: string;
  occasion?: string;
  date?: string;
  location?: string;
  recipientName?: string;
  notes?: string;
  quote?: Quote;
  status: BookingStatus;
  channel: "website" | "whatsapp" | "instagram";
  createdAt: string;
  updatedAt: string;
  /** Timeline shown on the order-tracking page. */
  events: { at: string; label: string }[];
};

export type Customer = {
  id: string;
  name: string;
  phone?: string;
  instagram?: string;
  /** What we remember about them, so the AI can greet them properly. */
  pastOccasions: string[];
  pastRecipients: string[];
  bookingRefs: string[];
  firstSeenAt: string;
  lastSeenAt: string;
};

type DB = {
  bookings: Record<string, Booking>;
  customers: Record<string, Customer>;
};

const EMPTY_DB: DB = { bookings: {}, customers: {} };

/**
 * Serverless platforms (Vercel, Netlify functions) run with a read-only
 * filesystem, so writing here throws EROFS/EPERM. Losing the record is
 * survivable — the full booking is sent to WhatsApp regardless — but a crash
 * is not: it turns "book my surprise" into a 500 for the customer.
 *
 * So a failed write degrades to an in-memory store instead of throwing. Data
 * then lives only for the life of that instance, which is why `storageIsDurable`
 * exists: the tracking endpoint uses it to give an honest answer rather than
 * claiming a real booking doesn't exist.
 */
let useMemory = false;
let memoryDB: DB = structuredClone(EMPTY_DB);

export function storageIsDurable(): boolean {
  return !useMemory;
}

async function read(): Promise<DB> {
  if (useMemory) return memoryDB;
  try {
    const raw = await fs.readFile(DB_FILE, "utf8");
    const parsed = JSON.parse(raw) as Partial<DB>;
    return { bookings: parsed.bookings ?? {}, customers: parsed.customers ?? {} };
  } catch {
    // No file yet, or unreadable — start clean rather than crashing the request.
    return structuredClone(EMPTY_DB);
  }
}

async function write(db: DB): Promise<void> {
  if (useMemory) {
    memoryDB = db;
    return;
  }
  try {
    await fs.mkdir(DATA_DIR, { recursive: true });
    await fs.writeFile(DB_FILE, JSON.stringify(db, null, 2), "utf8");
  } catch (err) {
    console.warn(
      "[store] filesystem is not writable, falling back to in-memory storage. " +
        "Bookings will not persist — configure a database (see lib/store.ts).",
      err instanceof Error ? err.message : err,
    );
    useMemory = true;
    memoryDB = db;
  }
}

function bookingRef(): string {
  const letters = "ABCDEFGHJKMNPQRSTUVWXYZ"; // No I/L/O — easy to misread aloud.
  const a = letters[Math.floor(Math.random() * letters.length)];
  const b = letters[Math.floor(Math.random() * letters.length)];
  const n = Math.floor(Math.random() * 9000) + 1000;
  return `PW-${a}${b}${n}`;
}

/** Stable customer id derived from phone or instagram handle. */
export function customerIdFor(identity: { phone?: string; instagram?: string; name?: string }): string {
  if (identity.phone) return `p:${identity.phone.replace(/\D/g, "")}`;
  if (identity.instagram) return `i:${identity.instagram.replace(/^@/, "").toLowerCase()}`;
  return `n:${(identity.name ?? "guest").trim().toLowerCase()}`;
}

export async function getCustomer(id: string): Promise<Customer | null> {
  const db = await read();
  return db.customers[id] ?? null;
}

export async function createBooking(input: {
  customerName: string;
  phone?: string;
  instagram?: string;
  occasion?: string;
  date?: string;
  location?: string;
  recipientName?: string;
  notes?: string;
  quote?: Quote;
  channel?: Booking["channel"];
}): Promise<Booking> {
  const db = await read();
  const now = new Date().toISOString();
  const ref = bookingRef();
  const customerId = customerIdFor(input);

  const booking: Booking = {
    ref,
    customerId,
    customerName: input.customerName,
    phone: input.phone,
    instagram: input.instagram,
    occasion: input.occasion,
    date: input.date,
    location: input.location,
    recipientName: input.recipientName,
    notes: input.notes,
    quote: input.quote,
    status: input.quote ? "deposit-pending" : "enquiry",
    channel: input.channel ?? "website",
    createdAt: now,
    updatedAt: now,
    events: [
      { at: now, label: "Enquiry received" },
      ...(input.quote ? [{ at: now, label: `Quotation ${input.quote.id} prepared` }] : []),
    ],
  };

  db.bookings[ref] = booking;

  // Update or create the customer record so we remember them next time.
  const existing = db.customers[customerId];
  db.customers[customerId] = {
    id: customerId,
    name: input.customerName,
    phone: input.phone ?? existing?.phone,
    instagram: input.instagram ?? existing?.instagram,
    pastOccasions: dedupe([...(existing?.pastOccasions ?? []), input.occasion]),
    pastRecipients: dedupe([...(existing?.pastRecipients ?? []), input.recipientName]),
    bookingRefs: [...(existing?.bookingRefs ?? []), ref],
    firstSeenAt: existing?.firstSeenAt ?? now,
    lastSeenAt: now,
  };

  await write(db);
  return booking;
}

export async function getBooking(ref: string): Promise<Booking | null> {
  const db = await read();
  return db.bookings[ref.trim().toUpperCase()] ?? null;
}

export async function updateBookingStatus(
  ref: string,
  status: BookingStatus,
  label?: string,
): Promise<Booking | null> {
  const db = await read();
  const key = ref.trim().toUpperCase();
  const booking = db.bookings[key];
  if (!booking) return null;

  const now = new Date().toISOString();
  booking.status = status;
  booking.updatedAt = now;
  booking.events.push({ at: now, label: label ?? statusLabel(status) });

  await write(db);
  return booking;
}

export async function listBookingsOn(date: string): Promise<Booking[]> {
  const db = await read();
  return Object.values(db.bookings).filter(
    (b) => b.date === date && b.status !== "cancelled",
  );
}

export function statusLabel(status: BookingStatus): string {
  const labels: Record<BookingStatus, string> = {
    enquiry: "Enquiry received",
    quoted: "Quotation sent",
    "deposit-pending": "Awaiting deposit",
    confirmed: "Booking confirmed",
    "in-preparation": "Preparing your surprise",
    delivered: "Delivered",
    cancelled: "Cancelled",
  };
  return labels[status];
}

function dedupe(values: (string | undefined)[]): string[] {
  return [...new Set(values.filter((v): v is string => Boolean(v)))];
}
