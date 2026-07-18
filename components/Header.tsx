"use client";

import { useEffect, useState } from "react";
import { brand, whatsappLink } from "@/lib/brand";
import { WhatsAppIcon } from "./icons";
import { LogoLockup } from "./Logo";

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
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-3 px-4 py-4 sm:px-5">
        <a href="#top" aria-label={`${brand.name} — home`} className="min-w-0">
          <LogoLockup size={36} priority />
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
            // h-11/w-11 is 44px — the minimum comfortable tap target on a phone.
            className="grid h-11 w-11 place-items-center rounded-full border border-white/10 text-cream md:hidden"
          >
            <svg viewBox="0 0 24 24" fill="none" className="h-5 w-5">
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
              className="block py-3.5 text-base text-cream/75 transition hover:text-gold-300"
            >
              {link.label}
            </a>
          ))}
        </nav>
      )}
    </header>
  );
}
