import {
  applyAllFixes as applyAllFixesGeneric,
  lint as lintGeneric,
  type LintResult as LintResultGeneric,
} from "@cmdgen/engine";
import type { IwconfigSpec } from "../spec";
import { RULES } from "./rules";

export type LintResult = LintResultGeneric<IwconfigSpec>;
export function lint(spec: IwconfigSpec): LintResult {
  return lintGeneric(spec, RULES);
}
export function applyAllFixes(spec: IwconfigSpec): IwconfigSpec {
  return applyAllFixesGeneric(spec, RULES);
}
