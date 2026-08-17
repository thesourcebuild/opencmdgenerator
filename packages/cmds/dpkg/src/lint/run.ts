import {
  applyAllFixes as applyAllFixesGeneric,
  lint as lintGeneric,
  type LintResult as LintResultGeneric,
} from "@cmdgen/engine";
import type { DpkgSpec } from "../spec";
import { RULES } from "./rules";

export type LintResult = LintResultGeneric<DpkgSpec>;
export function lint(spec: DpkgSpec): LintResult {
  return lintGeneric(spec, RULES);
}
export function applyAllFixes(spec: DpkgSpec): DpkgSpec {
  return applyAllFixesGeneric(spec, RULES);
}
