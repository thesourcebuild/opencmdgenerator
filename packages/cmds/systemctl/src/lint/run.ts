import { applyAllFixes as applyAllFixesGeneric, lint as lintGeneric, type LintResult as LintResultGeneric } from "@cmdgen/engine";
import type { SystemctlSpec } from "../spec";
import { RULES } from "./rules";

export type LintResult = LintResultGeneric<SystemctlSpec>;

export function lint(spec: SystemctlSpec): LintResult {
  return lintGeneric(spec, RULES);
}

/** Apply every diagnostic that offers a mechanical fix, in code order. */
export function applyAllFixes(spec: SystemctlSpec): SystemctlSpec {
  return applyAllFixesGeneric(spec, RULES);
}
