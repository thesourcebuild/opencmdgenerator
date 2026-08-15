import { applyAllFixes as applyAllFixesGeneric, lint as lintGeneric, type LintResult as LintResultGeneric } from "@cmdgen/engine";
import type { AptGetSpec } from "../spec";
import { RULES } from "./rules";

export type LintResult = LintResultGeneric<AptGetSpec>;

export function lint(spec: AptGetSpec): LintResult {
  return lintGeneric(spec, RULES);
}

/** Apply every diagnostic that offers a mechanical fix, in code order. */
export function applyAllFixes(spec: AptGetSpec): AptGetSpec {
  return applyAllFixesGeneric(spec, RULES);
}
