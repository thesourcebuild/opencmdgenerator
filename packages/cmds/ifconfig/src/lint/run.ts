import { applyAllFixes as applyAllFixesGeneric, lint as lintGeneric, type LintResult as LintResultGeneric } from "@cmdgen/engine";
import type { IfconfigSpec } from "../spec";
import { RULES } from "./rules";

export type LintResult = LintResultGeneric<IfconfigSpec>;

export function lint(spec: IfconfigSpec): LintResult {
  return lintGeneric(spec, RULES);
}

/** Apply every diagnostic that offers a mechanical fix, in code order. */
export function applyAllFixes(spec: IfconfigSpec): IfconfigSpec {
  return applyAllFixesGeneric(spec, RULES);
}
