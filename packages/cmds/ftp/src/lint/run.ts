import {
  applyAllFixes as applyAllFixesGeneric,
  lint as lintGeneric,
  type LintResult as LintResultGeneric,
} from "@cmdgen/engine";
import type { FtpSpec } from "../spec";
import { RULES } from "./rules";

export type LintResult = LintResultGeneric<FtpSpec>;
export function lint(spec: FtpSpec): LintResult {
  return lintGeneric(spec, RULES);
}
export function applyAllFixes(spec: FtpSpec): FtpSpec {
  return applyAllFixesGeneric(spec, RULES);
}
