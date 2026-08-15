import { applyAllFixes as applyAllFixesGeneric, lint as lintGeneric, type LintResult as LintResultGeneric } from "@cmdgen/engine";
import type { GitSpec } from "../spec";
import { RULES } from "./rules";

export type LintResult = LintResultGeneric<GitSpec>;

export function lint(spec: GitSpec): LintResult {
  return lintGeneric(spec, RULES);
}

/** Apply every diagnostic that offers a mechanical fix, in code order. */
export function applyAllFixes(spec: GitSpec): GitSpec {
  return applyAllFixesGeneric(spec, RULES);
}
