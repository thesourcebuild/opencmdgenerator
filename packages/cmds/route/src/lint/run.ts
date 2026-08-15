import { applyAllFixes as applyAllFixesGeneric, lint as lintGeneric, type LintResult as LintResultGeneric } from "@cmdgen/engine";
import type { RouteSpec } from "../spec";
import { RULES } from "./rules";

export type LintResult = LintResultGeneric<RouteSpec>;

export function lint(spec: RouteSpec): LintResult {
  return lintGeneric(spec, RULES);
}

/** Apply every diagnostic that offers a mechanical fix, in code order. */
export function applyAllFixes(spec: RouteSpec): RouteSpec {
  return applyAllFixesGeneric(spec, RULES);
}
