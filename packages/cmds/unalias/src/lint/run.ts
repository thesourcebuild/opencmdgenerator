import {
  applyAllFixes as applyAllFixesGeneric,
  lint as lintGeneric,
  type LintResult as LintResultGeneric,
} from "@cmdgen/engine";
import type { UnaliasSpec } from "../spec";
import { RULES } from "./rules";

export type LintResult = LintResultGeneric<UnaliasSpec>;
export function lint(spec: UnaliasSpec): LintResult {
  return lintGeneric(spec, RULES);
}
export function applyAllFixes(spec: UnaliasSpec): UnaliasSpec {
  return applyAllFixesGeneric(spec, RULES);
}
