import {
  applyAllFixes as applyAllFixesGeneric,
  lint as lintGeneric,
  type LintResult as LintResultGeneric,
} from "@cmdgen/engine";
import type { IpSpec } from "../spec";
import { RULES } from "./rules";

export type LintResult = LintResultGeneric<IpSpec>;
export function lint(spec: IpSpec): LintResult {
  return lintGeneric(spec, RULES);
}
export function applyAllFixes(spec: IpSpec): IpSpec {
  return applyAllFixesGeneric(spec, RULES);
}
