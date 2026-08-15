import { applyAllFixes as applyAllFixesGeneric, lint as lintGeneric, type LintResult as LintResultGeneric } from "@cmdgen/engine";
import type { HeadSpec } from "../spec";
import { RULES } from "./rules";

export type LintResult = LintResultGeneric<HeadSpec>;

export function lint(spec: HeadSpec): LintResult {
  return lintGeneric(spec, RULES);
}

/** Apply every diagnostic that offers a mechanical fix, in code order. */
export function applyAllFixes(spec: HeadSpec): HeadSpec {
  return applyAllFixesGeneric(spec, RULES);
}
