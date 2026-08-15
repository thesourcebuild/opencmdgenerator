import { applyAllFixes as applyAllFixesGeneric, lint as lintGeneric, type LintResult as LintResultGeneric } from "@cmdgen/engine";
import type { ViSpec } from "../spec";
import { RULES } from "./rules";

export type LintResult = LintResultGeneric<ViSpec>;

export function lint(spec: ViSpec): LintResult {
  return lintGeneric(spec, RULES);
}

/** Apply every diagnostic that offers a mechanical fix, in code order. */
export function applyAllFixes(spec: ViSpec): ViSpec {
  return applyAllFixesGeneric(spec, RULES);
}
