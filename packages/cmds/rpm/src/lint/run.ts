import { applyAllFixes as applyAllFixesGeneric, lint as lintGeneric, type LintResult as LintResultGeneric } from "@cmdgen/engine";
import type { RpmSpec } from "../spec";
import { RULES } from "./rules";

export type LintResult = LintResultGeneric<RpmSpec>;

export function lint(spec: RpmSpec): LintResult {
  return lintGeneric(spec, RULES);
}

/** Apply every diagnostic that offers a mechanical fix, in code order. */
export function applyAllFixes(spec: RpmSpec): RpmSpec {
  return applyAllFixesGeneric(spec, RULES);
}
