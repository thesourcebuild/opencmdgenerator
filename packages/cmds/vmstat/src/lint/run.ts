import { applyAllFixes as applyAllFixesGeneric, lint as lintGeneric, type LintResult as LintResultGeneric } from "@cmdgen/engine";
import type { VmstatSpec } from "../spec";
import { RULES } from "./rules";

export type LintResult = LintResultGeneric<VmstatSpec>;

export function lint(spec: VmstatSpec): LintResult {
  return lintGeneric(spec, RULES);
}

/** Apply every diagnostic that offers a mechanical fix, in code order. */
export function applyAllFixes(spec: VmstatSpec): VmstatSpec {
  return applyAllFixesGeneric(spec, RULES);
}
