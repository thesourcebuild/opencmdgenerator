import { applyAllFixes as applyAllFixesGeneric, lint as lintGeneric, type LintResult as LintResultGeneric } from "@cmdgen/engine";
import type { NetstatSpec } from "../spec";
import { RULES } from "./rules";

export type LintResult = LintResultGeneric<NetstatSpec>;

export function lint(spec: NetstatSpec): LintResult {
  return lintGeneric(spec, RULES);
}

/** Apply every diagnostic that offers a mechanical fix, in code order. */
export function applyAllFixes(spec: NetstatSpec): NetstatSpec {
  return applyAllFixesGeneric(spec, RULES);
}
