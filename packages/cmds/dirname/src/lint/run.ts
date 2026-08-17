import {
  applyAllFixes as applyAllFixesGeneric,
  lint as lintGeneric,
  type LintResult as LintResultGeneric,
} from "@cmdgen/engine";
import type { DirnameSpec } from "../spec";
import { RULES } from "./rules";

export type LintResult = LintResultGeneric<DirnameSpec>;
export function lint(spec: DirnameSpec): LintResult {
  return lintGeneric(spec, RULES);
}
export function applyAllFixes(spec: DirnameSpec): DirnameSpec {
  return applyAllFixesGeneric(spec, RULES);
}
