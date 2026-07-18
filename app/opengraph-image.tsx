import { readFile } from "node:fs/promises";
import path from "node:path";
import { ImageResponse } from "next/og";
import { brand } from "@/lib/brand";

export const runtime = "nodejs";
export const alt = `${brand.name} — ${brand.tagline}`;
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

/**
 * The card people see when the site is shared on WhatsApp, Instagram, or X.
 *
 * Most of our traffic arrives through a shared link, so this is often the very
 * first impression of the brand — worth rendering properly rather than letting
 * the platform crop the square logo.
 */
export default async function OpengraphImage() {
  const logoData = await readFile(
    path.join(process.cwd(), "app", "prettywrapslogo.jpg"),
  );
  const logoSrc = `data:image/jpeg;base64,${logoData.toString("base64")}`;

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          background:
            "linear-gradient(135deg, #0e0518 0%, #2a1147 45%, #4f2280 100%)",
          padding: 72,
        }}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={logoSrc}
          alt=""
          width={132}
          height={132}
          style={{ borderRadius: 28, objectFit: "cover" }}
        />

        <div
          style={{
            display: "flex",
            fontSize: 30,
            letterSpacing: 10,
            textTransform: "uppercase",
            color: "#e8c87e",
            marginTop: 34,
          }}
        >
          Prettywraps NG
        </div>

        <div
          style={{
            display: "flex",
            textAlign: "center",
            fontSize: 62,
            lineHeight: 1.15,
            color: "#fbf7f2",
            marginTop: 22,
            maxWidth: 900,
          }}
        >
          Don&apos;t just say Happy Birthday.
        </div>

        <div
          style={{
            display: "flex",
            textAlign: "center",
            fontSize: 62,
            lineHeight: 1.15,
            color: "#e8c87e",
            maxWidth: 900,
          }}
        >
          Create unforgettable memories.
        </div>

        <div
          style={{
            display: "flex",
            fontSize: 26,
            color: "rgba(251,247,242,0.6)",
            marginTop: 32,
          }}
        >
          AI surprise concierge · Lagos · Abuja · Port Harcourt
        </div>
      </div>
    ),
    size,
  );
}
