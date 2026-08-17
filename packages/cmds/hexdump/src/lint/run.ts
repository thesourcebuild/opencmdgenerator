import {
  applyAllFixes as applyAllFixesGeneric,
  lint as lintGeneric,
  type LintResult as LintResultGeneric,
} from "@cmdgen/engine";
import type { HexdumpSpec } from "../spec";
import { RULES } from "./rules";

export type LintResult = LintResultGeneric<HexdumpSpec>;
export function lint(spec: HexdumpSpec): LintResult {
  return lintGeneric(spec, RULES);
}
export function applyAllFixes(spec: HexdumpSpec): HexdumpSpec {
  return applyAllFixesGeneric(spec, RULES);
}
