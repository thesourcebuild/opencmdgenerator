import {
  applyAllFixes as applyAllFixesGeneric,
  lint as lintGeneric,
  type LintResult as LintResultGeneric,
} from "@cmdgen/engine";
import type { NmcliSpec } from "../spec";
import { RULES } from "./rules";

export type LintResult = LintResultGeneric<NmcliSpec>;
export function lint(spec: NmcliSpec): LintResult {
  return lintGeneric(spec, RULES);
}
export function applyAllFixes(spec: NmcliSpec): NmcliSpec {
  return applyAllFixesGeneric(spec, RULES);
}
