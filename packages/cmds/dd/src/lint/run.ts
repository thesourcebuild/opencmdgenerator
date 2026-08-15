import { applyAllFixes as applyAllFixesGeneric, lint as lintGeneric, type LintResult as LintResultGeneric } from "@cmdgen/engine";
import type { DdSpec } from "../spec";
import { RULES } from "./rules";

export type LintResult = LintResultGeneric<DdSpec>;

export function lint(spec: DdSpec): LintResult {
  return lintGeneric(spec, RULES);
}

/** Apply every diagnostic that offers a mechanical fix, in code order. */
export function applyAllFixes(spec: DdSpec): DdSpec {
  return applyAllFixesGeneric(spec, RULES);
}
