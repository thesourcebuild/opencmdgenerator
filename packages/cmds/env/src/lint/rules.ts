import type { LintRule } from "@cmdgen/contracts/diagnostic";
import type { EnvSpec } from "../spec";

export const RULES: readonly LintRule<EnvSpec>[] = [];
export const RULE_CODES: readonly string[] = RULES.map((r) => r.code);
