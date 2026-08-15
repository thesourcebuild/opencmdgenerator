import { applyAllFixes as applyAllFixesGeneric, lint as lintGeneric, type LintResult as LintResultGeneric } from "@cmdgen/engine";
import type { RsyslogdSpec } from "../spec";
import { RULES } from "./rules";

export type LintResult = LintResultGeneric<RsyslogdSpec>;

export function lint(spec: RsyslogdSpec): LintResult {
  return lintGeneric(spec, RULES);
}

/** Apply every diagnostic that offers a mechanical fix, in code order. */
export function applyAllFixes(spec: RsyslogdSpec): RsyslogdSpec {
  return applyAllFixesGeneric(spec, RULES);
}
