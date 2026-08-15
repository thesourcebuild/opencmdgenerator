import { applyAllFixes as applyAllFixesGeneric, lint as lintGeneric, type LintResult as LintResultGeneric } from "@cmdgen/engine";
import type { PsSpec } from "../spec";
import { RULES } from "./rules";

export type LintResult = LintResultGeneric<PsSpec>;

export function lint(spec: PsSpec): LintResult {
  return lintGeneric(spec, RULES);
}

/** Apply every diagnostic that offers a mechanical fix, in code order. */
export function applyAllFixes(spec: PsSpec): PsSpec {
  return applyAllFixesGeneric(spec, RULES);
}
