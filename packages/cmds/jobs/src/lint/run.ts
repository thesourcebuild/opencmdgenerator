import {
  applyAllFixes as applyAllFixesGeneric,
  lint as lintGeneric,
  type LintResult as LintResultGeneric,
} from "@cmdgen/engine";
import type { JobsSpec } from "../spec";
import { RULES } from "./rules";

export type LintResult = LintResultGeneric<JobsSpec>;
export function lint(spec: JobsSpec): LintResult {
  return lintGeneric(spec, RULES);
}
export function applyAllFixes(spec: JobsSpec): JobsSpec {
  return applyAllFixesGeneric(spec, RULES);
}
