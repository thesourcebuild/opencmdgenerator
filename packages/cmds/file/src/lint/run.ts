import {
  applyAllFixes as applyAllFixesGeneric,
  lint as lintGeneric,
  type LintResult as LintResultGeneric,
} from "@cmdgen/engine";
import type { FileSpec } from "../spec";
import { RULES } from "./rules";

export type LintResult = LintResultGeneric<FileSpec>;
export function lint(spec: FileSpec): LintResult {
  return lintGeneric(spec, RULES);
}
export function applyAllFixes(spec: FileSpec): FileSpec {
  return applyAllFixesGeneric(spec, RULES);
}
