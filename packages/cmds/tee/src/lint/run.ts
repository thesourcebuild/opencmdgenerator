import { applyAllFixes as applyAllFixesGeneric, lint as lintGeneric, type LintResult as LintResultGeneric } from "@cmdgen/engine";
import type { TeeSpec } from "../spec";
import { RULES } from "./rules";

export type LintResult = LintResultGeneric<TeeSpec>;

export function lint(spec: TeeSpec): LintResult {
  return lintGeneric(spec, RULES);
}

/** Apply every diagnostic that offers a mechanical fix, in code order. */
export function applyAllFixes(spec: TeeSpec): TeeSpec {
  return applyAllFixesGeneric(spec, RULES);
}
