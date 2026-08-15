import {
  applyAllFixes as applyAllFixesGeneric,
  lint as lintGeneric,
  type LintResult as LintResultGeneric,
} from "@cmdgen/engine";
import type { FfmpegSpec } from "../spec";
import { RULES } from "./rules";

export type LintResult = LintResultGeneric<FfmpegSpec>;

export function lint(spec: FfmpegSpec): LintResult {
  return lintGeneric(spec, RULES);
}

export function applyAllFixes(spec: FfmpegSpec): FfmpegSpec {
  return applyAllFixesGeneric(spec, RULES);
}
