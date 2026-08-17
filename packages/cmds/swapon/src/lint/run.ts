import {
  applyAllFixes as applyAllFixesGeneric,
  lint as lintGeneric,
  type LintResult as LintResultGeneric,
} from "@cmdgen/engine";
import type { SwaponSpec } from "../spec";
import { RULES } from "./rules";

export type LintResult = LintResultGeneric<SwaponSpec>;
export function lint(spec: SwaponSpec): LintResult {
  return lintGeneric(spec, RULES);
}
export function applyAllFixes(spec: SwaponSpec): SwaponSpec {
  return applyAllFixesGeneric(spec, RULES);
}
