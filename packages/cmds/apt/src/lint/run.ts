import { applyAllFixes as applyAllFixesGeneric, lint as lintGeneric, type LintResult as LintResultGeneric } from "@cmdgen/engine";
import type { AptSpec } from "../spec";
import { RULES } from "./rules";

export type LintResult = LintResultGeneric<AptSpec>;

export function lint(spec: AptSpec): LintResult {
  return lintGeneric(spec, RULES);
}

/** Apply every diagnostic that offers a mechanical fix, in code order. */
export function applyAllFixes(spec: AptSpec): AptSpec {
  return applyAllFixesGeneric(spec, RULES);
}
