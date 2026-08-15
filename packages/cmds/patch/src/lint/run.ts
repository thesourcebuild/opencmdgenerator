import { applyAllFixes as applyAllFixesGeneric, lint as lintGeneric, type LintResult as LintResultGeneric } from "@cmdgen/engine";
import type { PatchSpec } from "../spec";
import { RULES } from "./rules";

export type LintResult = LintResultGeneric<PatchSpec>;

export function lint(spec: PatchSpec): LintResult {
  return lintGeneric(spec, RULES);
}

/** Apply every diagnostic that offers a mechanical fix, in code order. */
export function applyAllFixes(spec: PatchSpec): PatchSpec {
  return applyAllFixesGeneric(spec, RULES);
}
