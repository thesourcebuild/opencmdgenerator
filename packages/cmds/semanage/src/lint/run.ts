import { applyAllFixes as applyAllFixesGeneric, lint as lintGeneric, type LintResult as LintResultGeneric } from "@cmdgen/engine";
import type { SemanageSpec } from "../spec";
import { RULES } from "./rules";

export type LintResult = LintResultGeneric<SemanageSpec>;

export function lint(spec: SemanageSpec): LintResult {
  return lintGeneric(spec, RULES);
}

/** Apply every diagnostic that offers a mechanical fix, in code order. */
export function applyAllFixes(spec: SemanageSpec): SemanageSpec {
  return applyAllFixesGeneric(spec, RULES);
}
