import { applyAllFixes as applyAllFixesGeneric, lint as lintGeneric, type LintResult as LintResultGeneric } from "@cmdgen/engine";
import type { PwdSpec } from "../spec";
import { RULES } from "./rules";

export type LintResult = LintResultGeneric<PwdSpec>;

export function lint(spec: PwdSpec): LintResult {
  return lintGeneric(spec, RULES);
}

/** Apply every diagnostic that offers a mechanical fix, in code order. */
export function applyAllFixes(spec: PwdSpec): PwdSpec {
  return applyAllFixesGeneric(spec, RULES);
}
