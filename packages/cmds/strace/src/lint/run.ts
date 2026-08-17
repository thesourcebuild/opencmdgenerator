import {
  applyAllFixes as applyAllFixesGeneric,
  lint as lintGeneric,
  type LintResult as LintResultGeneric,
} from "@cmdgen/engine";
import type { StraceSpec } from "../spec";
import { RULES } from "./rules";

export type LintResult = LintResultGeneric<StraceSpec>;
export function lint(spec: StraceSpec): LintResult {
  return lintGeneric(spec, RULES);
}
export function applyAllFixes(spec: StraceSpec): StraceSpec {
  return applyAllFixesGeneric(spec, RULES);
}
