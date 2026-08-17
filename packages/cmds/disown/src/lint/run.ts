import {
  applyAllFixes as applyAllFixesGeneric,
  lint as lintGeneric,
  type LintResult as LintResultGeneric,
} from "@cmdgen/engine";
import type { DisownSpec } from "../spec";
import { RULES } from "./rules";

export type LintResult = LintResultGeneric<DisownSpec>;
export function lint(spec: DisownSpec): LintResult {
  return lintGeneric(spec, RULES);
}
export function applyAllFixes(spec: DisownSpec): DisownSpec {
  return applyAllFixesGeneric(spec, RULES);
}
