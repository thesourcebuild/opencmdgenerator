import { applyAllFixes as applyAllFixesGeneric, lint as lintGeneric, type LintResult as LintResultGeneric } from "@cmdgen/engine";
import type { PasswdSpec } from "../spec";
import { RULES } from "./rules";

export type LintResult = LintResultGeneric<PasswdSpec>;

export function lint(spec: PasswdSpec): LintResult {
  return lintGeneric(spec, RULES);
}

/** Apply every diagnostic that offers a mechanical fix, in code order. */
export function applyAllFixes(spec: PasswdSpec): PasswdSpec {
  return applyAllFixesGeneric(spec, RULES);
}
