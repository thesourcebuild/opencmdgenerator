import { applyAllFixes as applyAllFixesGeneric, lint as lintGeneric, type LintResult as LintResultGeneric } from "@cmdgen/engine";
import type { ChmodSpec } from "../spec";
import { RULES } from "./rules";

export type LintResult = LintResultGeneric<ChmodSpec>;

export function lint(spec: ChmodSpec): LintResult {
  return lintGeneric(spec, RULES);
}

export function applyAllFixes(spec: ChmodSpec): ChmodSpec {
  return applyAllFixesGeneric(spec, RULES);
}
