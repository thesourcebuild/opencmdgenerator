import { applyAllFixes as applyAllFixesGeneric, lint as lintGeneric, type LintResult as LintResultGeneric } from "@cmdgen/engine";
import type { LsblkSpec } from "../spec";
import { RULES } from "./rules";

export type LintResult = LintResultGeneric<LsblkSpec>;

export function lint(spec: LsblkSpec): LintResult {
  return lintGeneric(spec, RULES);
}

/** Apply every diagnostic that offers a mechanical fix, in code order. */
export function applyAllFixes(spec: LsblkSpec): LsblkSpec {
  return applyAllFixesGeneric(spec, RULES);
}
