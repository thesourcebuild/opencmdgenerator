"use client";

import { useEffect, type HTMLAttributes, type ReactNode } from "react";
import { cn } from "./cn";

export interface DialogProps extends Omit<HTMLAttributes<HTMLDivElement>, "title"> {
  open: boolean;
  /** Called on Escape or a backdrop click — always the safe/cancel path, never confirm. */
  onClose: () => void;
  title?: ReactNode;
  children?: ReactNode;
  /** Set false for a confirmation that must be answered via its own explicit buttons only. */
  dismissible?: boolean;
}

/**
 * A real modal — deliberately not a `Panel` with different borders. Panels
 * are persistent, revisitable, sit-alongside-other-content chrome; a modal
 * is a full-screen-dimming interruption that demands one answer before
 * anything else happens. Reusing Panel styling for something like a
 * run-confirmation step risks it reading as "more of the same advisory
 * noise" rather than "this is the moment before something real happens."
 */
export function Dialog({ open, onClose, title, children, dismissible = true, className, ...props }: DialogProps) {
  useEffect(() => {
    if (!open || !dismissible) return;
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };
    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [open, dismissible, onClose]);

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/60 p-4 backdrop-blur-sm"
      onClick={dismissible ? onClose : undefined}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-label={typeof title === "string" ? title : undefined}
        onClick={(event) => event.stopPropagation()}
        className={cn(
          "w-full max-w-lg rounded-xl border border-slate-200 bg-white p-5 shadow-2xl dark:border-slate-700 dark:bg-slate-900",
          className,
        )}
        {...props}
      >
        {title && <h2 className="text-base font-semibold text-slate-900 dark:text-slate-100">{title}</h2>}
        <div className={title ? "mt-3" : undefined}>{children}</div>
      </div>
    </div>
  );
}
