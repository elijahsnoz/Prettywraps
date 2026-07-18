"use client";

import { motion } from "framer-motion";
import { formatNaira } from "@/lib/catalog";
import { whatsappLink } from "@/lib/brand";
import { WhatsAppIcon } from "./icons";
import type { Quote } from "@/lib/quote";

export function QuoteCard({
  quote,
  whatsappMessage,
}: {
  quote: Quote;
  whatsappMessage: string;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16, scale: 0.97 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
      className="surface rounded-3xl overflow-hidden my-3"
    >
      <div className="px-5 py-4 border-b border-white/10 bg-gradient-to-r from-violet-600/25 to-transparent">
        <div className="flex items-baseline justify-between gap-3">
          <p className="font-display text-2xl text-gold-300">Your Quotation</p>
          <span className="text-xs tracking-widest uppercase text-violet-300">
            {quote.id}
          </span>
        </div>
        <p className="text-sm text-cream/60 mt-0.5">{quote.packageName}</p>
      </div>

      <div className="px-5 py-4 space-y-2.5">
        {quote.lines.map((line, i) => (
          <div key={i} className="flex items-start justify-between gap-4 text-sm">
            <span className="text-cream/85">{line.label}</span>
            <span className="text-cream/95 tabular-nums whitespace-nowrap">
              {formatNaira(line.amount)}
            </span>
          </div>
        ))}
        <div className="flex items-start justify-between gap-4 text-sm">
          <span className="text-cream/85">Delivery &amp; logistics</span>
          <span className="text-cream/95 tabular-nums whitespace-nowrap">
            {formatNaira(quote.deliveryFee)}
          </span>
        </div>
      </div>

      <div className="px-5 py-4 border-t border-white/10 space-y-1.5">
        <div className="flex items-baseline justify-between gap-4">
          <span className="font-display text-xl text-cream">Total</span>
          <span className="font-display text-2xl text-gilded tabular-nums">
            {formatNaira(quote.total)}
          </span>
        </div>
        <div className="flex items-baseline justify-between gap-4 text-xs text-cream/55">
          <span>Deposit to lock your date</span>
          <span className="tabular-nums">{formatNaira(quote.deposit)}</span>
        </div>
      </div>

      <div className="px-5 pb-5">
        <a
          href={whatsappLink(whatsappMessage)}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center justify-center gap-2 w-full rounded-full bg-gradient-to-r from-violet-600 to-violet-500 px-5 py-3.5 text-sm font-medium text-white shadow-lg shadow-violet-600/30 transition hover:shadow-violet-500/50 hover:brightness-110 active:scale-[0.98]"
        >
          <WhatsAppIcon />
          Book this on WhatsApp
        </a>
        <p className="mt-2.5 text-center text-[11px] text-cream/40">
          Quote held for 7 days · Nothing is charged here
        </p>
      </div>
    </motion.div>
  );
}

export function BookingCard({
  bookingRef,
  status,
  whatsappMessage,
}: {
  bookingRef: string;
  status: string;
  whatsappMessage: string;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16, scale: 0.97 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
      className="surface rounded-3xl overflow-hidden my-3 border-gold-400/30"
    >
      <div className="px-5 py-5 text-center">
        <div className="mx-auto mb-3 grid h-12 w-12 place-items-center rounded-full bg-gold-400/15 text-2xl">
          ✨
        </div>
        <p className="font-display text-2xl text-gold-300">It&apos;s in motion</p>
        <p className="mt-1 text-sm text-cream/65">
          Save this reference — you can track your surprise with it.
        </p>
        <p className="mt-4 font-display text-3xl tracking-[0.2em] text-cream">
          {bookingRef}
        </p>
        <p className="mt-1 text-xs uppercase tracking-widest text-violet-300">
          {status}
        </p>

        <a
          href={whatsappLink(whatsappMessage)}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-5 flex items-center justify-center gap-2 w-full rounded-full bg-gradient-to-r from-violet-600 to-violet-500 px-5 py-3.5 text-sm font-medium text-white shadow-lg shadow-violet-600/30 transition hover:brightness-110 active:scale-[0.98]"
        >
          <WhatsAppIcon />
          Confirm on WhatsApp
        </a>
      </div>
    </motion.div>
  );
}
