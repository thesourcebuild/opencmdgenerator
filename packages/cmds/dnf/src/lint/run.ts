import {
  applyAllFixes as applyAllFixesGeneric,
  lint as lintGeneric,
  type LintResult as LintResultGeneric,
} from "@cmdgen/engine";
import type { DnfSpec } from "../spec";
import { RULES } from "./rules";

export type LintResult = LintResultGeneric<DnfSpec>;
export function lint(spec: DnfSpec): LintResult {
  return lintGeneric(spec, RULES);
}
export function applyAllFixes(spec: DnfSpec): DnfSpec {
  return applyAllFixesGeneric(spec, RULES);
}
