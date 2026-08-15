"use client";

import { useState, type ReactNode } from "react";
import type { WhoamiPlatform } from "@cmdgen/whoami";
import { Panel, cn } from "@cmdgen/ui";

export const isWindows = (p: WhoamiPlatform) =>
  p === "windows-cmd" ||
  p === "windows-powershell" ||
  p === "windows-cygwin" ||
  p === "windows-msys" ||
  p === "windows-wsl";

/**
 * whoami is the same binary on Linux and macOS (POSIX coreutils whoami), so
 * `WhoamiPlatform` has no separate "mac" value — just `"posix"` — but the UI
 * still shows the same Linux/Mac/Windows 3-button shape every other command's
 * target selector uses. Linux and Mac both set the identical `"posix"` value;
 * which stays highlighted is local, cosmetic-only state, not derived from
 * `value` (which cannot tell them apart) — see `RsyncTargetSelector`'s doc
 * comment for the same trick. Cygwin/MSYS2/WSL live under the "Windows" button
 * (same placement as every other command's Windows sub-choices — see
 * `@cmdgen/mkdir`'s `MkdirTargetSelector`), even though they render bare
 * POSIX-style output — the sub-choice between cmd/powershell/cygwin/msys/wsl
 * itself lives in the Generated Command panel's shell picker (`WhoamiPreview`),
 * same as mkdir's.
 */
export function WhoamiTargetSelector({ value, onChange }: { value: WhoamiPlatform; onChange: (next: WhoamiPlatform) => void }) {
  const [posixOs, setPosixOs] = useState<"linux" | "mac">("linux");
  const windows = isWindows(value);
  return (
    <Panel title="Target platform" description="Determines available flags.">
      <div className="flex flex-wrap gap-1">
        <PlatformButton
          active={!windows && posixOs === "linux"}
          onClick={() => {
            setPosixOs("linux");
            onChange("posix");
          }}
        >
          Linux
        </PlatformButton>
        <PlatformButton
          active={!windows && posixOs === "mac"}
          onClick={() => {
            setPosixOs("mac");
            onChange("posix");
          }}
        >
          Mac
        </PlatformButton>
        <PlatformButton active={windows} onClick={() => (windows ? undefined : onChange("windows-powershell"))}>
          Windows
        </PlatformButton>
      </div>
    </Panel>
  );
}

function PlatformButton({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "rounded px-2 py-1 text-xs transition-colors",
        active
          ? "bg-slate-900 text-white dark:bg-slate-100 dark:text-slate-900"
          : "text-slate-600 hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-800",
      )}
    >
      {children}
    </button>
  );
}
