import { applyAllFixes as applyAllFixesGeneric, lint as lintGeneric, type LintResult as LintResultGeneric } from "@cmdgen/engine";
import type { FdiskSpec } from "../spec";
import { RULES } from "./rules";

export type LintResult = LintResultGeneric<FdiskSpec>;

export function lint(spec: FdiskSpec): LintResult {
  return lintGeneric(spec, RULES);
}

/** Apply every diagnostic that offers a mechanical fix, in code order. */
export function applyAllFixes(spec: FdiskSpec): FdiskSpec {
  return applyAllFixesGeneric(spec, RULES);
}
