import { applyAllFixes as applyAllFixesGeneric, lint as lintGeneric, type LintResult as LintResultGeneric } from "@cmdgen/engine";
import type { UnzipSpec } from "../spec";
import { RULES } from "./rules";

export type LintResult = LintResultGeneric<UnzipSpec>;

export function lint(spec: UnzipSpec): LintResult {
  return lintGeneric(spec, RULES);
}

/** Apply every diagnostic that offers a mechanical fix, in code order. */
export function applyAllFixes(spec: UnzipSpec): UnzipSpec {
  return applyAllFixesGeneric(spec, RULES);
}
