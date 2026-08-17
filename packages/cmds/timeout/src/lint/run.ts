import {
  applyAllFixes as applyAllFixesGeneric,
  lint as lintGeneric,
  type LintResult as LintResultGeneric,
} from "@cmdgen/engine";
import type { TimeoutSpec } from "../spec";
import { RULES } from "./rules";

export type LintResult = LintResultGeneric<TimeoutSpec>;
export function lint(spec: TimeoutSpec): LintResult {
  return lintGeneric(spec, RULES);
}
export function applyAllFixes(spec: TimeoutSpec): TimeoutSpec {
  return applyAllFixesGeneric(spec, RULES);
}
