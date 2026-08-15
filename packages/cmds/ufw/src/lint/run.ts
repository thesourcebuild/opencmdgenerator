import { applyAllFixes as applyAllFixesGeneric, lint as lintGeneric, type LintResult as LintResultGeneric } from "@cmdgen/engine";
import type { UfwSpec } from "../spec";
import { RULES } from "./rules";

export type LintResult = LintResultGeneric<UfwSpec>;

export function lint(spec: UfwSpec): LintResult {
  return lintGeneric(spec, RULES);
}

/** Apply every diagnostic that offers a mechanical fix, in code order. */
export function applyAllFixes(spec: UfwSpec): UfwSpec {
  return applyAllFixesGeneric(spec, RULES);
}
