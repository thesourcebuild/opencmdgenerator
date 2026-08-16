import {
  applyAllFixes as applyAllFixesGeneric,
  lint as lintGeneric,
  type LintResult as LintResultGeneric,
} from "@cmdgen/engine";
import type { HostnameSpec } from "../spec";
import { RULES } from "./rules";

export type LintResult = LintResultGeneric<HostnameSpec>;
export function lint(spec: HostnameSpec): LintResult {
  return lintGeneric(spec, RULES);
}
export function applyAllFixes(spec: HostnameSpec): HostnameSpec {
  return applyAllFixesGeneric(spec, RULES);
}
