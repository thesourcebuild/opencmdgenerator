import {
  applyAllFixes as applyAllFixesGeneric,
  lint as lintGeneric,
  type LintResult as LintResultGeneric,
} from "@cmdgen/engine";
import type { HostSpec } from "../spec";
import { RULES } from "./rules";

export type LintResult = LintResultGeneric<HostSpec>;
export function lint(spec: HostSpec): LintResult {
  return lintGeneric(spec, RULES);
}
export function applyAllFixes(spec: HostSpec): HostSpec {
  return applyAllFixesGeneric(spec, RULES);
}
