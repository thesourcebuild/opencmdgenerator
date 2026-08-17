import type { LintRule } from "@cmdgen/contracts/diagnostic";
import type { FirewalldSpec } from "../spec";

export const RULES: readonly LintRule<FirewalldSpec>[] = [];
export const RULE_CODES: readonly string[] = RULES.map((r) => r.code);
