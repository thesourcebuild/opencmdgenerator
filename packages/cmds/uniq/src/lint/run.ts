import { applyAllFixes as applyAllFixesGeneric, lint as lintGeneric, type LintResult as LintResultGeneric } from "@cmdgen/engine";
import type { UniqSpec } from "../spec";
import { RULES } from "./rules";

export type LintResult = LintResultGeneric<UniqSpec>;

export function lint(spec: UniqSpec): LintResult {
  return lintGeneric(spec, RULES);
}

/** Apply every diagnostic that offers a mechanical fix, in code order. */
export function applyAllFixes(spec: UniqSpec): UniqSpec {
  return applyAllFixesGeneric(spec, RULES);
}
