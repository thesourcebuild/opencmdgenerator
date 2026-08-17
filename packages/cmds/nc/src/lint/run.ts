import {
  applyAllFixes as applyAllFixesGeneric,
  lint as lintGeneric,
  type LintResult as LintResultGeneric,
} from "@cmdgen/engine";
import type { NcSpec } from "../spec";
import { RULES } from "./rules";

export type LintResult = LintResultGeneric<NcSpec>;
export function lint(spec: NcSpec): LintResult {
  return lintGeneric(spec, RULES);
}
export function applyAllFixes(spec: NcSpec): NcSpec {
  return applyAllFixesGeneric(spec, RULES);
}
