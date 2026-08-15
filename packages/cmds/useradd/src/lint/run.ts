import { applyAllFixes as applyAllFixesGeneric, lint as lintGeneric, type LintResult as LintResultGeneric } from "@cmdgen/engine";
import type { UseraddSpec } from "../spec";
import { RULES } from "./rules";

export type LintResult = LintResultGeneric<UseraddSpec>;

export function lint(spec: UseraddSpec): LintResult {
  return lintGeneric(spec, RULES);
}

/** Apply every diagnostic that offers a mechanical fix, in code order. */
export function applyAllFixes(spec: UseraddSpec): UseraddSpec {
  return applyAllFixesGeneric(spec, RULES);
}
