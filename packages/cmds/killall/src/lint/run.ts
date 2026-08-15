import { applyAllFixes as applyAllFixesGeneric, lint as lintGeneric, type LintResult as LintResultGeneric } from "@cmdgen/engine";
import type { KillallSpec } from "../spec";
import { RULES } from "./rules";

export type LintResult = LintResultGeneric<KillallSpec>;

export function lint(spec: KillallSpec): LintResult {
  return lintGeneric(spec, RULES);
}

/** Apply every diagnostic that offers a mechanical fix, in code order. */
export function applyAllFixes(spec: KillallSpec): KillallSpec {
  return applyAllFixesGeneric(spec, RULES);
}
