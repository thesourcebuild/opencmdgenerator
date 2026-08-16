import type { LintRule } from "@cmdgen/contracts/diagnostic";
import type { ExitSpec } from "../spec";

export const RULES: readonly LintRule<ExitSpec>[] = [];
export const RULE_CODES: readonly string[] = RULES.map((r) => r.code);
