import { applyAllFixes as applyAllFixesGeneric, lint as lintGeneric, type LintResult as LintResultGeneric } from "@cmdgen/engine";
import type { PingSpec } from "../spec";
import { RULES } from "./rules";

export type LintResult = LintResultGeneric<PingSpec>;

export function lint(spec: PingSpec): LintResult {
  return lintGeneric(spec, RULES);
}

/** Apply every diagnostic that offers a mechanical fix, in code order. */
export function applyAllFixes(spec: PingSpec): PingSpec {
  return applyAllFixesGeneric(spec, RULES);
}
