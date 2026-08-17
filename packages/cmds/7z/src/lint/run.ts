import {
  applyAllFixes as applyAllFixesGeneric,
  lint as lintGeneric,
  type LintResult as LintResultGeneric,
} from "@cmdgen/engine";
import type { SevenzSpec } from "../spec";
import { RULES } from "./rules";

export type LintResult = LintResultGeneric<SevenzSpec>;
export function lint(spec: SevenzSpec): LintResult {
  return lintGeneric(spec, RULES);
}
export function applyAllFixes(spec: SevenzSpec): SevenzSpec {
  return applyAllFixesGeneric(spec, RULES);
}
