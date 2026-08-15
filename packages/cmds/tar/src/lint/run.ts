import {
  applyAllFixes as applyAllFixesGeneric,
  lint as lintGeneric,
  type LintResult as LintResultGeneric,
} from "@cmdgen/engine";
import type { TarSpec } from "../spec";
import { RULES } from "./rules";

export type LintResult = LintResultGeneric<TarSpec>;

export function lint(spec: TarSpec): LintResult {
  return lintGeneric(spec, RULES);
}

export function applyAllFixes(spec: TarSpec): TarSpec {
  return applyAllFixesGeneric(spec, RULES);
}
