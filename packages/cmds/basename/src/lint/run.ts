import {
  applyAllFixes as applyAllFixesGeneric,
  lint as lintGeneric,
  type LintResult as LintResultGeneric,
} from "@cmdgen/engine";
import type { BasenameSpec } from "../spec";
import { RULES } from "./rules";

export type LintResult = LintResultGeneric<BasenameSpec>;
export function lint(spec: BasenameSpec): LintResult {
  return lintGeneric(spec, RULES);
}
export function applyAllFixes(spec: BasenameSpec): BasenameSpec {
  return applyAllFixesGeneric(spec, RULES);
}
