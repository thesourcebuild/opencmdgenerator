import {
  applyAllFixes as applyAllFixesGeneric,
  lint as lintGeneric,
  type LintResult as LintResultGeneric,
} from "@cmdgen/engine";
import type { SnapSpec } from "../spec";
import { RULES } from "./rules";

export type LintResult = LintResultGeneric<SnapSpec>;
export function lint(spec: SnapSpec): LintResult {
  return lintGeneric(spec, RULES);
}
export function applyAllFixes(spec: SnapSpec): SnapSpec {
  return applyAllFixesGeneric(spec, RULES);
}
