import {
  applyAllFixes as applyAllFixesGeneric,
  lint as lintGeneric,
  type LintResult as LintResultGeneric,
} from "@cmdgen/engine";
import type { Tune2fsSpec } from "../spec";
import { RULES } from "./rules";

export type LintResult = LintResultGeneric<Tune2fsSpec>;
export function lint(spec: Tune2fsSpec): LintResult {
  return lintGeneric(spec, RULES);
}
export function applyAllFixes(spec: Tune2fsSpec): Tune2fsSpec {
  return applyAllFixesGeneric(spec, RULES);
}
