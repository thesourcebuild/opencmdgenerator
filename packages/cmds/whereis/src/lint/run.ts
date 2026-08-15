import { applyAllFixes as applyAllFixesGeneric, lint as lintGeneric, type LintResult as LintResultGeneric } from "@cmdgen/engine";
import type { WhereisSpec } from "../spec";
import { RULES } from "./rules";

export type LintResult = LintResultGeneric<WhereisSpec>;

export function lint(spec: WhereisSpec): LintResult {
  return lintGeneric(spec, RULES);
}

/** Apply every diagnostic that offers a mechanical fix, in code order. */
export function applyAllFixes(spec: WhereisSpec): WhereisSpec {
  return applyAllFixesGeneric(spec, RULES);
}
