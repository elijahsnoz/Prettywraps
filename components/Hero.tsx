import { brand, whatsappLink } from "@/lib/brand";
import { WhatsAppIcon } from "./icons";

/**
 * A server component — no JavaScript involved.
 *
 * The entrance animation is pure CSS, so the headline paints with the very
 * first HTML response instead of waiting on a bundle. On the mobile networks
 * most of our customers are on, that's the difference between an instant page
 * and several seconds of empty purple.
 */
export function Hero() {
  return (
    <section id="top" className="relative overflow-hidden px-5 pt-32 pb-20 sm:pt-40 sm:pb-28">
      {/* Ambient glows */}
      <div className="glow animate-drift left-[-10%] top-[-8%] h-[26rem] w-[26rem] bg-violet-600/40" />
      <div
        className="glow animate-drift right-[-12%] top-[18%] h-[22rem] w-[22rem] bg-blush-400/20"
        style={{ animationDelay: "-6s" }}
      />
      <div
        className="glow animate-drift bottom-[-10%] left-[25%] h-[20rem] w-[20rem] bg-gold-400/15"
        style={{ animationDelay: "-11s" }}
      />

      <div className="relative z-10 mx-auto max-w-4xl text-center">
        <p className="rise mx-auto mb-7 inline-flex items-center gap-2 rounded-full border border-gold-400/25 bg-gold-400/[0.07] px-4 py-1.5 text-[11px] uppercase tracking-[0.22em] text-gold-300">
          <span className="h-1.5 w-1.5 rounded-full bg-gold-400" />
          Surprise concierge · Nigeria
        </p>

        <h1
          className="rise font-display text-[2.6rem] leading-[1.05] tracking-tight text-cream sm:text-6xl md:text-7xl"
          style={{ animationDelay: "0.08s" }}
        >
          Don&apos;t just say
          <br />
          <span className="italic text-cream/70">Happy Birthday.</span>
          <br />
          <span className="text-gilded animate-shimmer">
            Create unforgettable memories.
          </span>
        </h1>

        <p
          className="rise mx-auto mt-7 max-w-xl text-[15px] leading-relaxed text-cream/60 sm:text-base"
          style={{ animationDelay: "0.24s" }}
        >
          Room takeovers, balloon installations, flowers, cakes and gifts —
          designed around the person you love. Tell our AI concierge what
          you&apos;re imagining and get a real quote in under three minutes.
        </p>

        <div
          className="rise mt-10 flex flex-col items-center justify-center gap-3 sm:flex-row"
          style={{ animationDelay: "0.36s" }}
        >
          <a
            href="#concierge"
            className="w-full rounded-full bg-gradient-to-r from-violet-600 to-violet-500 px-8 py-4 text-sm font-medium text-white shadow-xl shadow-violet-600/35 transition hover:brightness-110 active:scale-[0.98] sm:w-auto"
          >
            Plan my surprise ✨
          </a>
          <a
            href={whatsappLink(
              `Hi ${brand.founder.split(" ")[0]}! I'd love to plan a surprise 💜`,
            )}
            target="_blank"
            rel="noopener noreferrer"
            className="flex w-full items-center justify-center gap-2 rounded-full border border-white/15 px-8 py-4 text-sm text-cream/85 transition hover:border-gold-400/40 hover:text-gold-300 sm:w-auto"
          >
            <WhatsAppIcon className="h-4 w-4" />
            Chat on WhatsApp
          </a>
        </div>

        <div
          className="rise mt-14 flex flex-wrap items-center justify-center gap-x-8 gap-y-3 text-[11px] uppercase tracking-[0.18em] text-cream/35"
          style={{ animationDelay: "0.5s" }}
        >
          <span>Lagos · Abuja · Port Harcourt</span>
          <span className="hidden h-3 w-px bg-cream/15 sm:block" />
          <span>Same-day setups available</span>
          <span className="hidden h-3 w-px bg-cream/15 sm:block" />
          <span>Founded by {brand.founder}</span>
        </div>
      </div>
    </section>
  );
}
