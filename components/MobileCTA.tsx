"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { brand, whatsappLink } from "@/lib/brand";
import { WhatsAppIcon } from "./icons";

/**
 * A floating WhatsApp button for phones.
 *
 * Appears once someone has scrolled past the hero, and gets out of the way
 * while they're actually using the concierge (where the chat already has its
 * own booking buttons and this would sit on top of the composer).
 */
export function MobileCTA() {
  const [pastHero, setPastHero] = useState(false);
  const [inConcierge, setInConcierge] = useState(false);

  useEffect(() => {
    const onScroll = () => setPastHero(window.scrollY > 520);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });

    const concierge = document.getElementById("concierge");
    let observer: IntersectionObserver | undefined;

    if (concierge) {
      observer = new IntersectionObserver(
        ([entry]) => setInConcierge(entry.isIntersecting),
        // Only hide once the chat genuinely occupies the screen.
        { threshold: 0.25 },
      );
      observer.observe(concierge);
    }

    return () => {
      window.removeEventListener("scroll", onScroll);
      observer?.disconnect();
    };
  }, []);

  const visible = pastHero && !inConcierge;

  return (
    <AnimatePresence>
      {visible && (
        <motion.a
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 24 }}
          transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
          href={whatsappLink(
            `Hi ${brand.founder.split(" ")[0]}! I'd love to plan a surprise 💜`,
          )}
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Chat with us on WhatsApp"
          className="fixed inset-x-4 z-40 flex items-center justify-center gap-2.5 rounded-full bg-gradient-to-r from-violet-600 to-violet-500 px-6 py-4 text-sm font-medium text-white shadow-2xl shadow-violet-900/50 md:hidden"
          // Sits above the home indicator on iPhones.
          style={{ bottom: "calc(1rem + env(safe-area-inset-bottom))" }}
        >
          <WhatsAppIcon className="h-4 w-4" />
          Chat with us on WhatsApp
        </motion.a>
      )}
    </AnimatePresence>
  );
}
