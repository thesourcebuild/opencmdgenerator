import { applyAllFixes as applyAllFixesGeneric, lint as lintGeneric, type LintResult as LintResultGeneric } from "@cmdgen/engine";
import type { GzipSpec } from "../spec";
import { RULES } from "./rules";

export type LintResult = LintResultGeneric<GzipSpec>;

export function lint(spec: GzipSpec): LintResult {
  return lintGeneric(spec, RULES);
}

/** Apply every diagnostic that offers a mechanical fix, in code order. */
export function applyAllFixes(spec: GzipSpec): GzipSpec {
  return applyAllFixesGeneric(spec, RULES);
}
