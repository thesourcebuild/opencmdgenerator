import {
  applyAllFixes as applyAllFixesGeneric,
  lint as lintGeneric,
  type LintResult as LintResultGeneric,
} from "@cmdgen/engine";
import type { LsusbSpec } from "../spec";
import { RULES } from "./rules";

export type LintResult = LintResultGeneric<LsusbSpec>;
export function lint(spec: LsusbSpec): LintResult {
  return lintGeneric(spec, RULES);
}
export function applyAllFixes(spec: LsusbSpec): LsusbSpec {
  return applyAllFixesGeneric(spec, RULES);
}
