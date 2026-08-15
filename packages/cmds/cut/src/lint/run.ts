import { applyAllFixes as applyAllFixesGeneric, lint as lintGeneric, type LintResult as LintResultGeneric } from "@cmdgen/engine";
import type { CutSpec } from "../spec";
import { RULES } from "./rules";

export type LintResult = LintResultGeneric<CutSpec>;

export function lint(spec: CutSpec): LintResult {
  return lintGeneric(spec, RULES);
}

/** Apply every diagnostic that offers a mechanical fix, in code order. */
export function applyAllFixes(spec: CutSpec): CutSpec {
  return applyAllFixesGeneric(spec, RULES);
}
