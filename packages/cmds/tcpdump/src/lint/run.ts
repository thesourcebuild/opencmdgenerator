import {
  applyAllFixes as applyAllFixesGeneric,
  lint as lintGeneric,
  type LintResult as LintResultGeneric,
} from "@cmdgen/engine";
import type { TcpdumpSpec } from "../spec";
import { RULES } from "./rules";

export type LintResult = LintResultGeneric<TcpdumpSpec>;
export function lint(spec: TcpdumpSpec): LintResult {
  return lintGeneric(spec, RULES);
}
export function applyAllFixes(spec: TcpdumpSpec): TcpdumpSpec {
  return applyAllFixesGeneric(spec, RULES);
}
