import {
  applyAllFixes as applyAllFixesGeneric,
  lint as lintGeneric,
  type LintResult as LintResultGeneric,
} from "@cmdgen/engine";
import type { OdSpec } from "../spec";
import { RULES } from "./rules";

export type LintResult = LintResultGeneric<OdSpec>;
export function lint(spec: OdSpec): LintResult {
  return lintGeneric(spec, RULES);
}
export function applyAllFixes(spec: OdSpec): OdSpec {
  return applyAllFixesGeneric(spec, RULES);
}
