import {
  applyAllFixes as applyAllFixesGeneric,
  lint as lintGeneric,
  type LintResult as LintResultGeneric,
} from "@cmdgen/engine";
import type { NlSpec } from "../spec";
import { RULES } from "./rules";

export type LintResult = LintResultGeneric<NlSpec>;
export function lint(spec: NlSpec): LintResult {
  return lintGeneric(spec, RULES);
}
export function applyAllFixes(spec: NlSpec): NlSpec {
  return applyAllFixesGeneric(spec, RULES);
}
