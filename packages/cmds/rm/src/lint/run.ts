import { applyAllFixes as applyAllFixesGeneric, lint as lintGeneric, type LintResult as LintResultGeneric } from "@cmdgen/engine";
import type { RmSpec } from "../spec";
import { RULES } from "./rules";

export type LintResult = LintResultGeneric<RmSpec>;

export function lint(spec: RmSpec): LintResult {
  return lintGeneric(spec, RULES);
}

export function applyAllFixes(spec: RmSpec): RmSpec {
  return applyAllFixesGeneric(spec, RULES);
}
