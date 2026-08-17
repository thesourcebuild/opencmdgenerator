import {
  applyAllFixes as applyAllFixesGeneric,
  lint as lintGeneric,
  type LintResult as LintResultGeneric,
} from "@cmdgen/engine";
import type { MtrSpec } from "../spec";
import { RULES } from "./rules";

export type LintResult = LintResultGeneric<MtrSpec>;
export function lint(spec: MtrSpec): LintResult {
  return lintGeneric(spec, RULES);
}
export function applyAllFixes(spec: MtrSpec): MtrSpec {
  return applyAllFixesGeneric(spec, RULES);
}
