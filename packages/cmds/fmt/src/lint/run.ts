import {
  applyAllFixes as applyAllFixesGeneric,
  lint as lintGeneric,
  type LintResult as LintResultGeneric,
} from "@cmdgen/engine";
import type { FmtSpec } from "../spec";
import { RULES } from "./rules";

export type LintResult = LintResultGeneric<FmtSpec>;
export function lint(spec: FmtSpec): LintResult {
  return lintGeneric(spec, RULES);
}
export function applyAllFixes(spec: FmtSpec): FmtSpec {
  return applyAllFixesGeneric(spec, RULES);
}
