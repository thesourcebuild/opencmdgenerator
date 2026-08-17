import type { LintRule } from "@cmdgen/contracts/diagnostic";
import type { E2fsckSpec } from "../spec";

export const RULES: readonly LintRule<E2fsckSpec>[] = [];
export const RULE_CODES: readonly string[] = RULES.map((r) => r.code);
