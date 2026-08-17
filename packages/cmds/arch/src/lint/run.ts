import {
  applyAllFixes as applyAllFixesGeneric,
  lint as lintGeneric,
  type LintResult as LintResultGeneric,
} from "@cmdgen/engine";
import type { ArchSpec } from "../spec";
import { RULES } from "./rules";

export type LintResult = LintResultGeneric<ArchSpec>;
export function lint(spec: ArchSpec): LintResult {
  return lintGeneric(spec, RULES);
}
export function applyAllFixes(spec: ArchSpec): ArchSpec {
  return applyAllFixesGeneric(spec, RULES);
}
