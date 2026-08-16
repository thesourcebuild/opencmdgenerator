import {
  applyAllFixes as applyAllFixesGeneric,
  lint as lintGeneric,
  type LintResult as LintResultGeneric,
} from "@cmdgen/engine";
import type { UserdelSpec } from "../spec";
import { RULES } from "./rules";

export type LintResult = LintResultGeneric<UserdelSpec>;
export function lint(spec: UserdelSpec): LintResult {
  return lintGeneric(spec, RULES);
}
export function applyAllFixes(spec: UserdelSpec): UserdelSpec {
  return applyAllFixesGeneric(spec, RULES);
}
