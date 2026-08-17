import type { LintRule } from "@cmdgen/contracts/diagnostic";
import type { PartedSpec } from "../spec";

export const RULES: readonly LintRule<PartedSpec>[] = [];
export const RULE_CODES: readonly string[] = RULES.map((r) => r.code);
