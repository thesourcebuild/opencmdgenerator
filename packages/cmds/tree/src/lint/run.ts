import {
  applyAllFixes as applyAllFixesGeneric,
  lint as lintGeneric,
  type LintResult as LintResultGeneric,
} from "@cmdgen/engine";
import type { TreeSpec } from "../spec";
import { RULES } from "./rules";

export type LintResult = LintResultGeneric<TreeSpec>;
export function lint(spec: TreeSpec): LintResult {
  return lintGeneric(spec, RULES);
}
export function applyAllFixes(spec: TreeSpec): TreeSpec {
  return applyAllFixesGeneric(spec, RULES);
}
