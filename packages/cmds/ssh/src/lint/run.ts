import { applyAllFixes as applyAllFixesGeneric, lint as lintGeneric, type LintResult as LintResultGeneric } from "@cmdgen/engine";
import type { SshSpec } from "../spec";
import { RULES } from "./rules";

export type LintResult = LintResultGeneric<SshSpec>;

export function lint(spec: SshSpec): LintResult {
  return lintGeneric(spec, RULES);
}

export function applyAllFixes(spec: SshSpec): SshSpec {
  return applyAllFixesGeneric(spec, RULES);
}
