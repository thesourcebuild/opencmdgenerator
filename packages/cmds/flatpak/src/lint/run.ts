import {
  applyAllFixes as applyAllFixesGeneric,
  lint as lintGeneric,
  type LintResult as LintResultGeneric,
} from "@cmdgen/engine";
import type { FlatpakSpec } from "../spec";
import { RULES } from "./rules";

export type LintResult = LintResultGeneric<FlatpakSpec>;
export function lint(spec: FlatpakSpec): LintResult {
  return lintGeneric(spec, RULES);
}
export function applyAllFixes(spec: FlatpakSpec): FlatpakSpec {
  return applyAllFixesGeneric(spec, RULES);
}
