import {
  applyAllFixes as applyAllFixesGeneric,
  lint as lintGeneric,
  type LintResult as LintResultGeneric,
} from "@cmdgen/engine";
import type { PrintfSpec } from "../spec";
import { RULES } from "./rules";

export type LintResult = LintResultGeneric<PrintfSpec>;
export function lint(spec: PrintfSpec): LintResult {
  return lintGeneric(spec, RULES);
}
export function applyAllFixes(spec: PrintfSpec): PrintfSpec {
  return applyAllFixesGeneric(spec, RULES);
}
