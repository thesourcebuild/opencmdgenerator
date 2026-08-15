import { applyAllFixes as applyAllFixesGeneric, lint as lintGeneric, type LintResult as LintResultGeneric } from "@cmdgen/engine";
import type { LnSpec } from "../spec";
import { RULES } from "./rules";

export type LintResult = LintResultGeneric<LnSpec>;

export function lint(spec: LnSpec): LintResult {
  return lintGeneric(spec, RULES);
}

/** Apply every diagnostic that offers a mechanical fix, in code order. */
export function applyAllFixes(spec: LnSpec): LnSpec {
  return applyAllFixesGeneric(spec, RULES);
}
