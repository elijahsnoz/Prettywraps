"use client";

import { useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
  budgetBands,
  formatNaira,
  occasions,
  packages,
  type Occasion,
} from "@/lib/catalog";

export function Packages({ onAsk }: { onAsk: (message: string) => void }) {
  const [occasion, setOccasion] = useState<Occasion | "all">("all");
  const [band, setBand] = useState<string>("all");

  const visible = useMemo(() => {
    const selectedBand = budgetBands.find((b) => b.id === band);
    return packages.filter((p) => {
      const occasionOk = occasion === "all" || p.occasions.includes(occasion);
      const budgetOk =
        !selectedBand || (p.price >= selectedBand.min && p.price <= selectedBand.max);
      return occasionOk && budgetOk;
    });
  }, [occasion, band]);

  return (
    <div>
      {/* Filters */}
      <div className="space-y-4">
        <div>
          <p className="mb-2.5 text-[11px] uppercase tracking-[0.2em] text-cream/40">
            What are we celebrating?
          </p>
          <div className="flex flex-wrap gap-2">
            <Chip active={occasion === "all"} onClick={() => setOccasion("all")}>
              Everything
            </Chip>
            {occasions.map((o) => (
              <Chip
                key={o.id}
                active={occasion === o.id}
                onClick={() => setOccasion(o.id)}
              >
                {o.emoji} {o.label}
              </Chip>
            ))}
          </div>
        </div>

        <div>
          <p className="mb-2.5 text-[11px] uppercase tracking-[0.2em] text-cream/40">
            Your budget
          </p>
          <div className="flex flex-wrap gap-2">
            <Chip active={band === "all"} onClick={() => setBand("all")}>
              Any budget
            </Chip>
            {budgetBands.map((b) => (
              <Chip key={b.id} active={band === b.id} onClick={() => setBand(b.id)}>
                {b.label}
              </Chip>
            ))}
          </div>
        </div>
      </div>

      {/* Grid */}
      <div className="mt-9 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        <AnimatePresence mode="popLayout">
          {visible.map((pkg) => (
            <motion.article
              key={pkg.id}
              layout
              initial={{ opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.96 }}
              transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
              className="surface surface-hover relative flex flex-col rounded-3xl p-6"
            >
              {pkg.featured && (
                <span className="absolute -top-2.5 left-6 rounded-full bg-gradient-to-r from-gold-400 to-gold-300 px-3 py-1 text-[10px] font-semibold uppercase tracking-wider text-plum-950">
                  Most loved
                </span>
              )}

              <h3 className="font-display text-2xl text-cream">{pkg.name}</h3>
              <p className="mt-1 text-sm italic text-violet-300/80">{pkg.tagline}</p>

              <p className="mt-4 font-display text-3xl text-gilded">
                {formatNaira(pkg.price)}
              </p>
              <p className="text-[11px] uppercase tracking-wider text-cream/35">
                starting price
              </p>

              <ul className="mt-5 flex-1 space-y-2">
                {pkg.includes.slice(0, 5).map((item) => (
                  <li key={item} className="flex gap-2.5 text-[13px] text-cream/70">
                    <span className="mt-1.5 h-1 w-1 shrink-0 rounded-full bg-gold-400/60" />
                    {item}
                  </li>
                ))}
                {pkg.includes.length > 5 && (
                  <li className="pl-[18px] text-[13px] text-cream/40">
                    +{pkg.includes.length - 5} more
                  </li>
                )}
              </ul>

              <div className="mt-5 space-y-1 border-t border-white/10 pt-4 text-[11px] text-cream/40">
                <p>📍 {pkg.setting}</p>
                <p>⏱ Setup: {pkg.setupTime}</p>
              </div>

              <button
                onClick={() =>
                  onAsk(
                    `I'm interested in the ${pkg.name} package. Can you tell me more and give me a quote?`,
                  )
                }
                className="mt-5 w-full rounded-full border border-violet-400/30 bg-violet-500/10 py-3 text-sm text-violet-200 transition hover:border-gold-400/40 hover:bg-violet-500/20 active:scale-[0.98]"
              >
                Ask the concierge
              </button>
            </motion.article>
          ))}
        </AnimatePresence>
      </div>

      {visible.length === 0 && (
        <div className="surface mt-9 rounded-3xl px-6 py-12 text-center">
          <p className="font-display text-2xl text-cream">
            Nothing matches that exactly
          </p>
          <p className="mx-auto mt-2 max-w-sm text-sm text-cream/55">
            That doesn&apos;t mean we can&apos;t do it. Tell the concierge what
            you have in mind and we&apos;ll design something around your budget.
          </p>
          <button
            onClick={() =>
              onAsk(
                `I have a specific budget and idea in mind that isn't in your standard packages. Can you help me design something custom?`,
              )
            }
            className="mt-6 rounded-full bg-gradient-to-r from-violet-600 to-violet-500 px-7 py-3 text-sm text-white transition hover:brightness-110"
          >
            Design something custom
          </button>
        </div>
      )}
    </div>
  );
}

function Chip({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      onClick={onClick}
      aria-pressed={active}
      className={`rounded-full border px-3.5 py-2 text-xs transition active:scale-95 ${
        active
          ? "border-gold-400/50 bg-gold-400/15 text-gold-200"
          : "border-white/10 bg-white/[0.04] text-cream/60 hover:border-white/25 hover:text-cream/90"
      }`}
    >
      {children}
    </button>
  );
}
