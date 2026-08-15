import { applyAllFixes as applyAllFixesGeneric, lint as lintGeneric, type LintResult as LintResultGeneric } from "@cmdgen/engine";
import type { LocateSpec } from "../spec";
import { RULES } from "./rules";

export type LintResult = LintResultGeneric<LocateSpec>;

export function lint(spec: LocateSpec): LintResult {
  return lintGeneric(spec, RULES);
}

/** Apply every diagnostic that offers a mechanical fix, in code order. */
export function applyAllFixes(spec: LocateSpec): LocateSpec {
  return applyAllFixesGeneric(spec, RULES);
}
