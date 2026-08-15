import { applyAllFixes as applyAllFixesGeneric, lint as lintGeneric, type LintResult as LintResultGeneric } from "@cmdgen/engine";
import type { PkillSpec } from "../spec";
import { RULES } from "./rules";

export type LintResult = LintResultGeneric<PkillSpec>;

export function lint(spec: PkillSpec): LintResult {
  return lintGeneric(spec, RULES);
}

/** Apply every diagnostic that offers a mechanical fix, in code order. */
export function applyAllFixes(spec: PkillSpec): PkillSpec {
  return applyAllFixesGeneric(spec, RULES);
}
