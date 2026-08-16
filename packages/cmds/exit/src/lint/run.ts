import {
  applyAllFixes as applyAllFixesGeneric,
  lint as lintGeneric,
  type LintResult as LintResultGeneric,
} from "@cmdgen/engine";
import type { ExitSpec } from "../spec";
import { RULES } from "./rules";

export type LintResult = LintResultGeneric<ExitSpec>;
export function lint(spec: ExitSpec): LintResult {
  return lintGeneric(spec, RULES);
}
export function applyAllFixes(spec: ExitSpec): ExitSpec {
  return applyAllFixesGeneric(spec, RULES);
}
