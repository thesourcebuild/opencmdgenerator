import { applyAllFixes as applyAllFixesGeneric, lint as lintGeneric, type LintResult as LintResultGeneric } from "@cmdgen/engine";
import type { ChgrpSpec } from "../spec";
import { RULES } from "./rules";

export type LintResult = LintResultGeneric<ChgrpSpec>;

export function lint(spec: ChgrpSpec): LintResult {
  return lintGeneric(spec, RULES);
}

/** Apply every diagnostic that offers a mechanical fix, in code order. */
export function applyAllFixes(spec: ChgrpSpec): ChgrpSpec {
  return applyAllFixesGeneric(spec, RULES);
}
