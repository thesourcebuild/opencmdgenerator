import {
  applyAllFixes as applyAllFixesGeneric,
  lint as lintGeneric,
  type LintResult as LintResultGeneric,
} from "@cmdgen/engine";
import type { TrSpec } from "../spec";
import { RULES } from "./rules";

export type LintResult = LintResultGeneric<TrSpec>;
export function lint(spec: TrSpec): LintResult {
  return lintGeneric(spec, RULES);
}
export function applyAllFixes(spec: TrSpec): TrSpec {
  return applyAllFixesGeneric(spec, RULES);
}
