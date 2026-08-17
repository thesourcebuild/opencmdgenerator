import type { LintRule } from "@cmdgen/contracts/diagnostic";
import type { FlatpakSpec } from "../spec";

export const RULES: readonly LintRule<FlatpakSpec>[] = [];
export const RULE_CODES: readonly string[] = RULES.map((r) => r.code);
