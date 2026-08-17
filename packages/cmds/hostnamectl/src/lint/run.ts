import {
  applyAllFixes as applyAllFixesGeneric,
  lint as lintGeneric,
  type LintResult as LintResultGeneric,
} from "@cmdgen/engine";
import type { HostnamectlSpec } from "../spec";
import { RULES } from "./rules";

export type LintResult = LintResultGeneric<HostnamectlSpec>;
export function lint(spec: HostnamectlSpec): LintResult {
  return lintGeneric(spec, RULES);
}
export function applyAllFixes(spec: HostnamectlSpec): HostnamectlSpec {
  return applyAllFixesGeneric(spec, RULES);
}
