import type { LintRule } from "@cmdgen/contracts/diagnostic";
import type { ChattrSpec } from "../spec";

export const RULES: readonly LintRule<ChattrSpec>[] = [];
export const RULE_CODES: readonly string[] = RULES.map((r) => r.code);
