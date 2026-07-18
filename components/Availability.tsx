"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { BookingCalendar } from "./BookingCalendar";
import { brand, whatsappLink } from "@/lib/brand";
import { WhatsAppIcon } from "./icons";

export function Availability() {
  const [date, setDate] = useState<string | null>(null);

  const pretty = date
    ? new Date(`${date}T00:00:00`).toLocaleDateString("en-NG", {
        weekday: "long",
        day: "numeric",
        month: "long",
        year: "numeric",
      })
    : null;

  return (
    <div className="mx-auto max-w-lg">
      <BookingCalendar onPick={setDate} />

      {date && (
        <motion.a
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          href={whatsappLink(
            `Hi ${brand.founder.split(" ")[0]}! I'd like to hold ${pretty} for a surprise 💜`,
          )}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-4 flex items-center justify-center gap-2 rounded-full bg-gradient-to-r from-violet-600 to-violet-500 px-8 py-4 text-sm font-medium text-white shadow-xl shadow-violet-600/30 transition hover:brightness-110 active:scale-[0.98]"
        >
          <WhatsAppIcon />
          Hold this date on WhatsApp
        </motion.a>
      )}
    </div>
  );
}
