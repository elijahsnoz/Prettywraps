"use client";

import { useState } from "react";
import { Concierge } from "./Concierge";
import { Packages } from "./Packages";
import { Reveal } from "./Reveal";

/**
 * Holds the concierge and the package browser together so a "Ask the concierge"
 * click on a package card can start the conversation for the customer.
 */
export function Planner() {
  const [seed, setSeed] = useState<string | undefined>();

  const ask = (message: string) => {
    setSeed(message);
    document.getElementById("concierge")?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <>
      <section id="concierge" className="relative overflow-hidden px-5 py-20 sm:py-24">
        <div className="glow left-[-8%] top-[10%] h-[24rem] w-[24rem] bg-violet-600/25" />

        <div className="relative z-10 mx-auto max-w-3xl">
          <Reveal className="mb-9 text-center">
            <p className="mb-3 text-[11px] uppercase tracking-[0.22em] text-gold-400/70">
              The concierge
            </p>
            <h2 className="font-display text-4xl leading-tight text-cream sm:text-5xl">
              Three minutes to
              <span className="text-gilded"> something unforgettable</span>
            </h2>
            <p className="mx-auto mt-4 max-w-lg text-sm leading-relaxed text-cream/55">
              Chat naturally. Ask anything. You&apos;ll leave with a real
              quotation and a booking reference — no forms, no back and forth.
            </p>
          </Reveal>

          <Reveal delay={0.1}>
            <Concierge seedMessage={seed} />
          </Reveal>
        </div>
      </section>

      <section id="packages" className="relative overflow-hidden px-5 py-20 sm:py-24">
        <div className="glow right-[-10%] top-[20%] h-[24rem] w-[24rem] bg-blush-400/15" />

        <div className="relative z-10 mx-auto max-w-6xl">
          <Reveal className="mb-9 text-center">
            <p className="mb-3 text-[11px] uppercase tracking-[0.22em] text-gold-400/70">
              Signature packages
            </p>
            <h2 className="font-display text-4xl leading-tight text-cream sm:text-5xl">
              Start with a favourite,
              <span className="text-gilded"> make it yours</span>
            </h2>
            <p className="mx-auto mt-4 max-w-lg text-sm leading-relaxed text-cream/55">
              Every package is a starting point. Filter by occasion and budget,
              then let the concierge tailor it to the person you&apos;re
              surprising.
            </p>
          </Reveal>

          <Reveal delay={0.1}>
            <Packages onAsk={ask} />
          </Reveal>
        </div>
      </section>
    </>
  );
}
