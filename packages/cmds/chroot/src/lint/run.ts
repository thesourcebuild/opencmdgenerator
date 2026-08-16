import {
  applyAllFixes as applyAllFixesGeneric,
  lint as lintGeneric,
  type LintResult as LintResultGeneric,
} from "@cmdgen/engine";
import type { ChrootSpec } from "../spec";
import { RULES } from "./rules";

export type LintResult = LintResultGeneric<ChrootSpec>;
export function lint(spec: ChrootSpec): LintResult {
  return lintGeneric(spec, RULES);
}
export function applyAllFixes(spec: ChrootSpec): ChrootSpec {
  return applyAllFixesGeneric(spec, RULES);
}
