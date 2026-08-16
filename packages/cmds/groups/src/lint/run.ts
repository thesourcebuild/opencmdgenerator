import {
  applyAllFixes as applyAllFixesGeneric,
  lint as lintGeneric,
  type LintResult as LintResultGeneric,
} from "@cmdgen/engine";
import type { GroupsSpec } from "../spec";
import { RULES } from "./rules";

export type LintResult = LintResultGeneric<GroupsSpec>;
export function lint(spec: GroupsSpec): LintResult {
  return lintGeneric(spec, RULES);
}
export function applyAllFixes(spec: GroupsSpec): GroupsSpec {
  return applyAllFixesGeneric(spec, RULES);
}
