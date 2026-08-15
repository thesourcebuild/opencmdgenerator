import { applyAllFixes as applyAllFixesGeneric, lint as lintGeneric, type LintResult as LintResultGeneric } from "@cmdgen/engine";
import type { WhoisSpec } from "../spec";
import { RULES } from "./rules";

export type LintResult = LintResultGeneric<WhoisSpec>;

export function lint(spec: WhoisSpec): LintResult {
  return lintGeneric(spec, RULES);
}

/** Apply every diagnostic that offers a mechanical fix, in code order. */
export function applyAllFixes(spec: WhoisSpec): WhoisSpec {
  return applyAllFixesGeneric(spec, RULES);
}
