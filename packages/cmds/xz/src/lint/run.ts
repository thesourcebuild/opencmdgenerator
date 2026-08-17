import {
  applyAllFixes as applyAllFixesGeneric,
  lint as lintGeneric,
  type LintResult as LintResultGeneric,
} from "@cmdgen/engine";
import type { XzSpec } from "../spec";
import { RULES } from "./rules";

export type LintResult = LintResultGeneric<XzSpec>;
export function lint(spec: XzSpec): LintResult {
  return lintGeneric(spec, RULES);
}
export function applyAllFixes(spec: XzSpec): XzSpec {
  return applyAllFixesGeneric(spec, RULES);
}
