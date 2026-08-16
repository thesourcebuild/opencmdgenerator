import {
  applyAllFixes as applyAllFixesGeneric,
  lint as lintGeneric,
  type LintResult as LintResultGeneric,
} from "@cmdgen/engine";
import type { XargsSpec } from "../spec";
import { RULES } from "./rules";

export type LintResult = LintResultGeneric<XargsSpec>;
export function lint(spec: XargsSpec): LintResult {
  return lintGeneric(spec, RULES);
}
export function applyAllFixes(spec: XargsSpec): XargsSpec {
  return applyAllFixesGeneric(spec, RULES);
}
