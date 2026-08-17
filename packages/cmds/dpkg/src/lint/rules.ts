import type { LintRule } from "@cmdgen/contracts/diagnostic";
import type { DpkgSpec } from "../spec";

export const RULES: readonly LintRule<DpkgSpec>[] = [];
export const RULE_CODES: readonly string[] = RULES.map((r) => r.code);
