import {
  applyAllFixes as applyAllFixesGeneric,
  lint as lintGeneric,
  type LintResult as LintResultGeneric,
} from "@cmdgen/engine";
import type { LtraceSpec } from "../spec";
import { RULES } from "./rules";

export type LintResult = LintResultGeneric<LtraceSpec>;
export function lint(spec: LtraceSpec): LintResult {
  return lintGeneric(spec, RULES);
}
export function applyAllFixes(spec: LtraceSpec): LtraceSpec {
  return applyAllFixesGeneric(spec, RULES);
}
