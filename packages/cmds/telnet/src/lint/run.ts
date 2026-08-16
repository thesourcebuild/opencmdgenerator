import {
  applyAllFixes as applyAllFixesGeneric,
  lint as lintGeneric,
  type LintResult as LintResultGeneric,
} from "@cmdgen/engine";
import type { TelnetSpec } from "../spec";
import { RULES } from "./rules";

export type LintResult = LintResultGeneric<TelnetSpec>;
export function lint(spec: TelnetSpec): LintResult {
  return lintGeneric(spec, RULES);
}
export function applyAllFixes(spec: TelnetSpec): TelnetSpec {
  return applyAllFixesGeneric(spec, RULES);
}
