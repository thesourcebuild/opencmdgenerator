import {
  applyAllFixes as applyAllFixesGeneric,
  lint as lintGeneric,
  type LintResult as LintResultGeneric,
} from "@cmdgen/engine";
import type { MkswapSpec } from "../spec";
import { RULES } from "./rules";

export type LintResult = LintResultGeneric<MkswapSpec>;
export function lint(spec: MkswapSpec): LintResult {
  return lintGeneric(spec, RULES);
}
export function applyAllFixes(spec: MkswapSpec): MkswapSpec {
  return applyAllFixesGeneric(spec, RULES);
}
