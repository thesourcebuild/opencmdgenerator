import {
  applyAllFixes as applyAllFixesGeneric,
  lint as lintGeneric,
  type LintResult as LintResultGeneric,
} from "@cmdgen/engine";
import type { InsmodSpec } from "../spec";
import { RULES } from "./rules";

export type LintResult = LintResultGeneric<InsmodSpec>;
export function lint(spec: InsmodSpec): LintResult {
  return lintGeneric(spec, RULES);
}
export function applyAllFixes(spec: InsmodSpec): InsmodSpec {
  return applyAllFixesGeneric(spec, RULES);
}
