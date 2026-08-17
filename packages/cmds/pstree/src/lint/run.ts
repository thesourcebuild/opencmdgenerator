import {
  applyAllFixes as applyAllFixesGeneric,
  lint as lintGeneric,
  type LintResult as LintResultGeneric,
} from "@cmdgen/engine";
import type { PstreeSpec } from "../spec";
import { RULES } from "./rules";

export type LintResult = LintResultGeneric<PstreeSpec>;
export function lint(spec: PstreeSpec): LintResult {
  return lintGeneric(spec, RULES);
}
export function applyAllFixes(spec: PstreeSpec): PstreeSpec {
  return applyAllFixesGeneric(spec, RULES);
}
