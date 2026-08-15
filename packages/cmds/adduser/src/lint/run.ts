import { applyAllFixes as applyAllFixesGeneric, lint as lintGeneric, type LintResult as LintResultGeneric } from "@cmdgen/engine";
import type { AdduserSpec } from "../spec";
import { RULES } from "./rules";

export type LintResult = LintResultGeneric<AdduserSpec>;

export function lint(spec: AdduserSpec): LintResult {
  return lintGeneric(spec, RULES);
}

/** Apply every diagnostic that offers a mechanical fix, in code order. */
export function applyAllFixes(spec: AdduserSpec): AdduserSpec {
  return applyAllFixesGeneric(spec, RULES);
}
