import type { LintRule } from "@cmdgen/contracts/diagnostic";
import type { ModprobeSpec } from "../spec";

export const RULES: readonly LintRule<ModprobeSpec>[] = [];
export const RULE_CODES: readonly string[] = RULES.map((r) => r.code);
