import { applyAllFixes as applyAllFixesGeneric, lint as lintGeneric, type LintResult as LintResultGeneric } from "@cmdgen/engine";
import type { FreeSpec } from "../spec";
import { RULES } from "./rules";

export type LintResult = LintResultGeneric<FreeSpec>;

export function lint(spec: FreeSpec): LintResult {
  return lintGeneric(spec, RULES);
}

/** Apply every diagnostic that offers a mechanical fix, in code order. */
export function applyAllFixes(spec: FreeSpec): FreeSpec {
  return applyAllFixesGeneric(spec, RULES);
}
