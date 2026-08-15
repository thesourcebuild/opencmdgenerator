import { applyAllFixes as applyAllFixesGeneric, lint as lintGeneric, type LintResult as LintResultGeneric } from "@cmdgen/engine";
import type { CatSpec } from "../spec";
import { RULES } from "./rules";

export type LintResult = LintResultGeneric<CatSpec>;

export function lint(spec: CatSpec): LintResult {
  return lintGeneric(spec, RULES);
}

/** Apply every diagnostic that offers a mechanical fix, in code order. */
export function applyAllFixes(spec: CatSpec): CatSpec {
  return applyAllFixesGeneric(spec, RULES);
}
