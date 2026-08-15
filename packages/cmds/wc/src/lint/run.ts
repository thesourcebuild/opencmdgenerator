import { applyAllFixes as applyAllFixesGeneric, lint as lintGeneric, type LintResult as LintResultGeneric } from "@cmdgen/engine";
import type { WcSpec } from "../spec";
import { RULES } from "./rules";

export type LintResult = LintResultGeneric<WcSpec>;

export function lint(spec: WcSpec): LintResult {
  return lintGeneric(spec, RULES);
}

/** Apply every diagnostic that offers a mechanical fix, in code order. */
export function applyAllFixes(spec: WcSpec): WcSpec {
  return applyAllFixesGeneric(spec, RULES);
}
