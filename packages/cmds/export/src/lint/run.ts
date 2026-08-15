import { applyAllFixes as applyAllFixesGeneric, lint as lintGeneric, type LintResult as LintResultGeneric } from "@cmdgen/engine";
import type { ExportSpec } from "../spec";
import { RULES } from "./rules";

export type LintResult = LintResultGeneric<ExportSpec>;

export function lint(spec: ExportSpec): LintResult {
  return lintGeneric(spec, RULES);
}

/** Apply every diagnostic that offers a mechanical fix, in code order. */
export function applyAllFixes(spec: ExportSpec): ExportSpec {
  return applyAllFixesGeneric(spec, RULES);
}
