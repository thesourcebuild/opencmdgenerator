import {
  applyAllFixes as applyAllFixesGeneric,
  lint as lintGeneric,
  type LintResult as LintResultGeneric,
} from "@cmdgen/engine";
import type { Bzip2Spec } from "../spec";
import { RULES } from "./rules";

export type LintResult = LintResultGeneric<Bzip2Spec>;
export function lint(spec: Bzip2Spec): LintResult {
  return lintGeneric(spec, RULES);
}
export function applyAllFixes(spec: Bzip2Spec): Bzip2Spec {
  return applyAllFixesGeneric(spec, RULES);
}
