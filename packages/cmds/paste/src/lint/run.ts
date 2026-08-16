import {
  applyAllFixes as applyAllFixesGeneric,
  lint as lintGeneric,
  type LintResult as LintResultGeneric,
} from "@cmdgen/engine";
import type { PasteSpec } from "../spec";
import { RULES } from "./rules";

export type LintResult = LintResultGeneric<PasteSpec>;
export function lint(spec: PasteSpec): LintResult {
  return lintGeneric(spec, RULES);
}
export function applyAllFixes(spec: PasteSpec): PasteSpec {
  return applyAllFixesGeneric(spec, RULES);
}
