import type { LintRule } from "@cmdgen/contracts/diagnostic";
import type { NmcliSpec } from "../spec";

export const RULES: readonly LintRule<NmcliSpec>[] = [];
export const RULE_CODES: readonly string[] = RULES.map((r) => r.code);
