"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";

type Day = {
  date: string;
  day: number;
  state: "past" | "open" | "rush" | "full";
  slotsLeft: number;
};

const WEEKDAYS = ["S", "M", "T", "W", "T", "F", "S"];
const MONTHS = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December",
];

export function BookingCalendar({ onPick }: { onPick: (date: string) => void }) {
  const today = new Date();
  const [year, setYear] = useState(today.getFullYear());
  const [month, setMonth] = useState(today.getMonth() + 1); // 1-indexed
  const [days, setDays] = useState<Day[]>([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);

    fetch(`/api/availability?year=${year}&month=${month}`)
      .then((r) => r.json())
      .then((data) => {
        if (!cancelled) setDays(data.days ?? []);
      })
      .catch(() => {
        if (!cancelled) setDays([]);
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [year, month]);

  const shift = (delta: number) => {
    const d = new Date(year, month - 1 + delta, 1);
    setYear(d.getFullYear());
    setMonth(d.getMonth() + 1);
  };

  // Blank cells so the 1st lands on the right weekday.
  const leadingBlanks = new Date(year, month - 1, 1).getDay();
  const isCurrentMonth =
    year === today.getFullYear() && month === today.getMonth() + 1;

  return (
    <div className="surface rounded-4xl p-5 sm:p-7">
      <div className="mb-6 flex items-center justify-between">
        <button
          onClick={() => shift(-1)}
          disabled={isCurrentMonth}
          aria-label="Previous month"
          className="grid h-9 w-9 place-items-center rounded-full border border-white/10 text-cream/70 transition enabled:hover:border-gold-400/40 enabled:hover:text-gold-300 disabled:opacity-25"
        >
          ‹
        </button>
        <p className="font-display text-2xl text-cream">
          {MONTHS[month - 1]} <span className="text-cream/45">{year}</span>
        </p>
        <button
          onClick={() => shift(1)}
          aria-label="Next month"
          className="grid h-9 w-9 place-items-center rounded-full border border-white/10 text-cream/70 transition hover:border-gold-400/40 hover:text-gold-300"
        >
          ›
        </button>
      </div>

      <div className="mb-2 grid grid-cols-7 gap-1.5">
        {WEEKDAYS.map((d, i) => (
          <div
            key={i}
            className="text-center text-[10px] uppercase tracking-wider text-cream/30"
          >
            {d}
          </div>
        ))}
      </div>

      <div className="grid grid-cols-7 gap-1.5">
        {Array.from({ length: leadingBlanks }, (_, i) => (
          <div key={`blank-${i}`} />
        ))}

        {loading
          ? Array.from({ length: 28 }, (_, i) => (
              <div
                key={`skeleton-${i}`}
                className="aspect-square animate-pulse rounded-xl bg-white/[0.04]"
              />
            ))
          : days.map((day) => {
              const disabled = day.state === "past" || day.state === "full";
              const isSelected = selected === day.date;

              return (
                <motion.button
                  key={day.date}
                  whileTap={disabled ? undefined : { scale: 0.9 }}
                  disabled={disabled}
                  onClick={() => {
                    setSelected(day.date);
                    onPick(day.date);
                  }}
                  title={
                    day.state === "full"
                      ? "Fully booked"
                      : day.state === "rush"
                        ? "Rush setup — subject to confirmation"
                        : day.state === "past"
                          ? undefined
                          : `${day.slotsLeft} slot(s) left`
                  }
                  className={`relative aspect-square rounded-xl text-sm transition ${
                    isSelected
                      ? "bg-gradient-to-br from-violet-500 to-violet-700 text-white shadow-lg shadow-violet-600/40"
                      : day.state === "past"
                        ? "text-cream/15"
                        : day.state === "full"
                          ? "bg-white/[0.02] text-cream/20 line-through"
                          : day.state === "rush"
                            ? "border border-gold-400/30 bg-gold-400/[0.07] text-gold-300 hover:bg-gold-400/15"
                            : "border border-white/[0.07] bg-white/[0.04] text-cream/80 hover:border-violet-400/40 hover:bg-violet-500/15"
                  }`}
                >
                  {day.day}
                  {day.state === "rush" && !isSelected && (
                    <span className="absolute bottom-1 left-1/2 h-1 w-1 -translate-x-1/2 rounded-full bg-gold-400" />
                  )}
                </motion.button>
              );
            })}
      </div>

      <div className="mt-6 flex flex-wrap items-center gap-x-5 gap-y-2 border-t border-white/10 pt-4 text-[11px] text-cream/45">
        <Legend className="border border-white/15 bg-white/[0.06]" label="Available" />
        <Legend className="border border-gold-400/40 bg-gold-400/15" label="Rush setup" />
        <Legend className="bg-white/[0.03]" label="Fully booked" />
      </div>

      {selected && (
        <motion.p
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-4 text-center text-sm text-cream/70"
        >
          Selected{" "}
          <strong className="text-gold-300">
            {new Date(`${selected}T00:00:00`).toLocaleDateString("en-NG", {
              weekday: "long",
              day: "numeric",
              month: "long",
            })}
          </strong>{" "}
          — tell the concierge and we&apos;ll hold it for you.
        </motion.p>
      )}
    </div>
  );
}

function Legend({ className, label }: { className: string; label: string }) {
  return (
    <span className="flex items-center gap-2">
      <span className={`h-3.5 w-3.5 rounded-md ${className}`} />
      {label}
    </span>
  );
}
