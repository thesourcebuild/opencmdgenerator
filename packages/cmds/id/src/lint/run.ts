import {
  applyAllFixes as applyAllFixesGeneric,
  lint as lintGeneric,
  type LintResult as LintResultGeneric,
} from "@cmdgen/engine";
import type { IdSpec } from "../spec";
import { RULES } from "./rules";

export type LintResult = LintResultGeneric<IdSpec>;
export function lint(spec: IdSpec): LintResult {
  return lintGeneric(spec, RULES);
}
export function applyAllFixes(spec: IdSpec): IdSpec {
  return applyAllFixesGeneric(spec, RULES);
}
