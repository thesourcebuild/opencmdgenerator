import { applyAllFixes as applyAllFixesGeneric, lint as lintGeneric, type LintResult as LintResultGeneric } from "@cmdgen/engine";
import type { NslookupSpec } from "../spec";
import { RULES } from "./rules";

export type LintResult = LintResultGeneric<NslookupSpec>;

export function lint(spec: NslookupSpec): LintResult {
  return lintGeneric(spec, RULES);
}

/** Apply every diagnostic that offers a mechanical fix, in code order. */
export function applyAllFixes(spec: NslookupSpec): NslookupSpec {
  return applyAllFixesGeneric(spec, RULES);
}
