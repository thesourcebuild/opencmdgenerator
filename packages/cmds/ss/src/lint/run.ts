import {
  applyAllFixes as applyAllFixesGeneric,
  lint as lintGeneric,
  type LintResult as LintResultGeneric,
} from "@cmdgen/engine";
import type { SsSpec } from "../spec";
import { RULES } from "./rules";

export type LintResult = LintResultGeneric<SsSpec>;
export function lint(spec: SsSpec): LintResult {
  return lintGeneric(spec, RULES);
}
export function applyAllFixes(spec: SsSpec): SsSpec {
  return applyAllFixesGeneric(spec, RULES);
}
