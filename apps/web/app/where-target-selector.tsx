"use client";

import type { ReactNode } from "react";
import type { WherePlatform } from "@cmdgen/where";
import { Panel, cn } from "@cmdgen/ui";

const LABEL: Record<WherePlatform, string> = {
  cmd: "Command Prompt",
  powershell: "PowerShell",
};

/**
 * Only two real targets exist for `where.exe` — no Linux/Mac buttons like
 * `ShellDialectTargetSelector`, since it has no POSIX form at all. The choice
 * is not cosmetic: PowerShell's built-in `where -> Where-Object` alias
 * silently shadows the real tool, so this app renders the explicit
 * `where.exe` there and plain `where` for cmd.exe — see `@cmdgen/where`'s
 * `WherePlatform` doc comment for the empirical verification.
 */
export function WhereTargetSelector({ value, onChange }: { value: WherePlatform; onChange: (next: WherePlatform) => void }) {
  return (
    <Panel title="Target platform" description="where.exe is Windows-only. PowerShell needs the .exe extension to bypass its own built-in where alias.">
      <div className="flex flex-wrap gap-1">
        {(Object.keys(LABEL) as WherePlatform[]).map((platform) => (
          <PlatformButton key={platform} active={value === platform} onClick={() => onChange(platform)}>
            {LABEL[platform]}
          </PlatformButton>
        ))}
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
