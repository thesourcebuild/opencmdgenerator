import {
  applyAllFixes as applyAllFixesGeneric,
  lint as lintGeneric,
  type LintResult as LintResultGeneric,
} from "@cmdgen/engine";
import type { BgSpec } from "../spec";
import { RULES } from "./rules";

export type LintResult = LintResultGeneric<BgSpec>;
export function lint(spec: BgSpec): LintResult {
  return lintGeneric(spec, RULES);
}
export function applyAllFixes(spec: BgSpec): BgSpec {
  return applyAllFixesGeneric(spec, RULES);
}
