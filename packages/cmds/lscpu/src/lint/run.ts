import {
  applyAllFixes as applyAllFixesGeneric,
  lint as lintGeneric,
  type LintResult as LintResultGeneric,
} from "@cmdgen/engine";
import type { LscpuSpec } from "../spec";
import { RULES } from "./rules";

export type LintResult = LintResultGeneric<LscpuSpec>;
export function lint(spec: LscpuSpec): LintResult {
  return lintGeneric(spec, RULES);
}
export function applyAllFixes(spec: LscpuSpec): LscpuSpec {
  return applyAllFixesGeneric(spec, RULES);
}
