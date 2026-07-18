import { brand, instagramDmLink, whatsappLink } from "@/lib/brand";
import { WhatsAppIcon } from "./QuoteCard";

export function Footer() {
  return (
    <footer className="relative overflow-hidden border-t border-white/10 px-5 pt-20 pb-10">
      <div className="glow left-1/2 top-0 h-[20rem] w-[30rem] -translate-x-1/2 bg-violet-600/20" />

      <div className="relative z-10 mx-auto max-w-4xl text-center">
        <h2 className="font-display text-4xl leading-tight text-cream sm:text-5xl">
          Someone you love has
          <span className="text-gilded"> a day coming up</span>
        </h2>
        <p className="mx-auto mt-4 max-w-md text-sm leading-relaxed text-cream/55">
          Let&apos;s make it the one they talk about for years. Reach us
          wherever you&apos;re most comfortable — we answer fast.
        </p>

        <div className="mt-9 flex flex-col items-center justify-center gap-3 sm:flex-row">
          <a
            href={whatsappLink(
              `Hi ${brand.founder.split(" ")[0]}! I'd love to plan a surprise 💜`,
            )}
            target="_blank"
            rel="noopener noreferrer"
            className="flex w-full items-center justify-center gap-2 rounded-full bg-gradient-to-r from-violet-600 to-violet-500 px-8 py-4 text-sm font-medium text-white shadow-xl shadow-violet-600/30 transition hover:brightness-110 active:scale-[0.98] sm:w-auto"
          >
            <WhatsAppIcon />
            {brand.whatsappDisplay}
          </a>
          <a
            href={instagramDmLink}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full rounded-full border border-white/15 px-8 py-4 text-sm text-cream/85 transition hover:border-gold-400/40 hover:text-gold-300 sm:w-auto"
          >
            DM us on Instagram
          </a>
        </div>

        <div className="mt-16 flex flex-col items-center gap-3 border-t border-white/10 pt-8 text-xs text-cream/35 sm:flex-row sm:justify-between">
          <p>
            © {new Date().getFullYear()} {brand.name} · Founded by{" "}
            <span className="text-cream/55">{brand.founder}</span>
          </p>
          <p className="italic">{brand.tagline}</p>
        </div>
      </div>
    </footer>
  );
}
