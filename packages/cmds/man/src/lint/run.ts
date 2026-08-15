import { applyAllFixes as applyAllFixesGeneric, lint as lintGeneric, type LintResult as LintResultGeneric } from "@cmdgen/engine";
import type { ManSpec } from "../spec";
import { RULES } from "./rules";

export type LintResult = LintResultGeneric<ManSpec>;

export function lint(spec: ManSpec): LintResult {
  return lintGeneric(spec, RULES);
}

/** Apply every diagnostic that offers a mechanical fix, in code order. */
export function applyAllFixes(spec: ManSpec): ManSpec {
  return applyAllFixesGeneric(spec, RULES);
}
