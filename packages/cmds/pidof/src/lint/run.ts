import {
  applyAllFixes as applyAllFixesGeneric,
  lint as lintGeneric,
  type LintResult as LintResultGeneric,
} from "@cmdgen/engine";
import type { PidofSpec } from "../spec";
import { RULES } from "./rules";

export type LintResult = LintResultGeneric<PidofSpec>;
export function lint(spec: PidofSpec): LintResult {
  return lintGeneric(spec, RULES);
}
export function applyAllFixes(spec: PidofSpec): PidofSpec {
  return applyAllFixesGeneric(spec, RULES);
}
