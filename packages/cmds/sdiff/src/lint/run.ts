import {
  applyAllFixes as applyAllFixesGeneric,
  lint as lintGeneric,
  type LintResult as LintResultGeneric,
} from "@cmdgen/engine";
import type { SdiffSpec } from "../spec";
import { RULES } from "./rules";

export type LintResult = LintResultGeneric<SdiffSpec>;
export function lint(spec: SdiffSpec): LintResult {
  return lintGeneric(spec, RULES);
}
export function applyAllFixes(spec: SdiffSpec): SdiffSpec {
  return applyAllFixesGeneric(spec, RULES);
}
