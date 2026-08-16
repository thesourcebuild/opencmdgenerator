import type { LintRule } from "@cmdgen/contracts/diagnostic";
import type { UnaliasSpec } from "../spec";

export const RULES: readonly LintRule<UnaliasSpec>[] = [];
export const RULE_CODES: readonly string[] = RULES.map((r) => r.code);
