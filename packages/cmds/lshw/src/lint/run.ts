import {
  applyAllFixes as applyAllFixesGeneric,
  lint as lintGeneric,
  type LintResult as LintResultGeneric,
} from "@cmdgen/engine";
import type { LshwSpec } from "../spec";
import { RULES } from "./rules";

export type LintResult = LintResultGeneric<LshwSpec>;
export function lint(spec: LshwSpec): LintResult {
  return lintGeneric(spec, RULES);
}
export function applyAllFixes(spec: LshwSpec): LshwSpec {
  return applyAllFixesGeneric(spec, RULES);
}
