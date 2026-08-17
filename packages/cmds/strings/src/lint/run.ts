import {
  applyAllFixes as applyAllFixesGeneric,
  lint as lintGeneric,
  type LintResult as LintResultGeneric,
} from "@cmdgen/engine";
import type { StringsSpec } from "../spec";
import { RULES } from "./rules";

export type LintResult = LintResultGeneric<StringsSpec>;
export function lint(spec: StringsSpec): LintResult {
  return lintGeneric(spec, RULES);
}
export function applyAllFixes(spec: StringsSpec): StringsSpec {
  return applyAllFixesGeneric(spec, RULES);
}
