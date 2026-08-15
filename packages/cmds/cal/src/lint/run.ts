import { applyAllFixes as applyAllFixesGeneric, lint as lintGeneric, type LintResult as LintResultGeneric } from "@cmdgen/engine";
import type { CalSpec } from "../spec";
import { RULES } from "./rules";

export type LintResult = LintResultGeneric<CalSpec>;

export function lint(spec: CalSpec): LintResult {
  return lintGeneric(spec, RULES);
}

/** Apply every diagnostic that offers a mechanical fix, in code order. */
export function applyAllFixes(spec: CalSpec): CalSpec {
  return applyAllFixesGeneric(spec, RULES);
}
