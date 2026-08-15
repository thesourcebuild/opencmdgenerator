import { applyAllFixes as applyAllFixesGeneric, lint as lintGeneric, type LintResult as LintResultGeneric } from "@cmdgen/engine";
import type { GetenforceSpec } from "../spec";
import { RULES } from "./rules";

export type LintResult = LintResultGeneric<GetenforceSpec>;

export function lint(spec: GetenforceSpec): LintResult {
  return lintGeneric(spec, RULES);
}

/** Apply every diagnostic that offers a mechanical fix, in code order. */
export function applyAllFixes(spec: GetenforceSpec): GetenforceSpec {
  return applyAllFixesGeneric(spec, RULES);
}
