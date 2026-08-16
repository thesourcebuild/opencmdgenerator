import {
  applyAllFixes as applyAllFixesGeneric,
  lint as lintGeneric,
  type LintResult as LintResultGeneric,
} from "@cmdgen/engine";
import type { FingerSpec } from "../spec";
import { RULES } from "./rules";

export type LintResult = LintResultGeneric<FingerSpec>;
export function lint(spec: FingerSpec): LintResult {
  return lintGeneric(spec, RULES);
}
export function applyAllFixes(spec: FingerSpec): FingerSpec {
  return applyAllFixesGeneric(spec, RULES);
}
