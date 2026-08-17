import type { LintRule } from "@cmdgen/contracts/diagnostic";
import type { TcpdumpSpec } from "../spec";

export const RULES: readonly LintRule<TcpdumpSpec>[] = [];
export const RULE_CODES: readonly string[] = RULES.map((r) => r.code);
