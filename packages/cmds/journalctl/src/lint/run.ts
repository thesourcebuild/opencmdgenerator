import { applyAllFixes as applyAllFixesGeneric, lint as lintGeneric, type LintResult as LintResultGeneric } from "@cmdgen/engine";
import type { JournalctlSpec } from "../spec";
import { RULES } from "./rules";

export type LintResult = LintResultGeneric<JournalctlSpec>;

export function lint(spec: JournalctlSpec): LintResult {
  return lintGeneric(spec, RULES);
}

/** Apply every diagnostic that offers a mechanical fix, in code order. */
export function applyAllFixes(spec: JournalctlSpec): JournalctlSpec {
  return applyAllFixesGeneric(spec, RULES);
}
