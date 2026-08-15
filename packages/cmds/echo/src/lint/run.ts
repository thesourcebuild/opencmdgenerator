import { applyAllFixes as applyAllFixesGeneric, lint as lintGeneric, type LintResult as LintResultGeneric } from "@cmdgen/engine";
import type { EchoSpec } from "../spec";
import { RULES } from "./rules";

export type LintResult = LintResultGeneric<EchoSpec>;

export function lint(spec: EchoSpec): LintResult {
  return lintGeneric(spec, RULES);
}

/** Apply every diagnostic that offers a mechanical fix, in code order. */
export function applyAllFixes(spec: EchoSpec): EchoSpec {
  return applyAllFixesGeneric(spec, RULES);
}
