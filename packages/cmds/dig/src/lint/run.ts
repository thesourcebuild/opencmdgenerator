import { applyAllFixes as applyAllFixesGeneric, lint as lintGeneric, type LintResult as LintResultGeneric } from "@cmdgen/engine";
import type { DigSpec } from "../spec";
import { RULES } from "./rules";

export type LintResult = LintResultGeneric<DigSpec>;

export function lint(spec: DigSpec): LintResult {
  return lintGeneric(spec, RULES);
}

/** Apply every diagnostic that offers a mechanical fix, in code order. */
export function applyAllFixes(spec: DigSpec): DigSpec {
  return applyAllFixesGeneric(spec, RULES);
}
