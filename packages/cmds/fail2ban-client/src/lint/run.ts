import {
  applyAllFixes as applyAllFixesGeneric,
  lint as lintGeneric,
  type LintResult as LintResultGeneric,
} from "@cmdgen/engine";
import type { Fail2banClientSpec } from "../spec";
import { RULES } from "./rules";

export type LintResult = LintResultGeneric<Fail2banClientSpec>;
export function lint(spec: Fail2banClientSpec): LintResult {
  return lintGeneric(spec, RULES);
}
export function applyAllFixes(spec: Fail2banClientSpec): Fail2banClientSpec {
  return applyAllFixesGeneric(spec, RULES);
}
