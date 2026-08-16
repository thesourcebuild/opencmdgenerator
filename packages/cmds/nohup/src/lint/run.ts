import {
  applyAllFixes as applyAllFixesGeneric,
  lint as lintGeneric,
  type LintResult as LintResultGeneric,
} from "@cmdgen/engine";
import type { NohupSpec } from "../spec";
import { RULES } from "./rules";

export type LintResult = LintResultGeneric<NohupSpec>;
export function lint(spec: NohupSpec): LintResult {
  return lintGeneric(spec, RULES);
}
export function applyAllFixes(spec: NohupSpec): NohupSpec {
  return applyAllFixesGeneric(spec, RULES);
}
