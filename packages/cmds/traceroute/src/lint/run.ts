import { applyAllFixes as applyAllFixesGeneric, lint as lintGeneric, type LintResult as LintResultGeneric } from "@cmdgen/engine";
import type { TracerouteSpec } from "../spec";
import { RULES } from "./rules";

export type LintResult = LintResultGeneric<TracerouteSpec>;

export function lint(spec: TracerouteSpec): LintResult {
  return lintGeneric(spec, RULES);
}

/** Apply every diagnostic that offers a mechanical fix, in code order. */
export function applyAllFixes(spec: TracerouteSpec): TracerouteSpec {
  return applyAllFixesGeneric(spec, RULES);
}
