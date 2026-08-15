import { applyAllFixes as applyAllFixesGeneric, lint as lintGeneric, type LintResult as LintResultGeneric } from "@cmdgen/engine";
import type { RmdirSpec } from "../spec";
import { RULES } from "./rules";

export type LintResult = LintResultGeneric<RmdirSpec>;

export function lint(spec: RmdirSpec): LintResult {
  return lintGeneric(spec, RULES);
}

/** Apply every diagnostic that offers a mechanical fix, in code order. */
export function applyAllFixes(spec: RmdirSpec): RmdirSpec {
  return applyAllFixesGeneric(spec, RULES);
}
