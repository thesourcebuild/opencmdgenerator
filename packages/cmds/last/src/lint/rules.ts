import type { LintRule } from "@cmdgen/contracts/diagnostic";
import type { LastSpec } from "../spec";

export const RULES: readonly LintRule<LastSpec>[] = [];
export const RULE_CODES: readonly string[] = RULES.map((r) => r.code);
