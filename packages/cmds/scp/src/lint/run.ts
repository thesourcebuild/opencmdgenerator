import { applyAllFixes as applyAllFixesGeneric, lint as lintGeneric, type LintResult as LintResultGeneric } from "@cmdgen/engine";
import type { ScpSpec } from "../spec";
import { RULES } from "./rules";

export type LintResult = LintResultGeneric<ScpSpec>;

export function lint(spec: ScpSpec): LintResult {
  return lintGeneric(spec, RULES);
}

export function applyAllFixes(spec: ScpSpec): ScpSpec {
  return applyAllFixesGeneric(spec, RULES);
}
