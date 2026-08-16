import {
  applyAllFixes as applyAllFixesGeneric,
  lint as lintGeneric,
  type LintResult as LintResultGeneric,
} from "@cmdgen/engine";
import type { HwinfoSpec } from "../spec";
import { RULES } from "./rules";

export type LintResult = LintResultGeneric<HwinfoSpec>;
export function lint(spec: HwinfoSpec): LintResult {
  return lintGeneric(spec, RULES);
}
export function applyAllFixes(spec: HwinfoSpec): HwinfoSpec {
  return applyAllFixesGeneric(spec, RULES);
}
