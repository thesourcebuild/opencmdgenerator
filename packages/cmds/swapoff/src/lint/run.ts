import {
  applyAllFixes as applyAllFixesGeneric,
  lint as lintGeneric,
  type LintResult as LintResultGeneric,
} from "@cmdgen/engine";
import type { SwapoffSpec } from "../spec";
import { RULES } from "./rules";

export type LintResult = LintResultGeneric<SwapoffSpec>;
export function lint(spec: SwapoffSpec): LintResult {
  return lintGeneric(spec, RULES);
}
export function applyAllFixes(spec: SwapoffSpec): SwapoffSpec {
  return applyAllFixesGeneric(spec, RULES);
}
