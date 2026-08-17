import {
  applyAllFixes as applyAllFixesGeneric,
  lint as lintGeneric,
  type LintResult as LintResultGeneric,
} from "@cmdgen/engine";
import type { ChkconfigSpec } from "../spec";
import { RULES } from "./rules";

export type LintResult = LintResultGeneric<ChkconfigSpec>;
export function lint(spec: ChkconfigSpec): LintResult {
  return lintGeneric(spec, RULES);
}
export function applyAllFixes(spec: ChkconfigSpec): ChkconfigSpec {
  return applyAllFixesGeneric(spec, RULES);
}
