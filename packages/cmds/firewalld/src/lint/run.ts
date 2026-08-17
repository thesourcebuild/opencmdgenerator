import {
  applyAllFixes as applyAllFixesGeneric,
  lint as lintGeneric,
  type LintResult as LintResultGeneric,
} from "@cmdgen/engine";
import type { FirewalldSpec } from "../spec";
import { RULES } from "./rules";

export type LintResult = LintResultGeneric<FirewalldSpec>;
export function lint(spec: FirewalldSpec): LintResult {
  return lintGeneric(spec, RULES);
}
export function applyAllFixes(spec: FirewalldSpec): FirewalldSpec {
  return applyAllFixesGeneric(spec, RULES);
}
