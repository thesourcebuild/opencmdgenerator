import { applyAllFixes as applyAllFixesGeneric, lint as lintGeneric, type LintResult as LintResultGeneric } from "@cmdgen/engine";
import type { GroupaddSpec } from "../spec";
import { RULES } from "./rules";

export type LintResult = LintResultGeneric<GroupaddSpec>;

export function lint(spec: GroupaddSpec): LintResult {
  return lintGeneric(spec, RULES);
}

/** Apply every diagnostic that offers a mechanical fix, in code order. */
export function applyAllFixes(spec: GroupaddSpec): GroupaddSpec {
  return applyAllFixesGeneric(spec, RULES);
}
