import { applyAllFixes as applyAllFixesGeneric, lint as lintGeneric, type LintResult as LintResultGeneric } from "@cmdgen/engine";
import type { TailSpec } from "../spec";
import { RULES } from "./rules";

export type LintResult = LintResultGeneric<TailSpec>;

export function lint(spec: TailSpec): LintResult {
  return lintGeneric(spec, RULES);
}

/** Apply every diagnostic that offers a mechanical fix, in code order. */
export function applyAllFixes(spec: TailSpec): TailSpec {
  return applyAllFixesGeneric(spec, RULES);
}
