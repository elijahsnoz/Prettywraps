import type { CSSProperties, ReactNode } from "react";

/**
 * Soft fade-and-rise as sections scroll into view.
 *
 * Deliberately a server component with no JavaScript: the animation is a
 * scroll-linked CSS animation, and the content is visible by default. Browsers
 * without `animation-timeline` support just show it immediately, and nothing
 * ever depends on a bundle downloading first — which matters when nearly all
 * our visitors are on mobile networks.
 */
export function Reveal({
  children,
  delay = 0,
  className = "",
}: {
  children: ReactNode;
  delay?: number;
  className?: string;
}) {
  const style: CSSProperties | undefined =
    delay > 0 ? { animationDelay: `${delay}s` } : undefined;

  return (
    <div className={`reveal ${className}`} style={style}>
      {children}
    </div>
  );
}
