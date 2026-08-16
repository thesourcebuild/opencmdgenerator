import {
  applyAllFixes as applyAllFixesGeneric,
  lint as lintGeneric,
  type LintResult as LintResultGeneric,
} from "@cmdgen/engine";
import type { GroupdelSpec } from "../spec";
import { RULES } from "./rules";

export type LintResult = LintResultGeneric<GroupdelSpec>;
export function lint(spec: GroupdelSpec): LintResult {
  return lintGeneric(spec, RULES);
}
export function applyAllFixes(spec: GroupdelSpec): GroupdelSpec {
  return applyAllFixesGeneric(spec, RULES);
}
