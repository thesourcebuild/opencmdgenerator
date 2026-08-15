import { applyAllFixes as applyAllFixesGeneric, lint as lintGeneric, type LintResult as LintResultGeneric } from "@cmdgen/engine";
import type { WhatisSpec } from "../spec";
import { RULES } from "./rules";

export type LintResult = LintResultGeneric<WhatisSpec>;

export function lint(spec: WhatisSpec): LintResult {
  return lintGeneric(spec, RULES);
}

/** Apply every diagnostic that offers a mechanical fix, in code order. */
export function applyAllFixes(spec: WhatisSpec): WhatisSpec {
  return applyAllFixesGeneric(spec, RULES);
}
