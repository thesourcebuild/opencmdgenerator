import { applyAllFixes as applyAllFixesGeneric, lint as lintGeneric, type LintResult as LintResultGeneric } from "@cmdgen/engine";
import type { UnameSpec } from "../spec";
import { RULES } from "./rules";

export type LintResult = LintResultGeneric<UnameSpec>;

export function lint(spec: UnameSpec): LintResult {
  return lintGeneric(spec, RULES);
}

/** Apply every diagnostic that offers a mechanical fix, in code order. */
export function applyAllFixes(spec: UnameSpec): UnameSpec {
  return applyAllFixesGeneric(spec, RULES);
}
