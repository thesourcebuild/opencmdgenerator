import { applyAllFixes as applyAllFixesGeneric, lint as lintGeneric, type LintResult as LintResultGeneric } from "@cmdgen/engine";
import type { MkdirSpec } from "../spec";
import { RULES } from "./rules";

export type LintResult = LintResultGeneric<MkdirSpec>;

export function lint(spec: MkdirSpec): LintResult {
  return lintGeneric(spec, RULES);
}

/** Apply every diagnostic that offers a mechanical fix, in code order. */
export function applyAllFixes(spec: MkdirSpec): MkdirSpec {
  return applyAllFixesGeneric(spec, RULES);
}
