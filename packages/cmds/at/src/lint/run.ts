import { applyAllFixes as applyAllFixesGeneric, lint as lintGeneric, type LintResult as LintResultGeneric } from "@cmdgen/engine";
import type { AtSpec } from "../spec";
import { RULES } from "./rules";

export type LintResult = LintResultGeneric<AtSpec>;

export function lint(spec: AtSpec): LintResult {
  return lintGeneric(spec, RULES);
}

/** Apply every diagnostic that offers a mechanical fix, in code order. */
export function applyAllFixes(spec: AtSpec): AtSpec {
  return applyAllFixesGeneric(spec, RULES);
}
