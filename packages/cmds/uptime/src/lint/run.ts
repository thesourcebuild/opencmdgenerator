import { applyAllFixes as applyAllFixesGeneric, lint as lintGeneric, type LintResult as LintResultGeneric } from "@cmdgen/engine";
import type { UptimeSpec } from "../spec";
import { RULES } from "./rules";

export type LintResult = LintResultGeneric<UptimeSpec>;

export function lint(spec: UptimeSpec): LintResult {
  return lintGeneric(spec, RULES);
}

/** Apply every diagnostic that offers a mechanical fix, in code order. */
export function applyAllFixes(spec: UptimeSpec): UptimeSpec {
  return applyAllFixesGeneric(spec, RULES);
}
