import {
  applyAllFixes as applyAllFixesGeneric,
  lint as lintGeneric,
  type LintResult as LintResultGeneric,
} from "@cmdgen/engine";
import type { PacmanSpec } from "../spec";
import { RULES } from "./rules";

export type LintResult = LintResultGeneric<PacmanSpec>;

export function lint(spec: PacmanSpec): LintResult {
  return lintGeneric(spec, RULES);
}

/** Apply every diagnostic that offers a mechanical fix, in code order. */
export function applyAllFixes(spec: PacmanSpec): PacmanSpec {
  return applyAllFixesGeneric(spec, RULES);
}
