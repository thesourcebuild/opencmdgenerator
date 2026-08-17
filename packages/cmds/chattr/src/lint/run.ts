import {
  applyAllFixes as applyAllFixesGeneric,
  lint as lintGeneric,
  type LintResult as LintResultGeneric,
} from "@cmdgen/engine";
import type { ChattrSpec } from "../spec";
import { RULES } from "./rules";

export type LintResult = LintResultGeneric<ChattrSpec>;
export function lint(spec: ChattrSpec): LintResult {
  return lintGeneric(spec, RULES);
}
export function applyAllFixes(spec: ChattrSpec): ChattrSpec {
  return applyAllFixesGeneric(spec, RULES);
}
