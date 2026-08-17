import {
  applyAllFixes as applyAllFixesGeneric,
  lint as lintGeneric,
  type LintResult as LintResultGeneric,
} from "@cmdgen/engine";
import type { DmidecodeSpec } from "../spec";
import { RULES } from "./rules";

export type LintResult = LintResultGeneric<DmidecodeSpec>;
export function lint(spec: DmidecodeSpec): LintResult {
  return lintGeneric(spec, RULES);
}
export function applyAllFixes(spec: DmidecodeSpec): DmidecodeSpec {
  return applyAllFixesGeneric(spec, RULES);
}
