import { applyAllFixes as applyAllFixesGeneric, lint as lintGeneric, type LintResult as LintResultGeneric } from "@cmdgen/engine";
import type { SortSpec } from "../spec";
import { RULES } from "./rules";

export type LintResult = LintResultGeneric<SortSpec>;

export function lint(spec: SortSpec): LintResult {
  return lintGeneric(spec, RULES);
}

/** Apply every diagnostic that offers a mechanical fix, in code order. */
export function applyAllFixes(spec: SortSpec): SortSpec {
  return applyAllFixesGeneric(spec, RULES);
}
