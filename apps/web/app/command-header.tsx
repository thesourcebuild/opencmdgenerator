"use client";

import type { CommandManifest, SupportedPlatform, SupportedShell } from "@cmdgen/engine";
import { cn } from "@cmdgen/ui";

const PLATFORM_LABEL: Record<SupportedPlatform, string> = {
  win32: "Windows",
  darwin: "macOS",
  linux: "Linux",
};

const SHELL_LABEL: Record<SupportedShell, string> = {
  posix: "POSIX",
  cmd: "cmd",
  powershell: "PowerShell",
};

function Badge({ children, tone, title }: { children: string; tone: "platform" | "shell"; title?: string }) {
  return (
    <span
      title={title}
      className={cn(
        "rounded border px-1.5 py-px text-[9px] font-medium",
        title && "cursor-help underline decoration-dotted",
        tone === "platform"
          ? "border-slate-200 text-slate-500 dark:border-slate-700 dark:text-slate-400"
          : "border-slate-200 bg-slate-50 text-slate-500 dark:border-slate-700 dark:bg-slate-800/60 dark:text-slate-400",
      )}
    >
      {children}
    </span>
  );
}

/**
 * The main panel's own name + summary + capability badges — shown once,
 * above the sticky "Generated command" panel, for whichever command is
 * currently selected. Separate from the sidebar's per-item summary line.
 */
export function CommandHeader({ manifest }: { manifest: CommandManifest | undefined }) {
  if (!manifest) return null;

  return (
    <div className="mb-4">
      <p className="text-xs text-slate-500 dark:text-slate-400">
        <span className="font-semibold text-slate-700 dark:text-slate-200">{manifest.label}</span> — {manifest.summary}
      </p>
      <div className="mt-1.5 flex flex-wrap items-center gap-1">
        {manifest.platforms.map((p) => (
          <Badge key={p} tone="platform" title={manifest.platformNotes?.[p]}>
            {PLATFORM_LABEL[p]}
          </Badge>
        ))}
        <span className="mx-0.5 text-slate-300 dark:text-slate-700" aria-hidden>
          |
        </span>
        {manifest.shells.map((s) => (
          <Badge key={s} tone="shell">
            {SHELL_LABEL[s]}
          </Badge>
        ))}
      </div>
    </div>
  );
}
