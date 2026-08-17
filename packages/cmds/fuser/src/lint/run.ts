import {
  applyAllFixes as applyAllFixesGeneric,
  lint as lintGeneric,
  type LintResult as LintResultGeneric,
} from "@cmdgen/engine";
import type { FuserSpec } from "../spec";
import { RULES } from "./rules";

export type LintResult = LintResultGeneric<FuserSpec>;
export function lint(spec: FuserSpec): LintResult {
  return lintGeneric(spec, RULES);
}
export function applyAllFixes(spec: FuserSpec): FuserSpec {
  return applyAllFixesGeneric(spec, RULES);
}
