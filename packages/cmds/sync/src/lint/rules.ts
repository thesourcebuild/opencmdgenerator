import type { LintRule } from "@cmdgen/contracts/diagnostic";
import type { SyncSpec } from "../spec";

export const RULES: readonly LintRule<SyncSpec>[] = [];
export const RULE_CODES: readonly string[] = RULES.map((r) => r.code);
