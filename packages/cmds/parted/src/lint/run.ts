import {
  applyAllFixes as applyAllFixesGeneric,
  lint as lintGeneric,
  type LintResult as LintResultGeneric,
} from "@cmdgen/engine";
import type { PartedSpec } from "../spec";
import { RULES } from "./rules";

export type LintResult = LintResultGeneric<PartedSpec>;
export function lint(spec: PartedSpec): LintResult {
  return lintGeneric(spec, RULES);
}
export function applyAllFixes(spec: PartedSpec): PartedSpec {
  return applyAllFixesGeneric(spec, RULES);
}
