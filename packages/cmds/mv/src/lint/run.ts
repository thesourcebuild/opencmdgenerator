import { applyAllFixes as applyAllFixesGeneric, lint as lintGeneric, type LintResult as LintResultGeneric } from "@cmdgen/engine";
import type { MvSpec } from "../spec";
import { RULES } from "./rules";

export type LintResult = LintResultGeneric<MvSpec>;

export function lint(spec: MvSpec): LintResult {
  return lintGeneric(spec, RULES);
}

/** Apply every diagnostic that offers a mechanical fix, in code order. */
export function applyAllFixes(spec: MvSpec): MvSpec {
  return applyAllFixesGeneric(spec, RULES);
}
