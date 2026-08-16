import {
  applyAllFixes as applyAllFixesGeneric,
  lint as lintGeneric,
  type LintResult as LintResultGeneric,
} from "@cmdgen/engine";
import type { EgrepSpec } from "../spec";
import { RULES } from "./rules";

export type LintResult = LintResultGeneric<EgrepSpec>;
export function lint(spec: EgrepSpec): LintResult {
  return lintGeneric(spec, RULES);
}
export function applyAllFixes(spec: EgrepSpec): EgrepSpec {
  return applyAllFixesGeneric(spec, RULES);
}
