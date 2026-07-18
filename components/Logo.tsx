import Image from "next/image";
import logo from "@/app/prettywrapslogo.jpg";
import { brand } from "@/lib/brand";

/**
 * The Prettywraps gift-bow mark.
 *
 * Statically imported so Next.js knows the intrinsic dimensions at build time
 * and reserves the space — no layout shift while it loads, which matters on the
 * slow mobile connections most of our visitors are on.
 */
export function Logo({
  size = 40,
  priority = false,
  className = "",
}: {
  size?: number;
  priority?: boolean;
  className?: string;
}) {
  return (
    <span
      className={`relative block shrink-0 overflow-hidden rounded-2xl ring-1 ring-white/15 ${className}`}
      style={{ width: size, height: size }}
    >
      <Image
        src={logo}
        alt={`${brand.name} logo`}
        fill
        sizes={`${size}px`}
        priority={priority}
        placeholder="blur"
        className="object-cover"
      />
    </span>
  );
}

/**
 * Logo plus wordmark, used in the header and footer.
 *
 * The wordmark steps down a size on narrow phones — at 320px the full-size
 * lockup plus the menu button overflowed the header, and because the header is
 * position:fixed that overflow widened the whole document and knocked the
 * centred hero off-centre.
 */
export function LogoLockup({
  size = 36,
  priority = false,
}: {
  size?: number;
  priority?: boolean;
}) {
  return (
    <span className="flex min-w-0 items-center gap-2 sm:gap-2.5">
      <Logo size={size} priority={priority} />
      <span className="font-display text-lg leading-none whitespace-nowrap text-cream sm:text-xl">
        Prettywraps <span className="text-gold-400">NG</span>
      </span>
    </span>
  );
}
