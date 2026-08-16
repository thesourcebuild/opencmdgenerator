import {
  applyAllFixes as applyAllFixesGeneric,
  lint as lintGeneric,
  type LintResult as LintResultGeneric,
} from "@cmdgen/engine";
import type { StatSpec } from "../spec";
import { RULES } from "./rules";

export type LintResult = LintResultGeneric<StatSpec>;
export function lint(spec: StatSpec): LintResult {
  return lintGeneric(spec, RULES);
}
export function applyAllFixes(spec: StatSpec): StatSpec {
  return applyAllFixesGeneric(spec, RULES);
}
