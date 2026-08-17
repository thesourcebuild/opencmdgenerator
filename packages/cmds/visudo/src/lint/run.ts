import {
  applyAllFixes as applyAllFixesGeneric,
  lint as lintGeneric,
  type LintResult as LintResultGeneric,
} from "@cmdgen/engine";
import type { VisudoSpec } from "../spec";
import { RULES } from "./rules";

export type LintResult = LintResultGeneric<VisudoSpec>;
export function lint(spec: VisudoSpec): LintResult {
  return lintGeneric(spec, RULES);
}
export function applyAllFixes(spec: VisudoSpec): VisudoSpec {
  return applyAllFixesGeneric(spec, RULES);
}
