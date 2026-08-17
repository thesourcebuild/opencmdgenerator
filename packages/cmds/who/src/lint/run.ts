import {
  applyAllFixes as applyAllFixesGeneric,
  lint as lintGeneric,
  type LintResult as LintResultGeneric,
} from "@cmdgen/engine";
import type { WhoSpec } from "../spec";
import { RULES } from "./rules";

export type LintResult = LintResultGeneric<WhoSpec>;
export function lint(spec: WhoSpec): LintResult {
  return lintGeneric(spec, RULES);
}
export function applyAllFixes(spec: WhoSpec): WhoSpec {
  return applyAllFixesGeneric(spec, RULES);
}
