import { applyAllFixes as applyAllFixesGeneric, lint as lintGeneric, type LintResult as LintResultGeneric } from "@cmdgen/engine";
import type { RebootSpec } from "../spec";
import { RULES } from "./rules";

export type LintResult = LintResultGeneric<RebootSpec>;

export function lint(spec: RebootSpec): LintResult {
  return lintGeneric(spec, RULES);
}

/** Apply every diagnostic that offers a mechanical fix, in code order. */
export function applyAllFixes(spec: RebootSpec): RebootSpec {
  return applyAllFixesGeneric(spec, RULES);
}
