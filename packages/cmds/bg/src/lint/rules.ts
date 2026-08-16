import type { LintRule } from "@cmdgen/contracts/diagnostic";
import type { BgSpec } from "../spec";

export const RULES: readonly LintRule<BgSpec>[] = [];
export const RULE_CODES: readonly string[] = RULES.map((r) => r.code);
