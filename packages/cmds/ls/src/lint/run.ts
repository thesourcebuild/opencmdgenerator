import { applyAllFixes as applyAllFixesGeneric, lint as lintGeneric, type LintResult as LintResultGeneric } from "@cmdgen/engine";
import type { LsSpec } from "../spec";
import { RULES } from "./rules";

export type LintResult = LintResultGeneric<LsSpec>;

export function lint(spec: LsSpec): LintResult {
  return lintGeneric(spec, RULES);
}

export function applyAllFixes(spec: LsSpec): LsSpec {
  return applyAllFixesGeneric(spec, RULES);
}
