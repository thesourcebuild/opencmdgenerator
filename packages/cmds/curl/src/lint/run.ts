import { applyAllFixes as applyAllFixesGeneric, lint as lintGeneric, type LintResult as LintResultGeneric } from "@cmdgen/engine";
import type { CurlSpec } from "../spec";
import { RULES } from "./rules";

export type LintResult = LintResultGeneric<CurlSpec>;

export function lint(spec: CurlSpec): LintResult {
  return lintGeneric(spec, RULES);
}

export function applyAllFixes(spec: CurlSpec): CurlSpec {
  return applyAllFixesGeneric(spec, RULES);
}
