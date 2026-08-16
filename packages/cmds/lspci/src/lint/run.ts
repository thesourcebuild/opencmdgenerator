import {
  applyAllFixes as applyAllFixesGeneric,
  lint as lintGeneric,
  type LintResult as LintResultGeneric,
} from "@cmdgen/engine";
import type { LspciSpec } from "../spec";
import { RULES } from "./rules";

export type LintResult = LintResultGeneric<LspciSpec>;
export function lint(spec: LspciSpec): LintResult {
  return lintGeneric(spec, RULES);
}
export function applyAllFixes(spec: LspciSpec): LspciSpec {
  return applyAllFixesGeneric(spec, RULES);
}
