import {
  applyAllFixes as applyAllFixesGeneric,
  lint as lintGeneric,
  type LintResult as LintResultGeneric,
} from "@cmdgen/engine";
import type { LsmodSpec } from "../spec";
import { RULES } from "./rules";

export type LintResult = LintResultGeneric<LsmodSpec>;
export function lint(spec: LsmodSpec): LintResult {
  return lintGeneric(spec, RULES);
}
export function applyAllFixes(spec: LsmodSpec): LsmodSpec {
  return applyAllFixesGeneric(spec, RULES);
}
