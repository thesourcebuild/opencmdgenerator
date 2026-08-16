import {
  applyAllFixes as applyAllFixesGeneric,
  lint as lintGeneric,
  type LintResult as LintResultGeneric,
} from "@cmdgen/engine";
import type { TimedatectlSpec } from "../spec";
import { RULES } from "./rules";

export type LintResult = LintResultGeneric<TimedatectlSpec>;
export function lint(spec: TimedatectlSpec): LintResult {
  return lintGeneric(spec, RULES);
}
export function applyAllFixes(spec: TimedatectlSpec): TimedatectlSpec {
  return applyAllFixesGeneric(spec, RULES);
}
