import {
  applyAllFixes as applyAllFixesGeneric,
  lint as lintGeneric,
  type LintResult as LintResultGeneric,
} from "@cmdgen/engine";
import type { E2fsckSpec } from "../spec";
import { RULES } from "./rules";

export type LintResult = LintResultGeneric<E2fsckSpec>;
export function lint(spec: E2fsckSpec): LintResult {
  return lintGeneric(spec, RULES);
}
export function applyAllFixes(spec: E2fsckSpec): E2fsckSpec {
  return applyAllFixesGeneric(spec, RULES);
}
