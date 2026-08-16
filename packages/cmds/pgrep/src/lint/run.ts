import {
  applyAllFixes as applyAllFixesGeneric,
  lint as lintGeneric,
  type LintResult as LintResultGeneric,
} from "@cmdgen/engine";
import type { PgrepSpec } from "../spec";
import { RULES } from "./rules";

export type LintResult = LintResultGeneric<PgrepSpec>;
export function lint(spec: PgrepSpec): LintResult {
  return lintGeneric(spec, RULES);
}
export function applyAllFixes(spec: PgrepSpec): PgrepSpec {
  return applyAllFixesGeneric(spec, RULES);
}
