import {
  applyAllFixes as applyAllFixesGeneric,
  lint as lintGeneric,
  type LintResult as LintResultGeneric,
} from "@cmdgen/engine";
import type { ChshSpec } from "../spec";
import { RULES } from "./rules";

export type LintResult = LintResultGeneric<ChshSpec>;
export function lint(spec: ChshSpec): LintResult {
  return lintGeneric(spec, RULES);
}
export function applyAllFixes(spec: ChshSpec): ChshSpec {
  return applyAllFixesGeneric(spec, RULES);
}
