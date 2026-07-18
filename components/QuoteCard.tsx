"use client";

import { motion } from "framer-motion";
import { formatNaira } from "@/lib/catalog";
import { whatsappLink } from "@/lib/brand";
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

export function WhatsAppIcon({ className = "h-4 w-4" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden="true">
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.174.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51l-.57-.01c-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884a9.82 9.82 0 016.988 2.896 9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.885-9.885 9.885m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z" />
    </svg>
  );
}
