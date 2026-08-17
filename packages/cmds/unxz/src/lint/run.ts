import {
  applyAllFixes as applyAllFixesGeneric,
  lint as lintGeneric,
  type LintResult as LintResultGeneric,
} from "@cmdgen/engine";
import type { UnxzSpec } from "../spec";
import { RULES } from "./rules";

export type LintResult = LintResultGeneric<UnxzSpec>;
export function lint(spec: UnxzSpec): LintResult {
  return lintGeneric(spec, RULES);
}
export function applyAllFixes(spec: UnxzSpec): UnxzSpec {
  return applyAllFixesGeneric(spec, RULES);
}
