import { applyAllFixes as applyAllFixesGeneric, lint as lintGeneric, type LintResult as LintResultGeneric } from "@cmdgen/engine";
import type { WhoamiSpec } from "../spec";
import { RULES } from "./rules";

export type LintResult = LintResultGeneric<WhoamiSpec>;

export function lint(spec: WhoamiSpec): LintResult {
  return lintGeneric(spec, RULES);
}

/** Apply every diagnostic that offers a mechanical fix, in code order. */
export function applyAllFixes(spec: WhoamiSpec): WhoamiSpec {
  return applyAllFixesGeneric(spec, RULES);
}
