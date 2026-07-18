import type { MetadataRoute } from "next";
import { brand } from "@/lib/brand";

/**
 * Lets customers add Prettywraps to their phone's home screen and reopen it
 * like an app — worth having when almost all traffic is mobile.
 */
export default function manifest(): MetadataRoute.Manifest {
  return {
    name: `${brand.name} — Surprise Concierge`,
    short_name: "Prettywraps",
    description: brand.mission,
    start_url: "/",
    display: "standalone",
    background_color: "#0e0518",
    theme_color: "#0e0518",
    orientation: "portrait",
    categories: ["lifestyle", "shopping", "events"],
    icons: [
      {
        src: "/logo.jpg",
        sizes: "603x624",
        type: "image/jpeg",
        purpose: "any",
      },
    ],
  };
}
