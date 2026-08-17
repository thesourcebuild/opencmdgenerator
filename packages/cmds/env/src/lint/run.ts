import {
  applyAllFixes as applyAllFixesGeneric,
  lint as lintGeneric,
  type LintResult as LintResultGeneric,
} from "@cmdgen/engine";
import type { EnvSpec } from "../spec";
import { RULES } from "./rules";

export type LintResult = LintResultGeneric<EnvSpec>;
export function lint(spec: EnvSpec): LintResult {
  return lintGeneric(spec, RULES);
}
export function applyAllFixes(spec: EnvSpec): EnvSpec {
  return applyAllFixesGeneric(spec, RULES);
}
