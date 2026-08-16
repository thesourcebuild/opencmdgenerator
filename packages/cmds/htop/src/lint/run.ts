import {
  applyAllFixes as applyAllFixesGeneric,
  lint as lintGeneric,
  type LintResult as LintResultGeneric,
} from "@cmdgen/engine";
import type { HtopSpec } from "../spec";
import { RULES } from "./rules";

export type LintResult = LintResultGeneric<HtopSpec>;
export function lint(spec: HtopSpec): LintResult {
  return lintGeneric(spec, RULES);
}
export function applyAllFixes(spec: HtopSpec): HtopSpec {
  return applyAllFixesGeneric(spec, RULES);
}
