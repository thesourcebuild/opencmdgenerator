import {
  applyAllFixes as applyAllFixesGeneric,
  lint as lintGeneric,
  type LintResult as LintResultGeneric,
} from "@cmdgen/engine";
import type { UmaskSpec } from "../spec";
import { RULES } from "./rules";

export type LintResult = LintResultGeneric<UmaskSpec>;
export function lint(spec: UmaskSpec): LintResult {
  return lintGeneric(spec, RULES);
}
export function applyAllFixes(spec: UmaskSpec): UmaskSpec {
  return applyAllFixesGeneric(spec, RULES);
}
