import { applyAllFixes as applyAllFixesGeneric, lint as lintGeneric, type LintResult as LintResultGeneric } from "@cmdgen/engine";
import type { IptablesSpec } from "../spec";
import { RULES } from "./rules";

export type LintResult = LintResultGeneric<IptablesSpec>;

export function lint(spec: IptablesSpec): LintResult {
  return lintGeneric(spec, RULES);
}

/** Apply every diagnostic that offers a mechanical fix, in code order. */
export function applyAllFixes(spec: IptablesSpec): IptablesSpec {
  return applyAllFixesGeneric(spec, RULES);
}
