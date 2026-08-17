import type { LintRule } from "@cmdgen/contracts/diagnostic";
import type { RmmodSpec } from "../spec";

export const RULES: readonly LintRule<RmmodSpec>[] = [];
export const RULE_CODES: readonly string[] = RULES.map((r) => r.code);
