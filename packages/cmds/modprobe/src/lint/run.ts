import {
  applyAllFixes as applyAllFixesGeneric,
  lint as lintGeneric,
  type LintResult as LintResultGeneric,
} from "@cmdgen/engine";
import type { ModprobeSpec } from "../spec";
import { RULES } from "./rules";

export type LintResult = LintResultGeneric<ModprobeSpec>;
export function lint(spec: ModprobeSpec): LintResult {
  return lintGeneric(spec, RULES);
}
export function applyAllFixes(spec: ModprobeSpec): ModprobeSpec {
  return applyAllFixesGeneric(spec, RULES);
}
