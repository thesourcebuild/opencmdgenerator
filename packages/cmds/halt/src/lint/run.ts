import { applyAllFixes as applyAllFixesGeneric, lint as lintGeneric, type LintResult as LintResultGeneric } from "@cmdgen/engine";
import type { HaltSpec } from "../spec";
import { RULES } from "./rules";

export type LintResult = LintResultGeneric<HaltSpec>;

export function lint(spec: HaltSpec): LintResult {
  return lintGeneric(spec, RULES);
}

/** Apply every diagnostic that offers a mechanical fix, in code order. */
export function applyAllFixes(spec: HaltSpec): HaltSpec {
  return applyAllFixesGeneric(spec, RULES);
}
