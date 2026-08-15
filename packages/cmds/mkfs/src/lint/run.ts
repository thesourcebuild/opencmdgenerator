import { applyAllFixes as applyAllFixesGeneric, lint as lintGeneric, type LintResult as LintResultGeneric } from "@cmdgen/engine";
import type { MkfsSpec } from "../spec";
import { RULES } from "./rules";

export type LintResult = LintResultGeneric<MkfsSpec>;

export function lint(spec: MkfsSpec): LintResult {
  return lintGeneric(spec, RULES);
}

/** Apply every diagnostic that offers a mechanical fix, in code order. */
export function applyAllFixes(spec: MkfsSpec): MkfsSpec {
  return applyAllFixesGeneric(spec, RULES);
}
