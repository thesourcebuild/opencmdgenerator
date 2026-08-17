import type { LintRule } from "@cmdgen/contracts/diagnostic";
import type { NmapSpec } from "../spec";

export const RULES: readonly LintRule<NmapSpec>[] = [];
export const RULE_CODES: readonly string[] = RULES.map((r) => r.code);
