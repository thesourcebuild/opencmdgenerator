import {
  applyAllFixes as applyAllFixesGeneric,
  lint as lintGeneric,
  type LintResult as LintResultGeneric,
} from "@cmdgen/engine";
import type { WSpec } from "../spec";
import { RULES } from "./rules";

export type LintResult = LintResultGeneric<WSpec>;
export function lint(spec: WSpec): LintResult {
  return lintGeneric(spec, RULES);
}
export function applyAllFixes(spec: WSpec): WSpec {
  return applyAllFixesGeneric(spec, RULES);
}
