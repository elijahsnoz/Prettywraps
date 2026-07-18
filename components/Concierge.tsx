"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { BookingCard, QuoteCard } from "./QuoteCard";
import type { ConciergeEvent } from "@/lib/concierge";
import { brand } from "@/lib/brand";

type Message = {
  id: string;
  role: "user" | "assistant";
  content: string;
  events: ConciergeEvent[];
};

type Identity = { name?: string; phone?: string; instagram?: string };

const IDENTITY_KEY = "prettywraps:identity";
const HISTORY_KEY = "prettywraps:history";

const OPENERS = [
  "Plan a birthday surprise 🎂",
  "Something romantic for tonight ❤️",
  "I'm proposing 💍",
  "I have ₦100k — what can I do?",
];

const GREETING: Message = {
  id: "greeting",
  role: "assistant",
  content: `Hi love, welcome to ${brand.name} 💜\n\nI'm your surprise concierge. Tell me who we're celebrating, roughly when and where, and what you'd like to spend — I'll design something beautiful and price it for you in a couple of minutes.`,
  events: [],
};

export function Concierge({ seedMessage }: { seedMessage?: string }) {
  const [messages, setMessages] = useState<Message[]>([GREETING]);
  const [input, setInput] = useState("");
  const [streaming, setStreaming] = useState(false);
  const [notice, setNotice] = useState<string | null>(null);
  const [identity, setIdentity] = useState<Identity>({});

  const scrollRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const seedHandled = useRef(false);

  // --- Returning-customer memory (kept on this device, sent with each request).
  useEffect(() => {
    try {
      const savedIdentity = localStorage.getItem(IDENTITY_KEY);
      if (savedIdentity) setIdentity(JSON.parse(savedIdentity));

      const savedHistory = localStorage.getItem(HISTORY_KEY);
      if (savedHistory) {
        const parsed = JSON.parse(savedHistory) as Message[];
        if (Array.isArray(parsed) && parsed.length > 0) setMessages(parsed);
      }
    } catch {
      // Corrupted storage shouldn't break the chat — just start fresh.
    }
  }, []);

  useEffect(() => {
    if (messages.length <= 1) return;
    try {
      // Keep the tail only, so storage can't grow without bound.
      localStorage.setItem(HISTORY_KEY, JSON.stringify(messages.slice(-24)));
    } catch {
      /* storage full or unavailable — not worth interrupting the customer */
    }
  }, [messages]);

  // Keep the newest message in view as tokens arrive.
  useEffect(() => {
    scrollRef.current?.scrollTo({
      top: scrollRef.current.scrollHeight,
      behavior: "smooth",
    });
  }, [messages, streaming]);

  const send = useCallback(
    async (text: string) => {
      const trimmed = text.trim();
      if (!trimmed || streaming) return;

      // Pick up a phone number the customer types, so we can recognise them later.
      const phoneMatch = trimmed.match(/(?:\+?234|0)\d{9,10}/);
      if (phoneMatch) {
        const next = { ...identity, phone: phoneMatch[0] };
        setIdentity(next);
        try {
          localStorage.setItem(IDENTITY_KEY, JSON.stringify(next));
        } catch {
          /* ignore */
        }
      }

      const userMessage: Message = {
        id: `u${Date.now()}`,
        role: "user",
        content: trimmed,
        events: [],
      };
      const assistantId = `a${Date.now()}`;

      const nextMessages = [...messages, userMessage];
      setMessages([...nextMessages, { id: assistantId, role: "assistant", content: "", events: [] }]);
      setInput("");
      setStreaming(true);

      const patchAssistant = (fn: (m: Message) => Message) =>
        setMessages((prev) => prev.map((m) => (m.id === assistantId ? fn(m) : m)));

      try {
        const res = await fetch("/api/chat", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            messages: nextMessages
              // The greeting is UI-only; the model shouldn't see it as its own turn.
              .filter((m) => m.id !== "greeting")
              .map((m) => ({ role: m.role, content: m.content })),
            identity: { phone: identity.phone, instagram: identity.instagram },
          }),
        });

        if (!res.ok || !res.body) {
          throw new Error(`Request failed (${res.status})`);
        }

        const reader = res.body.getReader();
        const decoder = new TextDecoder();
        let buffer = "";

        while (true) {
          const { done, value } = await reader.read();
          if (done) break;

          buffer += decoder.decode(value, { stream: true });
          const lines = buffer.split("\n");
          // The last element may be an incomplete line — hold it for the next chunk.
          buffer = lines.pop() ?? "";

          for (const line of lines) {
            if (!line.trim()) continue;
            let chunk: Record<string, unknown>;
            try {
              chunk = JSON.parse(line);
            } catch {
              continue; // Skip malformed lines rather than aborting the stream.
            }

            if (chunk.type === "text") {
              patchAssistant((m) => ({ ...m, content: m.content + String(chunk.text) }));
            } else if (chunk.type === "event") {
              patchAssistant((m) => ({
                ...m,
                events: [...m.events, chunk.event as ConciergeEvent],
              }));
            } else if (chunk.type === "notice") {
              setNotice(String(chunk.text));
            } else if (chunk.type === "error") {
              patchAssistant((m) => ({
                ...m,
                content: m.content || String(chunk.text),
              }));
            }
          }
        }
      } catch {
        patchAssistant((m) => ({
          ...m,
          content:
            m.content ||
            `I couldn't reach my planning desk just then. Please try again — or message us directly on WhatsApp at ${brand.whatsappDisplay} and we'll take care of you personally 💜`,
        }));
      } finally {
        setStreaming(false);
        inputRef.current?.focus();
      }
    },
    [messages, streaming, identity],
  );

  // A package card elsewhere on the page can hand the conversation a starting line.
  useEffect(() => {
    if (seedMessage && !seedHandled.current) {
      seedHandled.current = true;
      void send(seedMessage);
    }
  }, [seedMessage, send]);

  const showOpeners = messages.length === 1 && !streaming;

  return (
    // dvh, not vh: on mobile browsers vh ignores the collapsing address bar,
    // which pushes the composer off-screen exactly when someone starts typing.
    <div className="surface flex h-[min(680px,72dvh)] flex-col overflow-hidden rounded-4xl">
      {/* Header */}
      <div className="flex items-center gap-3 px-5 py-4 border-b border-white/10 bg-gradient-to-r from-violet-600/20 to-transparent">
        <div className="relative">
          <div className="grid h-10 w-10 place-items-center rounded-full bg-gradient-to-br from-violet-500 to-violet-700 text-lg">
            💜
          </div>
          <span className="absolute -bottom-0.5 -right-0.5 h-3 w-3 rounded-full border-2 border-plum-900 bg-emerald-400" />
        </div>
        <div className="min-w-0">
          <p className="font-display text-lg leading-tight text-cream">
            Prettywraps Concierge
          </p>
          <p className="text-xs text-cream/50">
            {streaming ? "Designing your surprise…" : "Online · replies instantly"}
          </p>
        </div>
      </div>

      {notice && (
        <p className="px-5 py-2 text-[11px] text-gold-300/80 bg-gold-400/5 border-b border-gold-400/10">
          {notice}
        </p>
      )}

      {/* Messages */}
      <div ref={scrollRef} className="pretty-scroll flex-1 overflow-y-auto px-4 py-5 space-y-4">
        {messages.map((message) => (
          <div key={message.id}>
            <MessageBubble message={message} streaming={streaming} />
            {message.events.map((event, i) =>
              event.type === "quote" ? (
                <QuoteCard
                  key={`${message.id}-q${i}`}
                  quote={event.quote}
                  whatsappMessage={event.whatsappMessage}
                />
              ) : (
                <BookingCard
                  key={`${message.id}-b${i}`}
                  bookingRef={event.ref}
                  status={event.status}
                  whatsappMessage={event.whatsappMessage}
                />
              ),
            )}
          </div>
        ))}

        <AnimatePresence>
          {showOpeners && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              transition={{ delay: 0.3 }}
              className="flex flex-wrap gap-2 pt-1"
            >
              {OPENERS.map((opener) => (
                <button
                  key={opener}
                  onClick={() => void send(opener)}
                  className="rounded-full border border-violet-400/25 bg-violet-500/10 px-3.5 py-2 text-xs text-violet-200 transition hover:border-gold-400/40 hover:bg-violet-500/20 active:scale-95"
                >
                  {opener}
                </button>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Composer */}
      <div className="border-t border-white/10 p-3">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            void send(input);
          }}
          className="flex items-end gap-2"
        >
          <textarea
            ref={inputRef}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                void send(input);
              }
            }}
            rows={1}
            placeholder="Tell me what you're planning…"
            aria-label="Message the concierge"
            className="pretty-scroll max-h-32 flex-1 resize-none rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-base text-cream outline-none transition placeholder:text-cream/35 focus:border-violet-400/50 focus:bg-white/[0.07] sm:text-sm"
          />
          <button
            type="submit"
            disabled={!input.trim() || streaming}
            aria-label="Send message"
            className="grid h-11 w-11 shrink-0 place-items-center rounded-full bg-gradient-to-br from-violet-500 to-violet-700 text-white shadow-lg shadow-violet-600/30 transition disabled:opacity-30 disabled:shadow-none enabled:hover:brightness-110 enabled:active:scale-95"
          >
            <svg viewBox="0 0 24 24" fill="none" className="h-5 w-5">
              <path
                d="M5 12h14M13 6l6 6-6 6"
                stroke="currentColor"
                strokeWidth="1.8"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </button>
        </form>
      </div>
    </div>
  );
}

function MessageBubble({ message, streaming }: { message: Message; streaming: boolean }) {
  const isUser = message.role === "user";
  const isEmpty = !message.content && !isUser;

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
      className={`flex ${isUser ? "justify-end" : "justify-start"}`}
    >
      <div
        className={`max-w-[85%] rounded-3xl px-4 py-3 text-sm leading-relaxed ${
          isUser
            ? "rounded-br-lg bg-gradient-to-br from-violet-600 to-violet-700 text-white"
            : "rounded-bl-lg border border-white/10 bg-white/[0.06] text-cream/90"
        }`}
      >
        {isEmpty && streaming ? (
          <span className="flex gap-1 py-1" aria-label="Concierge is typing">
            <Dot delay="0s" />
            <Dot delay="0.15s" />
            <Dot delay="0.3s" />
          </span>
        ) : (
          <FormattedText text={message.content} />
        )}
      </div>
    </motion.div>
  );
}

function Dot({ delay }: { delay: string }) {
  return (
    <span
      className="animate-dot h-1.5 w-1.5 rounded-full bg-violet-300"
      style={{ animationDelay: delay }}
    />
  );
}

/** Renders the light markdown the concierge uses: **bold**, bullets, blank lines. */
function FormattedText({ text }: { text: string }) {
  return (
    <>
      {text.split("\n").map((line, i) => {
        if (!line.trim()) return <div key={i} className="h-2" />;

        const isBullet = /^\s*[•\-*]\s+/.test(line);
        const content = line.replace(/^\s*[•\-*]\s+/, "");
        const parts = content.split(/(\*\*[^*]+\*\*)/g);

        const rendered = parts.map((part, j) =>
          part.startsWith("**") && part.endsWith("**") ? (
            <strong key={j} className="font-semibold text-gold-300">
              {part.slice(2, -2)}
            </strong>
          ) : (
            <span key={j}>{part}</span>
          ),
        );

        return isBullet ? (
          <div key={i} className="flex gap-2 py-0.5">
            <span className="text-gold-400/70 select-none">•</span>
            <span>{rendered}</span>
          </div>
        ) : (
          <p key={i}>{rendered}</p>
        );
      })}
    </>
  );
}
