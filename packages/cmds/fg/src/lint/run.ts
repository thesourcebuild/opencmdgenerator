import {
  applyAllFixes as applyAllFixesGeneric,
  lint as lintGeneric,
  type LintResult as LintResultGeneric,
} from "@cmdgen/engine";
import type { FgSpec } from "../spec";
import { RULES } from "./rules";

export type LintResult = LintResultGeneric<FgSpec>;
export function lint(spec: FgSpec): LintResult {
  return lintGeneric(spec, RULES);
}
export function applyAllFixes(spec: FgSpec): FgSpec {
  return applyAllFixesGeneric(spec, RULES);
}
