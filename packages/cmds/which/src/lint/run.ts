import { applyAllFixes as applyAllFixesGeneric, lint as lintGeneric, type LintResult as LintResultGeneric } from "@cmdgen/engine";
import type { WhichSpec } from "../spec";
import { RULES } from "./rules";

export type LintResult = LintResultGeneric<WhichSpec>;

export function lint(spec: WhichSpec): LintResult {
  return lintGeneric(spec, RULES);
}

/** Apply every diagnostic that offers a mechanical fix, in code order. */
export function applyAllFixes(spec: WhichSpec): WhichSpec {
  return applyAllFixesGeneric(spec, RULES);
}
