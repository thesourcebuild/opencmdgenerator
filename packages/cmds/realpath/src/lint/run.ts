import {
  applyAllFixes as applyAllFixesGeneric,
  lint as lintGeneric,
  type LintResult as LintResultGeneric,
} from "@cmdgen/engine";
import type { RealpathSpec } from "../spec";
import { RULES } from "./rules";

export type LintResult = LintResultGeneric<RealpathSpec>;
export function lint(spec: RealpathSpec): LintResult {
  return lintGeneric(spec, RULES);
}
export function applyAllFixes(spec: RealpathSpec): RealpathSpec {
  return applyAllFixesGeneric(spec, RULES);
}
