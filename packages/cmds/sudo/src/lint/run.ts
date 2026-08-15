import { applyAllFixes as applyAllFixesGeneric, lint as lintGeneric, type LintResult as LintResultGeneric } from "@cmdgen/engine";
import type { SudoSpec } from "../spec";
import { RULES } from "./rules";

export type LintResult = LintResultGeneric<SudoSpec>;

export function lint(spec: SudoSpec): LintResult {
  return lintGeneric(spec, RULES);
}

/** Apply every diagnostic that offers a mechanical fix, in code order. */
export function applyAllFixes(spec: SudoSpec): SudoSpec {
  return applyAllFixesGeneric(spec, RULES);
}
