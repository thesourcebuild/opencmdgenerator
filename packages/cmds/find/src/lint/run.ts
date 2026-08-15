import { applyAllFixes as applyAllFixesGeneric, lint as lintGeneric, type LintResult as LintResultGeneric } from "@cmdgen/engine";
import type { FindSpec } from "../spec";
import { RULES } from "./rules";

export type LintResult = LintResultGeneric<FindSpec>;

export function lint(spec: FindSpec): LintResult {
  return lintGeneric(spec, RULES);
}

/** Apply every diagnostic that offers a mechanical fix, in code order. */
export function applyAllFixes(spec: FindSpec): FindSpec {
  return applyAllFixesGeneric(spec, RULES);
}
