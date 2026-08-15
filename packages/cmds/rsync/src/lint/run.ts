import { applyAllFixes as applyAllFixesGeneric, lint as lintGeneric, type LintResult as LintResultGeneric } from "@cmdgen/engine";
import type { RsyncSpec } from "../spec";
import { RULES } from "./rules";

export type LintResult = LintResultGeneric<RsyncSpec>;

export function lint(spec: RsyncSpec): LintResult {
  return lintGeneric(spec, RULES);
}

/** Apply every diagnostic that offers a mechanical fix, in code order. */
export function applyAllFixes(spec: RsyncSpec): RsyncSpec {
  return applyAllFixesGeneric(spec, RULES);
}
