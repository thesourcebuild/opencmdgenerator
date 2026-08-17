import {
  applyAllFixes as applyAllFixesGeneric,
  lint as lintGeneric,
  type LintResult as LintResultGeneric,
} from "@cmdgen/engine";
import type { AptCacheSpec } from "../spec";
import { RULES } from "./rules";

export type LintResult = LintResultGeneric<AptCacheSpec>;
export function lint(spec: AptCacheSpec): LintResult {
  return lintGeneric(spec, RULES);
}
export function applyAllFixes(spec: AptCacheSpec): AptCacheSpec {
  return applyAllFixesGeneric(spec, RULES);
}
