import type { Diagnostic, LintRule } from "@cmdgen/contracts/diagnostic";
import { hasBlockingError, isDestructive, sortDiagnostics } from "@cmdgen/contracts/diagnostic";

export interface LintResult<TSpec = unknown> {
  diagnostics: Diagnostic<TSpec>[];
  /** The command is wrong or the underlying tool will reject it. */
  hasErrors: boolean;
  /** The command can destroy data; require explicit consent before showing it as ready. */
  isDestructive: boolean;
  counts: Record<Diagnostic<TSpec>["level"], number>;
}

export function lint<TSpec>(spec: TSpec, rules: readonly LintRule<TSpec>[]): LintResult<TSpec> {
  const diagnostics: Diagnostic<TSpec>[] = [];

  for (const rule of rules) {
    try {
      diagnostics.push(...rule.check(spec));
    } catch (error) {
      // A broken rule must never take down the whole panel.
      diagnostics.push({
        code: rule.code,
        level: "warning",
        message: `Lint rule ${rule.code} failed to run.`,
        detail: error instanceof Error ? error.message : String(error),
      });
    }
  }

  const sorted = sortDiagnostics(diagnostics);

  return {
    diagnostics: sorted,
    hasErrors: hasBlockingError(sorted),
    isDestructive: isDestructive(sorted),
    counts: {
      error: sorted.filter((d) => d.level === "error").length,
      destructive: sorted.filter((d) => d.level === "destructive").length,
      warning: sorted.filter((d) => d.level === "warning").length,
      info: sorted.filter((d) => d.level === "info").length,
    },
  };
}

/** Apply every diagnostic that offers a mechanical fix, in code order. */
export function applyAllFixes<TSpec>(spec: TSpec, rules: readonly LintRule<TSpec>[]): TSpec {
  return lint(spec, rules).diagnostics.reduce(
    (current, d) => (d.fix ? d.fix.apply(current) : current),
    spec,
  );
}
