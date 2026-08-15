import { applyAllFixes as applyAllFixesGeneric, lint as lintGeneric, type LintResult as LintResultGeneric } from "@cmdgen/engine";
import type { BlkidSpec } from "../spec";
import { RULES } from "./rules";

export type LintResult = LintResultGeneric<BlkidSpec>;

export function lint(spec: BlkidSpec): LintResult {
  return lintGeneric(spec, RULES);
}

/** Apply every diagnostic that offers a mechanical fix, in code order. */
export function applyAllFixes(spec: BlkidSpec): BlkidSpec {
  return applyAllFixesGeneric(spec, RULES);
}
