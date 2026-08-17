import {
  applyAllFixes as applyAllFixesGeneric,
  lint as lintGeneric,
  type LintResult as LintResultGeneric,
} from "@cmdgen/engine";
import type { SyncSpec } from "../spec";
import { RULES } from "./rules";

export type LintResult = LintResultGeneric<SyncSpec>;
export function lint(spec: SyncSpec): LintResult {
  return lintGeneric(spec, RULES);
}
export function applyAllFixes(spec: SyncSpec): SyncSpec {
  return applyAllFixesGeneric(spec, RULES);
}
