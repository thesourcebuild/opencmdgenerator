import {
  applyAllFixes as applyAllFixesGeneric,
  lint as lintGeneric,
  type LintResult as LintResultGeneric,
} from "@cmdgen/engine";
import type { GdiskSpec } from "../spec";
import { RULES } from "./rules";

export type LintResult = LintResultGeneric<GdiskSpec>;
export function lint(spec: GdiskSpec): LintResult {
  return lintGeneric(spec, RULES);
}
export function applyAllFixes(spec: GdiskSpec): GdiskSpec {
  return applyAllFixesGeneric(spec, RULES);
}
