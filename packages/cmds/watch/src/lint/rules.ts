import type { LintRule } from "@cmdgen/contracts/diagnostic";
import type { WatchSpec } from "../spec";

export const RULES: readonly LintRule<WatchSpec>[] = [];
export const RULE_CODES: readonly string[] = RULES.map((r) => r.code);
