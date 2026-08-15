import { applyAllFixes as applyAllFixesGeneric, lint as lintGeneric, type LintResult as LintResultGeneric } from "@cmdgen/engine";
import type { AliasSpec } from "../spec";
import { RULES } from "./rules";

export type LintResult = LintResultGeneric<AliasSpec>;

export function lint(spec: AliasSpec): LintResult {
  return lintGeneric(spec, RULES);
}

/** Apply every diagnostic that offers a mechanical fix, in code order. */
export function applyAllFixes(spec: AliasSpec): AliasSpec {
  return applyAllFixesGeneric(spec, RULES);
}
