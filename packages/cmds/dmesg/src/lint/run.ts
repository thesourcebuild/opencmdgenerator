import {
  applyAllFixes as applyAllFixesGeneric,
  lint as lintGeneric,
  type LintResult as LintResultGeneric,
} from "@cmdgen/engine";
import type { DmesgSpec } from "../spec";
import { RULES } from "./rules";

export type LintResult = LintResultGeneric<DmesgSpec>;
export function lint(spec: DmesgSpec): LintResult {
  return lintGeneric(spec, RULES);
}
export function applyAllFixes(spec: DmesgSpec): DmesgSpec {
  return applyAllFixesGeneric(spec, RULES);
}
