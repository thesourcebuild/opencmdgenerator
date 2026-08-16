import {
  applyAllFixes as applyAllFixesGeneric,
  lint as lintGeneric,
  type LintResult as LintResultGeneric,
} from "@cmdgen/engine";
import type { LastSpec } from "../spec";
import { RULES } from "./rules";

export type LintResult = LintResultGeneric<LastSpec>;
export function lint(spec: LastSpec): LintResult {
  return lintGeneric(spec, RULES);
}
export function applyAllFixes(spec: LastSpec): LastSpec {
  return applyAllFixesGeneric(spec, RULES);
}
