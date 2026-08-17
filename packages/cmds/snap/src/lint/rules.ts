import type { LintRule } from "@cmdgen/contracts/diagnostic";
import type { SnapSpec } from "../spec";

export const RULES: readonly LintRule<SnapSpec>[] = [];
export const RULE_CODES: readonly string[] = RULES.map((r) => r.code);
