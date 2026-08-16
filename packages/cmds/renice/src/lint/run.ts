import {
  applyAllFixes as applyAllFixesGeneric,
  lint as lintGeneric,
  type LintResult as LintResultGeneric,
} from "@cmdgen/engine";
import type { ReniceSpec } from "../spec";
import { RULES } from "./rules";

export type LintResult = LintResultGeneric<ReniceSpec>;
export function lint(spec: ReniceSpec): LintResult {
  return lintGeneric(spec, RULES);
}
export function applyAllFixes(spec: ReniceSpec): ReniceSpec {
  return applyAllFixesGeneric(spec, RULES);
}
