import { applyAllFixes as applyAllFixesGeneric, lint as lintGeneric, type LintResult as LintResultGeneric } from "@cmdgen/engine";
import type { KillSpec } from "../spec";
import { RULES } from "./rules";

export type LintResult = LintResultGeneric<KillSpec>;

export function lint(spec: KillSpec): LintResult {
  return lintGeneric(spec, RULES);
}

export function applyAllFixes(spec: KillSpec): KillSpec {
  return applyAllFixesGeneric(spec, RULES);
}
