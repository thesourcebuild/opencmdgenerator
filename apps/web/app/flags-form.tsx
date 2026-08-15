"use client";

import { useState } from "react";
import type { FlagCatalogue, FlagDef, FlagEnumOption, FlagGroupMeta } from "@cmdgen/engine";
import { isAvailableOn, orderedGroups } from "@cmdgen/engine";
import type { FlagValue, FlagValues } from "@cmdgen/contracts";
import { cn } from "@cmdgen/ui";

export interface FlagsFormProps {
  catalogue: FlagCatalogue;
  groups: Record<string, FlagGroupMeta>;
  flags: FlagValues;
  /** Restricts which flags are shown, via each flag's `availableOn` (see @cmdgen/engine). Omit to show every flag. */
  tag?: string;
  onChange: (id: string, value: FlagValue | undefined) => void;
}

/**
 * Renders any command's catalogue — grouped, one control per `FlagKind` —
 * driven purely by `FlagDef` metadata. Shared by every command's builder so
 * adding a command never means writing a new form by hand, only new
 * catalogue data. A group whose metadata sets `collapsedByDefault` still
 * renders — just folded shut behind its header — rather than vanishing
 * outright, which previously made every such group's flags permanently
 * unreachable in the UI.
 */
export function FlagsForm({ catalogue, groups, flags, tag, onChange }: FlagsFormProps) {
  const [expanded, setExpanded] = useState<Set<string>>(new Set());

  return (
    <div className="space-y-4">
      {orderedGroups(groups).map((group) => {
        const groupFlags = catalogue.flagsInGroup(group.id).filter((f) => isAvailableOn(f, tag));
        if (groupFlags.length === 0) return null;

        const isOpen = !group.collapsedByDefault || expanded.has(group.id);

        return (
          <div key={group.id}>
            {group.collapsedByDefault ? (
              <button
                type="button"
                onClick={() =>
                  setExpanded((prev) => {
                    const next = new Set(prev);
                    if (next.has(group.id)) next.delete(group.id);
                    else next.add(group.id);
                    return next;
                  })
                }
                className="mb-1 flex w-full items-center gap-1.5 text-left text-[11px] font-semibold uppercase tracking-wide text-slate-500 hover:text-slate-700 dark:hover:text-slate-300"
                aria-expanded={isOpen}
              >
                <ChevronIcon collapsed={!isOpen} />
                {group.label}
              </button>
            ) : (
              <p className="mb-1 text-[11px] font-semibold uppercase tracking-wide text-slate-500">{group.label}</p>
            )}
            {isOpen && (
              <div className="flex flex-col gap-2">
                {groupFlags.map((flag) => (
                  <FlagControl
                    key={flag.id}
                    flag={flag}
                    value={flags[flag.id]}
                    onChange={(value) => onChange(flag.id, value)}
                  />
                ))}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}

/**
 * An enum option's text, with the token it actually emits appended when the
 * prose label does not already name it.
 *
 * A boolean flag's control shows its token (`-l — Long format …`), but an enum's
 * only showed prose — so options like "Treat patterns as shell wildcards" gave
 * no clue that they emit `--wildcards`. In a tool whose entire job is producing
 * a command, that is the one thing the control must not hide. `<option>` can
 * hold text only, hence a suffix rather than markup.
 */
function enumOptionLabel(opt: FlagEnumOption): string {
  const token = opt.renders.trim();
  if (token === "" || opt.label.includes(token)) return opt.label;
  return `${opt.label} (${token})`;
}

function ChevronIcon({ collapsed }: { collapsed: boolean }) {
  return (
    <svg
      width="10"
      height="10"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={cn("shrink-0 transition-transform", collapsed ? "-rotate-90" : "")}
    >
      <polyline points="6 9 12 15 18 9" />
    </svg>
  );
}

function FlagControl({
  flag,
  value,
  onChange,
}: {
  flag: FlagDef;
  value: FlagValue | undefined;
  onChange: (value: FlagValue | undefined) => void;
}) {
  const label = flag.preferShort && flag.short ? flag.short : flag.long;

  switch (flag.kind) {
    case "boolean": {
      const on = value === true;
      return (
        <label className="flex items-start gap-2 text-xs" title={flag.detail}>
          <input
            type="checkbox"
            checked={on}
            onChange={(e) => onChange(e.target.checked || undefined)}
            className="mt-0.5"
          />
          <span>
            <span className="font-mono">{label}</span> — {flag.summary}
          </span>
        </label>
      );
    }

    case "enum": {
      const current = typeof value === "string" ? value : (flag.options?.[0]?.value ?? "");
      return (
        <label className="flex flex-col gap-1 text-xs" title={flag.detail}>
          <span className="font-medium">{flag.summary}</span>
          <select
            value={current}
            onChange={(e) => {
              const next = e.target.value;
              onChange(next === "" || next === "none" ? undefined : next);
            }}
            className={cn(
              "h-8 w-full max-w-xs rounded-md border border-slate-300 bg-white px-2 font-mono text-xs",
              "dark:border-slate-700 dark:bg-slate-950",
            )}
          >
            {flag.options?.map((opt) => (
              <option key={opt.value} value={opt.value} title={opt.summary}>
                {enumOptionLabel(opt)}
              </option>
            ))}
          </select>
        </label>
      );
    }

    case "number": {
      const current = typeof value === "number" ? value : "";
      return (
        <label className="flex flex-col gap-1 text-xs" title={flag.detail}>
          <span className="font-medium">
            <span className="font-mono">{label}</span> — {flag.summary}
          </span>
          <input
            type="number"
            value={current}
            placeholder={flag.arg?.placeholder}
            min={flag.arg?.min}
            max={flag.arg?.max}
            onChange={(e) => {
              const raw = e.target.value;
              onChange(raw === "" ? undefined : Number(raw));
            }}
            className="h-8 w-32 rounded-md border border-slate-300 bg-white px-2 font-mono text-xs dark:border-slate-700 dark:bg-slate-950"
          />
        </label>
      );
    }

    case "text":
    case "path": {
      const current = typeof value === "string" ? value : "";
      return (
        <label className="flex flex-col gap-1 text-xs" title={flag.detail}>
          <span className="font-medium">
            <span className="font-mono">{label}</span> — {flag.summary}
          </span>
          <input
            type="text"
            value={current}
            placeholder={flag.arg?.placeholder}
            onChange={(e) => onChange(e.target.value === "" ? undefined : e.target.value)}
            className="h-8 w-full rounded-md border border-slate-300 bg-white px-2 font-mono text-xs dark:border-slate-700 dark:bg-slate-950"
          />
        </label>
      );
    }
  }
}
