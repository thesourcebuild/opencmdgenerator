import {
  applyAllFixes as applyAllFixesGeneric,
  lint as lintGeneric,
  type LintResult as LintResultGeneric,
} from "@cmdgen/engine";
import type { LastlogSpec } from "../spec";
import { RULES } from "./rules";

export type LintResult = LintResultGeneric<LastlogSpec>;
export function lint(spec: LastlogSpec): LintResult {
  return lintGeneric(spec, RULES);
}
export function applyAllFixes(spec: LastlogSpec): LastlogSpec {
  return applyAllFixesGeneric(spec, RULES);
}
