import {
  applyAllFixes as applyAllFixesGeneric,
  lint as lintGeneric,
  type LintResult as LintResultGeneric,
} from "@cmdgen/engine";
import type { FgrepSpec } from "../spec";
import { RULES } from "./rules";

export type LintResult = LintResultGeneric<FgrepSpec>;
export function lint(spec: FgrepSpec): LintResult {
  return lintGeneric(spec, RULES);
}
export function applyAllFixes(spec: FgrepSpec): FgrepSpec {
  return applyAllFixesGeneric(spec, RULES);
}
