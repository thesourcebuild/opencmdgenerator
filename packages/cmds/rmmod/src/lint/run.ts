import {
  applyAllFixes as applyAllFixesGeneric,
  lint as lintGeneric,
  type LintResult as LintResultGeneric,
} from "@cmdgen/engine";
import type { RmmodSpec } from "../spec";
import { RULES } from "./rules";

export type LintResult = LintResultGeneric<RmmodSpec>;
export function lint(spec: RmmodSpec): LintResult {
  return lintGeneric(spec, RULES);
}
export function applyAllFixes(spec: RmmodSpec): RmmodSpec {
  return applyAllFixesGeneric(spec, RULES);
}
