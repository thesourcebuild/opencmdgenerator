import {
  applyAllFixes as applyAllFixesGeneric,
  lint as lintGeneric,
  type LintResult as LintResultGeneric,
} from "@cmdgen/engine";
import type { LsofSpec } from "../spec";
import { RULES } from "./rules";

export type LintResult = LintResultGeneric<LsofSpec>;
export function lint(spec: LsofSpec): LintResult {
  return lintGeneric(spec, RULES);
}
export function applyAllFixes(spec: LsofSpec): LsofSpec {
  return applyAllFixesGeneric(spec, RULES);
}
