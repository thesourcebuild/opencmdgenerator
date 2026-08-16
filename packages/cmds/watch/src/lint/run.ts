import {
  applyAllFixes as applyAllFixesGeneric,
  lint as lintGeneric,
  type LintResult as LintResultGeneric,
} from "@cmdgen/engine";
import type { WatchSpec } from "../spec";
import { RULES } from "./rules";

export type LintResult = LintResultGeneric<WatchSpec>;
export function lint(spec: WatchSpec): LintResult {
  return lintGeneric(spec, RULES);
}
export function applyAllFixes(spec: WatchSpec): WatchSpec {
  return applyAllFixesGeneric(spec, RULES);
}
