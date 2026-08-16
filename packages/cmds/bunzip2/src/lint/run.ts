import {
  applyAllFixes as applyAllFixesGeneric,
  lint as lintGeneric,
  type LintResult as LintResultGeneric,
} from "@cmdgen/engine";
import type { Bunzip2Spec } from "../spec";
import { RULES } from "./rules";

export type LintResult = LintResultGeneric<Bunzip2Spec>;
export function lint(spec: Bunzip2Spec): LintResult {
  return lintGeneric(spec, RULES);
}
export function applyAllFixes(spec: Bunzip2Spec): Bunzip2Spec {
  return applyAllFixesGeneric(spec, RULES);
}
