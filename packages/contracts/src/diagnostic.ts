/**
 * error       — the command will not do what was asked, or the tool will reject it
 * destructive — the command can delete or overwrite data; needs deliberate consent
 * warning     — legal but wasteful, redundant, or a likely mistake
 * info        — semantics worth knowing before running it
 */
export type DiagnosticLevel = "error" | "destructive" | "warning" | "info";

export const DIAGNOSTIC_LEVEL_ORDER: readonly DiagnosticLevel[] = [
  "error",
  "destructive",
  "warning",
  "info",
];

export interface DiagnosticFix<TSpec = unknown> {
  label: string;
  /** Pure: returns a corrected spec, never mutates. */
  apply: (spec: TSpec) => TSpec;
}

export interface Diagnostic<TSpec = unknown> {
  /** Stable identifier, e.g. "RS001". Never reuse a retired code. */
  code: string;
  level: DiagnosticLevel;
  /** One line, shown inline in the diagnostics panel. */
  message: string;
  /** Optional paragraph explaining why. */
  detail?: string;
  /** Flag ids this diagnostic points at, so the form can highlight them. */
  flagIds?: string[];
  /** Which spec field it points at, when not a flag. Command-specific field names, so left as a bare string. */
  field?: string;
  fix?: DiagnosticFix<TSpec>;
}

export interface LintRule<TSpec = unknown> {
  code: string;
  /** Returns [] when the rule does not apply. Must be pure. */
  check: (spec: TSpec) => Diagnostic<TSpec>[];
}

export function sortDiagnostics<TSpec>(list: readonly Diagnostic<TSpec>[]): Diagnostic<TSpec>[] {
  return [...list].sort((a, b) => {
    const d =
      DIAGNOSTIC_LEVEL_ORDER.indexOf(a.level) - DIAGNOSTIC_LEVEL_ORDER.indexOf(b.level);
    return d !== 0 ? d : a.code.localeCompare(b.code);
  });
}

export function hasBlockingError<TSpec>(list: readonly Diagnostic<TSpec>[]): boolean {
  return list.some((d) => d.level === "error");
}

export function isDestructive<TSpec>(list: readonly Diagnostic<TSpec>[]): boolean {
  return list.some((d) => d.level === "destructive");
}
