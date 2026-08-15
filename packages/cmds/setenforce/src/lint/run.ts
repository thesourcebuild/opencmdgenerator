import { applyAllFixes as applyAllFixesGeneric, lint as lintGeneric, type LintResult as LintResultGeneric } from "@cmdgen/engine";
import type { SetenforceSpec } from "../spec";
import { RULES } from "./rules";

export type LintResult = LintResultGeneric<SetenforceSpec>;

export function lint(spec: SetenforceSpec): LintResult {
  return lintGeneric(spec, RULES);
}

/** Apply every diagnostic that offers a mechanical fix, in code order. */
export function applyAllFixes(spec: SetenforceSpec): SetenforceSpec {
  return applyAllFixesGeneric(spec, RULES);
}
