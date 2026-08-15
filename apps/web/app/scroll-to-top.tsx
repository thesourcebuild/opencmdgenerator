"use client";

import { useEffect, useState, type RefObject } from "react";
import { cn } from "@cmdgen/ui";

export interface ScrollToTopProps {
  containerRef: RefObject<HTMLElement | null>;
  /** Only appears once the container has been scrolled down past this many pixels. */
  threshold?: number;
}

/**
 * Floating button that appears once `containerRef`'s element has been
 * scrolled down, and smooth-scrolls it back to the top on click. Watches the
 * container directly (not `window`) since the app's scrollable area is
 * `<main>`'s own `overflow-y-auto`, not the page itself.
 */
export function ScrollToTop({ containerRef, threshold = 300 }: ScrollToTopProps) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    const onScroll = () => setVisible(el.scrollTop > threshold);
    onScroll();
    el.addEventListener("scroll", onScroll, { passive: true });
    return () => el.removeEventListener("scroll", onScroll);
  }, [containerRef, threshold]);

  if (!visible) return null;

  return (
    <button
      type="button"
      onClick={() => containerRef.current?.scrollTo({ top: 0, behavior: "smooth" })}
      aria-label="Scroll to top"
      title="Scroll to top"
      className={cn(
        "fixed bottom-6 right-6 z-20 flex h-10 w-10 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-600 shadow-lg transition-colors hover:bg-slate-100 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-300 dark:hover:bg-slate-800",
      )}
    >
      <ArrowUpIcon />
    </button>
  );
}

function ArrowUpIcon() {
  return (
    <svg
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <line x1="12" y1="19" x2="12" y2="5" />
      <polyline points="5 12 12 5 19 12" />
    </svg>
  );
}
