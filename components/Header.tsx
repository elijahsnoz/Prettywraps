"use client";

import { useEffect, useState } from "react";
import { brand, whatsappLink } from "@/lib/brand";
import { WhatsAppIcon } from "./QuoteCard";

const LINKS = [
  { href: "#concierge", label: "Concierge" },
  { href: "#packages", label: "Packages" },
  { href: "#calendar", label: "Availability" },
  { href: "#track", label: "Track order" },
];

export function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 transition-all duration-500 ${
        scrolled
          ? "border-b border-white/10 bg-plum-950/80 backdrop-blur-xl"
          : "border-b border-transparent"
      }`}
    >
      <div className="mx-auto flex max-w-6xl items-center justify-between px-5 py-4">
        <a href="#top" className="group flex items-center gap-2.5">
          <span className="grid h-9 w-9 place-items-center rounded-full bg-gradient-to-br from-violet-500 to-violet-700 text-sm shadow-lg shadow-violet-600/30">
            💜
          </span>
          <span className="font-display text-xl leading-none text-cream">
            Prettywraps <span className="text-gold-400">NG</span>
          </span>
        </a>

        <nav className="hidden items-center gap-7 md:flex">
          {LINKS.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="text-sm text-cream/65 transition hover:text-gold-300"
            >
              {link.label}
            </a>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <a
            href={whatsappLink(
              `Hi ${brand.founder.split(" ")[0]}! I'd love to plan a surprise 💜`,
            )}
            target="_blank"
            rel="noopener noreferrer"
            className="hidden items-center gap-2 rounded-full border border-gold-400/30 bg-gold-400/10 px-4 py-2 text-sm text-gold-300 transition hover:bg-gold-400/20 sm:flex"
          >
            <WhatsAppIcon className="h-3.5 w-3.5" />
            WhatsApp
          </a>

          <button
            onClick={() => setOpen((v) => !v)}
            aria-label="Toggle menu"
            aria-expanded={open}
            className="grid h-9 w-9 place-items-center rounded-full border border-white/10 text-cream md:hidden"
          >
            <svg viewBox="0 0 24 24" fill="none" className="h-4 w-4">
              <path
                d={open ? "M6 6l12 12M18 6L6 18" : "M4 7h16M4 12h16M4 17h16"}
                stroke="currentColor"
                strokeWidth="1.8"
                strokeLinecap="round"
              />
            </svg>
          </button>
        </div>
      </div>

      {open && (
        <nav className="border-t border-white/10 bg-plum-950/95 px-5 py-4 backdrop-blur-xl md:hidden">
          {LINKS.map((link) => (
            <a
              key={link.href}
              href={link.href}
              onClick={() => setOpen(false)}
              className="block py-2.5 text-sm text-cream/75 transition hover:text-gold-300"
            >
              {link.label}
            </a>
          ))}
        </nav>
      )}
    </header>
  );
}
