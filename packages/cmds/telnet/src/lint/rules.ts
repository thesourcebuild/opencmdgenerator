import type { LintRule } from "@cmdgen/contracts/diagnostic";
import type { TelnetSpec } from "../spec";

export const RULES: readonly LintRule<TelnetSpec>[] = [];
export const RULE_CODES: readonly string[] = RULES.map((r) => r.code);
