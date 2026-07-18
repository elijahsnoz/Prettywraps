import { Header } from "@/components/Header";
import { Hero } from "@/components/Hero";
import { Planner } from "@/components/Planner";
import { Availability } from "@/components/Availability";
import { OrderTracking } from "@/components/OrderTracking";
import { InstagramFeed } from "@/components/InstagramFeed";
import { Footer } from "@/components/Footer";
import { Reveal } from "@/components/Reveal";
import { MobileCTA } from "@/components/MobileCTA";

const CHANNELS = [
  {
    emoji: "💬",
    title: "Website concierge",
    body: "Right here. Chat, get recommendations, and walk away with a quote and a booking reference.",
  },
  {
    emoji: "📱",
    title: "WhatsApp AI",
    body: "Prefer WhatsApp? Message us and we'll pick up exactly where your planning left off.",
  },
  {
    emoji: "📷",
    title: "Instagram DM",
    body: "Saw something on our feed? Slide into the DMs and we'll recreate it for your person.",
  },
];

export default function Home() {
  return (
    <>
      <Header />

      <main>
        <Hero />

        {/* Channels */}
        <section className="relative px-5 py-16">
          <div className="mx-auto max-w-5xl">
            <Reveal className="mb-10 text-center">
              <p className="mb-3 text-[11px] uppercase tracking-[0.22em] text-gold-400/70">
                Three ways to reach us
              </p>
              <h2 className="font-display text-3xl leading-tight text-cream sm:text-4xl">
                Wherever you are, we&apos;re already there
              </h2>
            </Reveal>

            <div className="grid gap-5 sm:grid-cols-3">
              {CHANNELS.map((channel, i) => (
                <Reveal key={channel.title} delay={i * 0.08}>
                  <div className="surface surface-hover h-full rounded-3xl p-6">
                    <span className="text-2xl">{channel.emoji}</span>
                    <h3 className="mt-3 font-display text-xl text-cream">
                      {channel.title}
                    </h3>
                    <p className="mt-2 text-sm leading-relaxed text-cream/55">
                      {channel.body}
                    </p>
                  </div>
                </Reveal>
              ))}
            </div>
          </div>
        </section>

        {/* Concierge + packages */}
        <Planner />

        {/* Availability */}
        <section id="calendar" className="relative overflow-hidden px-4 py-20 sm:px-5 sm:py-24">
          <div className="glow left-[-6%] top-[15%] h-[22rem] w-[22rem] bg-violet-600/20" />

          <div className="relative z-10 mx-auto max-w-5xl">
            <Reveal className="mb-9 text-center">
              <p className="mb-3 text-[11px] uppercase tracking-[0.22em] text-gold-400/70">
                Availability
              </p>
              <h2 className="font-display text-4xl leading-tight text-cream sm:text-5xl">
                Pick your day,
                <span className="text-gilded"> we&apos;ll do the rest</span>
              </h2>
              <p className="mx-auto mt-4 max-w-lg text-sm leading-relaxed text-cream/55">
                We take a limited number of setups each day so every single one
                gets our full attention.
              </p>
            </Reveal>

            <Reveal delay={0.1}>
              <Availability />
            </Reveal>
          </div>
        </section>

        {/* Order tracking */}
        <section id="track" className="relative px-5 py-20 sm:py-24">
          <div className="relative z-10 mx-auto max-w-5xl">
            <Reveal className="mb-9 text-center">
              <p className="mb-3 text-[11px] uppercase tracking-[0.22em] text-gold-400/70">
                Order tracking
              </p>
              <h2 className="font-display text-4xl leading-tight text-cream sm:text-5xl">
                Already booked?
                <span className="text-gilded"> Check in on it</span>
              </h2>
              <p className="mx-auto mt-4 max-w-lg text-sm leading-relaxed text-cream/55">
                Enter the reference we sent you and see exactly where your
                surprise is.
              </p>
            </Reveal>

            <Reveal delay={0.1}>
              <OrderTracking />
            </Reveal>
          </div>
        </section>

        {/* Instagram */}
        <section id="work" className="relative overflow-hidden px-5 py-20 sm:py-24">
          <div className="glow right-[-8%] top-[10%] h-[24rem] w-[24rem] bg-blush-400/15" />

          <div className="relative z-10 mx-auto max-w-6xl">
            <Reveal className="mb-9 text-center">
              <p className="mb-3 text-[11px] uppercase tracking-[0.22em] text-gold-400/70">
                From our feed
              </p>
              <h2 className="font-display text-4xl leading-tight text-cream sm:text-5xl">
                Real moments,
                <span className="text-gilded"> real reactions</span>
              </h2>
            </Reveal>

            <Reveal delay={0.1}>
              <InstagramFeed />
            </Reveal>
          </div>
        </section>
      </main>

      <Footer />
      <MobileCTA />
    </>
  );
}
