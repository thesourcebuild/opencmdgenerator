import { applyAllFixes as applyAllFixesGeneric, lint as lintGeneric, type LintResult as LintResultGeneric } from "@cmdgen/engine";
import type { GrepSpec } from "../spec";
import { RULES } from "./rules";

export type LintResult = LintResultGeneric<GrepSpec>;

export function lint(spec: GrepSpec): LintResult {
  return lintGeneric(spec, RULES);
}

/** Apply every diagnostic that offers a mechanical fix, in code order. */
export function applyAllFixes(spec: GrepSpec): GrepSpec {
  return applyAllFixesGeneric(spec, RULES);
}
