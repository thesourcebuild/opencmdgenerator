import { applyAllFixes as applyAllFixesGeneric, lint as lintGeneric, type LintResult as LintResultGeneric } from "@cmdgen/engine";
import type { WhereSpec } from "../spec";
import { RULES } from "./rules";

export type LintResult = LintResultGeneric<WhereSpec>;

export function lint(spec: WhereSpec): LintResult {
  return lintGeneric(spec, RULES);
}

/** Apply every diagnostic that offers a mechanical fix, in code order. */
export function applyAllFixes(spec: WhereSpec): WhereSpec {
  return applyAllFixesGeneric(spec, RULES);
}
