import { applyAllFixes as applyAllFixesGeneric, lint as lintGeneric, type LintResult as LintResultGeneric } from "@cmdgen/engine";
import type { WgetSpec } from "../spec";
import { RULES } from "./rules";

export type LintResult = LintResultGeneric<WgetSpec>;

export function lint(spec: WgetSpec): LintResult {
  return lintGeneric(spec, RULES);
}

/** Apply every diagnostic that offers a mechanical fix, in code order. */
export function applyAllFixes(spec: WgetSpec): WgetSpec {
  return applyAllFixesGeneric(spec, RULES);
}
