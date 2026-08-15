import { applyAllFixes as applyAllFixesGeneric, lint as lintGeneric, type LintResult as LintResultGeneric } from "@cmdgen/engine";
import type { TopSpec } from "../spec";
import { RULES } from "./rules";

export type LintResult = LintResultGeneric<TopSpec>;

export function lint(spec: TopSpec): LintResult {
  return lintGeneric(spec, RULES);
}

/** Apply every diagnostic that offers a mechanical fix, in code order. */
export function applyAllFixes(spec: TopSpec): TopSpec {
  return applyAllFixesGeneric(spec, RULES);
}
