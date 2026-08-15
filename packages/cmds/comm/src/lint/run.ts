import { applyAllFixes as applyAllFixesGeneric, lint as lintGeneric, type LintResult as LintResultGeneric } from "@cmdgen/engine";
import type { CommSpec } from "../spec";
import { RULES } from "./rules";

export type LintResult = LintResultGeneric<CommSpec>;

export function lint(spec: CommSpec): LintResult {
  return lintGeneric(spec, RULES);
}

/** Apply every diagnostic that offers a mechanical fix, in code order. */
export function applyAllFixes(spec: CommSpec): CommSpec {
  return applyAllFixesGeneric(spec, RULES);
}
