import type { LintRule } from "@cmdgen/contracts/diagnostic";
import type { LspciSpec } from "../spec";

export const RULES: readonly LintRule<LspciSpec>[] = [];
export const RULE_CODES: readonly string[] = RULES.map((r) => r.code);
