import {
  applyAllFixes as applyAllFixesGeneric,
  lint as lintGeneric,
  type LintResult as LintResultGeneric,
} from "@cmdgen/engine";
import type { NmapSpec } from "../spec";
import { RULES } from "./rules";

export type LintResult = LintResultGeneric<NmapSpec>;
export function lint(spec: NmapSpec): LintResult {
  return lintGeneric(spec, RULES);
}
export function applyAllFixes(spec: NmapSpec): NmapSpec {
  return applyAllFixesGeneric(spec, RULES);
}
