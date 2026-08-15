import { applyAllFixes as applyAllFixesGeneric, lint as lintGeneric, type LintResult as LintResultGeneric } from "@cmdgen/engine";
import type { HistorySpec } from "../spec";
import { RULES } from "./rules";

export type LintResult = LintResultGeneric<HistorySpec>;

export function lint(spec: HistorySpec): LintResult {
  return lintGeneric(spec, RULES);
}

/** Apply every diagnostic that offers a mechanical fix, in code order. */
export function applyAllFixes(spec: HistorySpec): HistorySpec {
  return applyAllFixesGeneric(spec, RULES);
}
