import {
  applyAllFixes as applyAllFixesGeneric,
  lint as lintGeneric,
  type LintResult as LintResultGeneric,
} from "@cmdgen/engine";
import type { FsckSpec } from "../spec";
import { RULES } from "./rules";

export type LintResult = LintResultGeneric<FsckSpec>;
export function lint(spec: FsckSpec): LintResult {
  return lintGeneric(spec, RULES);
}
export function applyAllFixes(spec: FsckSpec): FsckSpec {
  return applyAllFixesGeneric(spec, RULES);
}
