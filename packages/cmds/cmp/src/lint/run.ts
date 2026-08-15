import { applyAllFixes as applyAllFixesGeneric, lint as lintGeneric, type LintResult as LintResultGeneric } from "@cmdgen/engine";
import type { CmpSpec } from "../spec";
import { RULES } from "./rules";

export type LintResult = LintResultGeneric<CmpSpec>;

export function lint(spec: CmpSpec): LintResult {
  return lintGeneric(spec, RULES);
}

/** Apply every diagnostic that offers a mechanical fix, in code order. */
export function applyAllFixes(spec: CmpSpec): CmpSpec {
  return applyAllFixesGeneric(spec, RULES);
}
