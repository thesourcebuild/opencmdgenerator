import type { LintRule } from "@cmdgen/contracts/diagnostic";
import type { ArchSpec } from "../spec";

export const RULES: readonly LintRule<ArchSpec>[] = [];
export const RULE_CODES: readonly string[] = RULES.map((r) => r.code);
