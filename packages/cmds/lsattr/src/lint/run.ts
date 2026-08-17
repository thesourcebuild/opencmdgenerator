import {
  applyAllFixes as applyAllFixesGeneric,
  lint as lintGeneric,
  type LintResult as LintResultGeneric,
} from "@cmdgen/engine";
import type { LsattrSpec } from "../spec";
import { RULES } from "./rules";

export type LintResult = LintResultGeneric<LsattrSpec>;
export function lint(spec: LsattrSpec): LintResult {
  return lintGeneric(spec, RULES);
}
export function applyAllFixes(spec: LsattrSpec): LsattrSpec {
  return applyAllFixesGeneric(spec, RULES);
}
