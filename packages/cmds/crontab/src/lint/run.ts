import { applyAllFixes as applyAllFixesGeneric, lint as lintGeneric, type LintResult as LintResultGeneric } from "@cmdgen/engine";
import type { CrontabSpec } from "../spec";
import { RULES } from "./rules";

export type LintResult = LintResultGeneric<CrontabSpec>;

export function lint(spec: CrontabSpec): LintResult {
  return lintGeneric(spec, RULES);
}

/** Apply every diagnostic that offers a mechanical fix, in code order. */
export function applyAllFixes(spec: CrontabSpec): CrontabSpec {
  return applyAllFixesGeneric(spec, RULES);
}
