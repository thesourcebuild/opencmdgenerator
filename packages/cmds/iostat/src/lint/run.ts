import {
  applyAllFixes as applyAllFixesGeneric,
  lint as lintGeneric,
  type LintResult as LintResultGeneric,
} from "@cmdgen/engine";
import type { IostatSpec } from "../spec";
import { RULES } from "./rules";

export type LintResult = LintResultGeneric<IostatSpec>;
export function lint(spec: IostatSpec): LintResult {
  return lintGeneric(spec, RULES);
}
export function applyAllFixes(spec: IostatSpec): IostatSpec {
  return applyAllFixesGeneric(spec, RULES);
}
