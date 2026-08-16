import {
  applyAllFixes as applyAllFixesGeneric,
  lint as lintGeneric,
  type LintResult as LintResultGeneric,
} from "@cmdgen/engine";
import type { SftpSpec } from "../spec";
import { RULES } from "./rules";

export type LintResult = LintResultGeneric<SftpSpec>;
export function lint(spec: SftpSpec): LintResult {
  return lintGeneric(spec, RULES);
}
export function applyAllFixes(spec: SftpSpec): SftpSpec {
  return applyAllFixesGeneric(spec, RULES);
}
