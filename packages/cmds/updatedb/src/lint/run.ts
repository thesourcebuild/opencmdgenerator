import { applyAllFixes as applyAllFixesGeneric, lint as lintGeneric, type LintResult as LintResultGeneric } from "@cmdgen/engine";
import type { UpdatedbSpec } from "../spec";
import { RULES } from "./rules";

export type LintResult = LintResultGeneric<UpdatedbSpec>;

export function lint(spec: UpdatedbSpec): LintResult {
  return lintGeneric(spec, RULES);
}

/** Apply every diagnostic that offers a mechanical fix, in code order. */
export function applyAllFixes(spec: UpdatedbSpec): UpdatedbSpec {
  return applyAllFixesGeneric(spec, RULES);
}
