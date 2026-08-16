import {
  applyAllFixes as applyAllFixesGeneric,
  lint as lintGeneric,
  type LintResult as LintResultGeneric,
} from "@cmdgen/engine";
import type { NiceSpec } from "../spec";
import { RULES } from "./rules";

export type LintResult = LintResultGeneric<NiceSpec>;
export function lint(spec: NiceSpec): LintResult {
  return lintGeneric(spec, RULES);
}
export function applyAllFixes(spec: NiceSpec): NiceSpec {
  return applyAllFixesGeneric(spec, RULES);
}
