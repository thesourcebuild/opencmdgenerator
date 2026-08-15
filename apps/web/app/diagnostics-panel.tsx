"use client";

import type { Diagnostic, DiagnosticLevel } from "@cmdgen/contracts";
import type { LintResult } from "@cmdgen/engine";
import { Button, Panel, cn } from "@cmdgen/ui";

const LEVEL_STYLE: Record<DiagnosticLevel, string> = {
  error: "border-l-(--color-severity-error) bg-red-50/60 dark:bg-red-950/20",
  destructive: "border-l-(--color-severity-destructive) bg-orange-50/60 dark:bg-orange-950/20",
  warning: "border-l-(--color-severity-warning) bg-amber-50/60 dark:bg-amber-950/20",
  info: "border-l-(--color-severity-info) bg-blue-50/60 dark:bg-blue-950/20",
};

const LEVEL_LABEL: Record<DiagnosticLevel, string> = {
  error: "Error",
  destructive: "Destructive",
  warning: "Warning",
  info: "Note",
};

/**
 * Generic over the spec type so every command's builder can reuse this panel
 * with its own `lint(spec)` result — the panel itself has no idea what a
 * "spec" contains, it only renders `Diagnostic`s and offers their fixes.
 */
export function DiagnosticsPanel<TSpec>({
  spec,
  result,
  onApplyFix,
}: {
  spec: TSpec;
  result: LintResult<TSpec>;
  onApplyFix: (next: TSpec) => void;
}) {
  return (
    <Panel
      title="Checks"
      description={
        result.diagnostics.length === 0
          ? "Nothing to flag."
          : `${result.counts.error} errors · ${result.counts.destructive} destructive · ${result.counts.warning} warnings · ${result.counts.info} notes`
      }
    >
      {result.diagnostics.length === 0 ? (
        <p className="text-xs text-slate-500 dark:text-slate-400">
          This command looks internally consistent.
        </p>
      ) : (
        <ul className="space-y-2">
          {result.diagnostics.map((d: Diagnostic<TSpec>) => (
            <li
              key={`${d.code}-${d.message}`}
              className={cn("rounded-r border-l-4 px-3 py-2", LEVEL_STYLE[d.level])}
            >
              <p className="text-xs font-semibold">
                <span className="font-mono text-slate-500 dark:text-slate-400">{d.code}</span>{" "}
                {LEVEL_LABEL[d.level]} — {d.message}
              </p>
              {d.detail && (
                <p className="mt-1 text-xs text-slate-600 dark:text-slate-400">{d.detail}</p>
              )}
              {d.fix && (
                // Its own row, not inline with the text: this panel lives in a
                // narrow sidebar, and a flex row with a shrink-0 button forced
                // long fix labels (e.g. "Add -WhatIf to preview first") to
                // overflow past the sidebar edge while squeezing the message
                // text down to a one-word-per-line column.
                <div className="mt-2">
                  <Button size="sm" variant="secondary" onClick={() => onApplyFix(d.fix!.apply(spec))}>
                    {d.fix.label}
                  </Button>
                </div>
              )}
            </li>
          ))}
        </ul>
      )}
    </Panel>
  );
}
