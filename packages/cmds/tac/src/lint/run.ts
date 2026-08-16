import {
  applyAllFixes as applyAllFixesGeneric,
  lint as lintGeneric,
  type LintResult as LintResultGeneric,
} from "@cmdgen/engine";
import type { TacSpec } from "../spec";
import { RULES } from "./rules";

export type LintResult = LintResultGeneric<TacSpec>;
export function lint(spec: TacSpec): LintResult {
  return lintGeneric(spec, RULES);
}
export function applyAllFixes(spec: TacSpec): TacSpec {
  return applyAllFixesGeneric(spec, RULES);
}
