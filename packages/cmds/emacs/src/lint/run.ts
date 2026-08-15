import { applyAllFixes as applyAllFixesGeneric, lint as lintGeneric, type LintResult as LintResultGeneric } from "@cmdgen/engine";
import type { EmacsSpec } from "../spec";
import { RULES } from "./rules";

export type LintResult = LintResultGeneric<EmacsSpec>;

export function lint(spec: EmacsSpec): LintResult {
  return lintGeneric(spec, RULES);
}

/** Apply every diagnostic that offers a mechanical fix, in code order. */
export function applyAllFixes(spec: EmacsSpec): EmacsSpec {
  return applyAllFixesGeneric(spec, RULES);
}
