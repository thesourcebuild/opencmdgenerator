import { applyAllFixes as applyAllFixesGeneric, lint as lintGeneric, type LintResult as LintResultGeneric } from "@cmdgen/engine";
import type { ZipSpec } from "../spec";
import { RULES } from "./rules";

export type LintResult = LintResultGeneric<ZipSpec>;

export function lint(spec: ZipSpec): LintResult {
  return lintGeneric(spec, RULES);
}

/** Apply every diagnostic that offers a mechanical fix, in code order. */
export function applyAllFixes(spec: ZipSpec): ZipSpec {
  return applyAllFixesGeneric(spec, RULES);
}
