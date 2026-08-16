import {
  applyAllFixes as applyAllFixesGeneric,
  lint as lintGeneric,
  type LintResult as LintResultGeneric,
} from "@cmdgen/engine";
import type { DateSpec } from "../spec";
import { RULES } from "./rules";

export type LintResult = LintResultGeneric<DateSpec>;
export function lint(spec: DateSpec): LintResult {
  return lintGeneric(spec, RULES);
}
export function applyAllFixes(spec: DateSpec): DateSpec {
  return applyAllFixesGeneric(spec, RULES);
}
