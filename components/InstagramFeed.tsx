"use client";

import Script from "next/script";
import { useEffect } from "react";
import { brand } from "@/lib/brand";

declare global {
  interface Window {
    instgrm?: { Embeds: { process: () => void } };
  }
}

/**
 * Instagram gallery.
 *
 * Instagram does not allow a third-party site to pull a profile feed without
 * the Meta Graph API (Business account + app review). So this uses Instagram's
 * OFFICIAL post embed instead — each URL in `brand.instagramPosts` renders as a
 * real, live Instagram card that stays in sync with the post.
 *
 * To add work to this gallery: paste more post URLs into `lib/brand.ts`.
 */
export function InstagramFeed() {
  useEffect(() => {
    // Re-process after mount in case the script loaded before this rendered.
    window.instgrm?.Embeds.process();
  }, []);

  return (
    <>
      <Script
        src="https://www.instagram.com/embed.js"
        strategy="lazyOnload"
        onReady={() => window.instgrm?.Embeds.process()}
      />

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {brand.instagramPosts.map((url) => (
          <div
            key={url}
            className="surface overflow-hidden rounded-3xl [&_.instagram-media]:!m-0 [&_.instagram-media]:!min-w-0 [&_.instagram-media]:!w-full [&_.instagram-media]:!rounded-3xl [&_.instagram-media]:!border-0 [&_.instagram-media]:!shadow-none"
          >
            <blockquote
              className="instagram-media"
              data-instgrm-permalink={url}
              data-instgrm-version="14"
              style={{ background: "transparent", margin: 0, width: "100%" }}
            >
              {/* Shown until Instagram's script swaps in the real embed. */}
              <a
                href={url}
                target="_blank"
                rel="noopener noreferrer"
                className="flex h-64 flex-col items-center justify-center gap-3 text-center"
              >
                <span className="text-3xl">📸</span>
                <span className="text-sm text-cream/60">
                  View this moment on Instagram
                </span>
              </a>
            </blockquote>
          </div>
        ))}

        {/* Follow card — always last in the grid. */}
        <a
          href={brand.instagramUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="surface surface-hover flex min-h-64 flex-col items-center justify-center gap-4 rounded-3xl p-8 text-center"
        >
          <span className="grid h-14 w-14 place-items-center rounded-2xl bg-gradient-to-br from-blush-400 via-violet-500 to-gold-400 text-2xl">
            📷
          </span>
          <div>
            <p className="font-display text-2xl text-cream">See it all</p>
            <p className="mt-1 text-sm text-cream/55">
              Every setup, every reaction, every happy tear.
            </p>
          </div>
          <span className="rounded-full border border-gold-400/30 bg-gold-400/10 px-5 py-2.5 text-sm text-gold-300">
            @{brand.instagramHandle}
          </span>
        </a>
      </div>
    </>
  );
}
