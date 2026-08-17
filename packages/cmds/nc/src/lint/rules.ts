import type { LintRule } from "@cmdgen/contracts/diagnostic";
import type { NcSpec } from "../spec";

export const RULES: readonly LintRule<NcSpec>[] = [];
export const RULE_CODES: readonly string[] = RULES.map((r) => r.code);
