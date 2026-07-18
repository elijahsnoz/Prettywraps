"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";

type TrackResult = {
  found: true;
  ref: string;
  statusLabel: string;
  cancelled: boolean;
  stepIndex: number;
  journey: string[];
  customerName: string;
  recipientName?: string;
  occasion?: string;
  date?: string;
  location?: string;
  packageName: string | null;
  total: string | null;
  events: { at: string; label: string }[];
};

export function OrderTracking() {
  const [ref, setRef] = useState("");
  const [result, setResult] = useState<TrackResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const track = async (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = ref.trim();
    if (!trimmed || loading) return;

    setLoading(true);
    setError(null);
    setResult(null);

    try {
      const res = await fetch(`/api/track?ref=${encodeURIComponent(trimmed)}`);
      const data = await res.json();
      if (!res.ok || !data.found) {
        setError(data.error ?? "We couldn't find that booking.");
      } else {
        setResult(data as TrackResult);
      }
    } catch {
      setError("Couldn't reach our system just now. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mx-auto max-w-xl">
      <form onSubmit={track} className="flex flex-col gap-3 sm:flex-row">
        <input
          value={ref}
          onChange={(e) => setRef(e.target.value.toUpperCase())}
          placeholder="PW-AB1234"
          aria-label="Booking reference"
          className="flex-1 rounded-full border border-white/10 bg-white/5 px-6 py-3.5 text-center text-sm tracking-[0.15em] text-cream placeholder:tracking-normal placeholder:text-cream/30 outline-none transition focus:border-violet-400/50 sm:text-left"
        />
        <button
          type="submit"
          disabled={!ref.trim() || loading}
          className="rounded-full bg-gradient-to-r from-violet-600 to-violet-500 px-8 py-3.5 text-sm font-medium text-white transition disabled:opacity-30 enabled:hover:brightness-110 enabled:active:scale-[0.98]"
        >
          {loading ? "Looking…" : "Track"}
        </button>
      </form>

      <AnimatePresence mode="wait">
        {error && (
          <motion.p
            key="error"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="mt-5 rounded-2xl border border-blush-400/20 bg-blush-400/[0.07] px-5 py-4 text-center text-sm text-blush-300"
          >
            {error}
          </motion.p>
        )}

        {result && (
          <motion.div
            key="result"
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
            className="surface mt-6 rounded-3xl p-6"
          >
            <div className="flex flex-wrap items-baseline justify-between gap-2 border-b border-white/10 pb-4">
              <div>
                <p className="font-display text-2xl text-cream">{result.ref}</p>
                <p className="text-sm text-cream/50">
                  {result.packageName ?? "Custom surprise"}
                  {result.recipientName ? ` · for ${result.recipientName}` : ""}
                </p>
              </div>
              <span
                className={`rounded-full px-3.5 py-1.5 text-xs ${
                  result.cancelled
                    ? "bg-blush-400/15 text-blush-300"
                    : "bg-gold-400/15 text-gold-300"
                }`}
              >
                {result.statusLabel}
              </span>
            </div>

            {!result.cancelled && (
              <div className="mt-6">
                <div className="mb-3 flex gap-1.5">
                  {result.journey.map((_, i) => (
                    <motion.div
                      key={i}
                      initial={{ scaleX: 0 }}
                      animate={{ scaleX: 1 }}
                      transition={{ delay: 0.1 * i, duration: 0.4 }}
                      style={{ transformOrigin: "left" }}
                      className={`h-1.5 flex-1 rounded-full ${
                        i <= result.stepIndex
                          ? "bg-gradient-to-r from-violet-500 to-gold-400"
                          : "bg-white/[0.07]"
                      }`}
                    />
                  ))}
                </div>
                <div className="flex justify-between text-[10px] uppercase tracking-wider text-cream/35">
                  <span>Enquiry</span>
                  <span>Delivered</span>
                </div>
              </div>
            )}

            <dl className="mt-6 grid grid-cols-2 gap-4 text-sm">
              {result.date && <Field label="Date" value={result.date} />}
              {result.location && <Field label="Location" value={result.location} />}
              {result.occasion && <Field label="Occasion" value={result.occasion} />}
              {result.total && <Field label="Total" value={result.total} />}
            </dl>

            <div className="mt-6 space-y-3 border-t border-white/10 pt-5">
              {result.events.map((event, i) => (
                <div key={i} className="flex gap-3 text-sm">
                  <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-gold-400/70" />
                  <div className="flex-1">
                    <p className="text-cream/85">{event.label}</p>
                    <p className="text-[11px] text-cream/35">
                      {new Date(event.at).toLocaleString("en-NG", {
                        dateStyle: "medium",
                        timeStyle: "short",
                      })}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function Field({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <dt className="text-[10px] uppercase tracking-wider text-cream/35">{label}</dt>
      <dd className="mt-0.5 text-cream/85">{value}</dd>
    </div>
  );
}
