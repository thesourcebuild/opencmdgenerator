import { applyAllFixes as applyAllFixesGeneric, lint as lintGeneric, type LintResult as LintResultGeneric } from "@cmdgen/engine";
import type { ChownSpec } from "../spec";
import { RULES } from "./rules";

export type LintResult = LintResultGeneric<ChownSpec>;

export function lint(spec: ChownSpec): LintResult {
  return lintGeneric(spec, RULES);
}

/** Apply every diagnostic that offers a mechanical fix, in code order. */
export function applyAllFixes(spec: ChownSpec): ChownSpec {
  return applyAllFixesGeneric(spec, RULES);
}
